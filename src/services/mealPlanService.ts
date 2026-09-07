import type { ZodType } from 'zod';

import type { DietaryNeedId } from '@/constants/dietary';
import { hasOpenAIKey, OPENAI_API_KEY, OPENAI_MODEL } from '@/constants/env';
import { MIN_PROMPT_PRODUCTS, type PlanStage } from '@/constants/mealPlan';
import type { NutritionalGoal, NutritionalGoalSelection } from '@/constants/nutrition';
import type { SwapPreference } from '@/constants/swap';
import { getCatalog } from '@/lib/catalog';
import { composeFilters } from '@/lib/filterCatalog';
import { buildSwapConstraints } from '@/lib/swap';
import { wait } from '@/lib/wait';
import {
  mealPlanSchema,
  singleMealSchema,
  WEEKDAYS,
  type Meal,
  type MealPlan,
} from '@/types/mealPlan';
import type { Product } from '@/types/product';

const ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const TEMPERATURE = 0.4;
const PROMPT_PRODUCT_LIMIT = 150;
const REQUEST_TIMEOUT_MS = 60_000;
const MEALS_PER_DAY = 2;
const SERVINGS_PER_MEAL = 2;

const STAGE_DWELL_MS = 750;

export type MealPlanErrorCode = 'missing_key' | 'network' | 'invalid_response';

export class MealPlanError extends Error {
  readonly code: MealPlanErrorCode;

  constructor(code: MealPlanErrorCode, message: string) {
    super(message);
    this.name = 'MealPlanError';
    this.code = code;
  }
}

export type MealPlanRequest = {
  budget: number;
  dietaryNeeds: readonly DietaryNeedId[];
  nutritionalGoals: readonly NutritionalGoalSelection[];
};

const DIETARY_LABEL: Record<Exclude<DietaryNeedId, 'none'>, string> = {
  veggie: 'vegetarian',
  vegan: 'vegan',
  pescatarian: 'pescatarian',
  glutenFree: 'gluten free',
  dairyFree: 'dairy free',
};

const GOAL_LABEL: Record<Exclude<NutritionalGoalSelection, 'none'>, string> = {
  high_protein: 'high protein (at least 10g protein per 100g)',
  low_sugar: 'low sugar (at most 5g sugar per 100g)',
  low_fat: 'low fat (at most 3g fat per 100g)',
  low_carbs: 'low carbohydrate (at most 10g carbs per 100g)',
  low_salt: 'low salt (at most 0.3g salt per 100g)',
};

export function selectPromptProducts(
  products: readonly Product[],
  limit = PROMPT_PRODUCT_LIMIT,
): Product[] {
  const byDepartment = new Map<string, Product[]>();

  for (const product of products) {
    const key = product.department?.id ?? 'other';
    const bucket = byDepartment.get(key);
    if (bucket) {
      bucket.push(product);
    } else {
      byDepartment.set(key, [product]);
    }
  }

  for (const bucket of byDepartment.values()) {
    bucket.sort((a, b) => a.price.amount - b.price.amount);
  }

  const buckets = [...byDepartment.values()];
  const picked: Product[] = [];

  for (let round = 0; picked.length < limit; round += 1) {
    let addedThisRound = false;

    for (const bucket of buckets) {
      if (round >= bucket.length) {
        continue;
      }
      picked.push(bucket[round]);
      addedThisRound = true;
      if (picked.length === limit) {
        break;
      }
    }

    if (!addedThisRound) {
      break;
    }
  }

  return picked;
}

function formatProducts(products: readonly Product[]): string {
  return products
    .map((product) => {
      const department = product.department?.name ?? 'Other';
      const protein = product.nutrition?.proteins100g;
      const proteinNote = typeof protein === 'number' ? `, ${protein}g protein/100g` : '';
      return `- ${product.name} (${department}, EUR ${product.price.amount.toFixed(2)}${proteinNote})`;
    })
    .join('\n');
}

function describeConstraints({ budget, dietaryNeeds, nutritionalGoals }: MealPlanRequest): string {
  const diets = dietaryNeeds
    .filter((id): id is Exclude<DietaryNeedId, 'none'> => id !== 'none')
    .map((id) => DIETARY_LABEL[id]);

  const goals = nutritionalGoals
    .filter((id): id is Exclude<NutritionalGoalSelection, 'none'> => id !== 'none')
    .map((id) => GOAL_LABEL[id]);

  return [
    `Weekly grocery budget: EUR ${budget}.`,
    `Dietary needs: ${diets.length > 0 ? diets.join(', ') : 'none'}.`,
    `Nutritional goals: ${goals.length > 0 ? goals.join(', ') : 'none'}.`,
  ].join('\n');
}

const MEAL_SCHEMA_BLOCK = `{
  "name": "string",
  "prepMinutes": 25,
  "servings": 2,
  "pricePerServing": 4.18,
  "tags": ["string"],
  "ingredients": [{ "name": "string", "quantity": "200g" }],
  "steps": ["string"]
}`;

const PLAN_SCHEMA_BLOCK = `{
  "days": [
    { "day": "Monday", "meals": [ ${MEAL_SCHEMA_BLOCK} ] }
  ]
}`;

const SYSTEM_PROMPT =
  'You are a meal planning assistant for an Italian grocery app. You reply with valid JSON only, never prose, never markdown fences.';

const STRICT_RETRY_REMINDER =
  'Your previous reply could not be parsed. Return valid JSON only, matching the schema exactly, with no prose, explanation or markdown fences.';

function buildPlanPrompt(request: MealPlanRequest, products: readonly Product[]): string {
  const perServingCap = request.budget / (WEEKDAYS.length * MEALS_PER_DAY * SERVINGS_PER_MEAL);
  const perServingFloor = perServingCap * 0.75;

  return [
    'Build a 7-day meal plan as JSON.',
    '',
    describeConstraints(request),
    '',
    'Rules:',
    `1. Return ONLY valid JSON matching this schema, with no prose or markdown:\n${PLAN_SCHEMA_BLOCK}`,
    '2. Use ONLY ingredients from the available products list below. Do not invent ingredients.',
    `3. Include exactly 7 day objects, in order: ${WEEKDAYS.join(', ')}.`,
    `4. Give every day exactly ${MEALS_PER_DAY} meals, lunch first and dinner second. Every meal has "servings": ${SERVINGS_PER_MEAL}.`,
    `5. Every meal's pricePerServing must be between EUR ${perServingFloor.toFixed(2)} and EUR ${perServingCap.toFixed(2)}. That band is what keeps the week inside the EUR ${request.budget} budget, so stay in it for every single meal.`,
    '6. Every meal needs 3 to 6 different ingredients and 3 to 6 clear cooking steps. No single-ingredient meals.',
    '7. Vary the meals across the week. Do not repeat the same dish twice.',
    '8. Every meal must respect all of the dietary needs and nutritional goals listed above.',
    '9. "tags" lists which of those dietary needs and nutritional goals the meal satisfies, using the same wording as above (for example "vegan", "high protein").',
    '10. prepMinutes, servings and pricePerServing are numbers. pricePerServing is in euros.',
    '',
    'Available products:',
    formatProducts(products),
  ].join('\n');
}

type ChatMessage = { role: 'system' | 'user'; content: string };

async function postChat(messages: ChatMessage[], temperature = TEMPERATURE): Promise<string> {
  if (!hasOpenAIKey) {
    throw new MealPlanError(
      'missing_key',
      'No OpenAI key found. Add EXPO_PUBLIC_OPENAI_API_KEY to .env and restart the bundler.',
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature,
        response_format: { type: 'json_object' },
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new MealPlanError('network', `OpenAI request failed with status ${response.status}.`);
    }

    const payload: unknown = await response.json();
    const content = (payload as { choices?: { message?: { content?: string } }[] }).choices?.[0]
      ?.message?.content;

    if (typeof content !== 'string' || content.length === 0) {
      throw new MealPlanError('invalid_response', 'OpenAI returned an empty response.');
    }

    return content;
  } catch (error) {
    if (error instanceof MealPlanError) {
      throw error;
    }
    throw new MealPlanError('network', 'Could not reach OpenAI. Check your connection.');
  } finally {
    clearTimeout(timeout);
  }
}

function parseAndValidate<T>(raw: string, schema: ZodType<T>): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new MealPlanError('invalid_response', 'The model did not return JSON.');
  }

  const result = schema.safeParse(parsed);

  if (!result.success) {
    throw new MealPlanError('invalid_response', 'The plan did not match the expected shape.');
  }

  return result.data;
}

async function requestValidated<T>(
  messages: ChatMessage[],
  schema: ZodType<T>,
  temperature = TEMPERATURE,
): Promise<T> {
  try {
    return parseAndValidate(await postChat(messages, temperature), schema);
  } catch (error) {
    if (error instanceof MealPlanError && error.code !== 'invalid_response') {
      throw error;
    }

    const retried = await postChat(
      [...messages, { role: 'user', content: STRICT_RETRY_REMINDER }],
      temperature,
    );
    return parseAndValidate(retried, schema);
  }
}

function sortDays(plan: MealPlan): MealPlan {
  const rank = new Map<string, number>(
    WEEKDAYS.map((day, index) => [day.toLowerCase(), index] as const),
  );

  return {
    days: [...plan.days].sort(
      (a, b) => (rank.get(a.day.toLowerCase()) ?? 99) - (rank.get(b.day.toLowerCase()) ?? 99),
    ),
  };
}

type ResolvedProducts = {
  products: Product[];
  relaxed: NutritionalGoal[];
};

function countMatching(request: MealPlanRequest, goals: readonly NutritionalGoal[]): number {
  return composeFilters(getCatalog(), {
    budget: request.budget,
    dietaryNeeds: request.dietaryNeeds,
    nutritionalGoals: goals,
  }).length;
}

function resolveProducts(request: MealPlanRequest): ResolvedProducts {
  const catalog = getCatalog();
  let active = request.nutritionalGoals.filter((goal): goal is NutritionalGoal => goal !== 'none');
  const relaxed: NutritionalGoal[] = [];

  const matchesFor = (goals: readonly NutritionalGoal[]) =>
    composeFilters(catalog, {
      budget: request.budget,
      dietaryNeeds: request.dietaryNeeds,
      nutritionalGoals: goals,
    });

  let products = matchesFor(active);

  while (products.length < MIN_PROMPT_PRODUCTS && active.length > 0) {
    let victim = active[0];
    let bestCount = -1;

    for (const candidate of active) {
      const count = countMatching(
        request,
        active.filter((goal) => goal !== candidate),
      );
      if (count > bestCount) {
        bestCount = count;
        victim = candidate;
      }
    }

    active = active.filter((goal) => goal !== victim);
    relaxed.push(victim);
    products = matchesFor(active);
  }

  return { products, relaxed };
}

export type GeneratedPlan = {
  plan: MealPlan;
  relaxedGoals: NutritionalGoal[];
};

export type StageReporter = (stage: PlanStage) => void;

async function paced<T>(work: () => T): Promise<T> {
  const started = Date.now();
  const result = work();
  const remaining = STAGE_DWELL_MS - (Date.now() - started);

  if (remaining > 0) {
    await wait(remaining);
  }

  return result;
}

export async function generateMealPlan(
  request: MealPlanRequest,
  onStage: StageReporter = () => {},
): Promise<GeneratedPlan> {
  onStage('preferences');
  const { products, relaxed } = await paced(() => resolveProducts(request));

  if (products.length === 0) {
    throw new MealPlanError(
      'invalid_response',
      'No products match those dietary needs within that budget. Try changing a dietary need.',
    );
  }

  onStage('ingredients');
  const shortlist = await paced(() => selectPromptProducts(products));

  // The budget becomes the per-serving band the prompt is built around.
  onStage('budget');
  const prompt = await paced(() => buildPlanPrompt(request, shortlist));

  onStage('recipes');
  const plan = await requestValidated(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    mealPlanSchema,
  );

  return { plan: sortDays(plan), relaxedGoals: relaxed };
}

function buildReplacementPrompt(
  request: MealPlanRequest,
  day: string,
  previousMeal: Meal,
  products: readonly Product[],
  extraRules: readonly string[],
): string {
  return [
    `Replace one meal in a weekly plan. It is ${day}'s meal, currently "${previousMeal.name}" (${previousMeal.prepMinutes} min, EUR ${previousMeal.pricePerServing.toFixed(2)} per serving).`,
    '',
    describeConstraints(request),
    '',
    'Rules:',
    `1. Return ONLY valid JSON matching this schema, with no prose or markdown:\n{ "meal": ${MEAL_SCHEMA_BLOCK} }`,
    '2. Use ONLY ingredients from the available products list below. Do not invent ingredients.',
    `3. The replacement must be clearly different from "${previousMeal.name}".`,
    '4. Respect every dietary need and nutritional goal listed above. Dietary needs are non-negotiable.',
    `5. Use 3 to 6 different ingredients. "servings" is always ${SERVINGS_PER_MEAL}. prepMinutes must match this recipe.`,
    ...extraRules,
    '',
    'Available products:',
    formatProducts(selectPromptProducts(products)),
  ].join('\n');
}

/**
 * Regenerates a single meal. Dietary needs stay whatever the user chose on screen 3. Nutritional
 * goals stay too, except Healthier fills in low-fat + low-sugar when they had picked none.
 */
export async function generateReplacementMeal(
  request: MealPlanRequest,
  day: string,
  previousMeal: Meal,
  preference: SwapPreference,
): Promise<Meal> {
  const constraints = buildSwapConstraints(preference, previousMeal, request.nutritionalGoals);
  const filteredRequest = { ...request, nutritionalGoals: constraints.nutritionalGoals };
  const { products } = resolveProducts(filteredRequest);

  const extraRules: string[] = [`6. ${constraints.nudge}`];

  if (constraints.maxPrepMinutes != null) {
    extraRules.push(
      `7. prepMinutes MUST be ${constraints.maxPrepMinutes} or less. Use 2 to 4 short cooking steps.`,
    );
  }

  if (constraints.maxPricePerServing != null) {
    extraRules.push(
      `7. pricePerServing MUST be EUR ${constraints.maxPricePerServing.toFixed(2)} or less.`,
    );
  }

  if (preference === 'surprise') {
    extraRules.push(
      '7. Do not make a close variation of the current meal. Change the cuisine or the main protein.',
    );
  }

  const prompt = buildReplacementPrompt(filteredRequest, day, previousMeal, products, extraRules);

  const { meal } = await requestValidated(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    singleMealSchema,
    constraints.temperature,
  );

  return meal;
}
