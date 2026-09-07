export const CARD_WIDTH = 336;
export const CARD_GAP = 12;
export const CARD_TOP = 306;

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export type MealSlotKey = 'breakfast' | 'lunch' | 'dinner' | 'extra';

export function slotKeysFor(mealCount: number): readonly MealSlotKey[] {
  if (mealCount <= 1) {
    return [];
  }
  if (mealCount === 2) {
    return ['lunch', 'dinner'];
  }
  if (mealCount === 3) {
    return ['breakfast', 'lunch', 'dinner'];
  }
  return ['breakfast', 'lunch', 'dinner', 'extra'];
}

export const MIN_PROMPT_PRODUCTS = 60;

export const PLAN_STAGES = ['preferences', 'ingredients', 'budget', 'recipes'] as const;

export type PlanStage = (typeof PLAN_STAGES)[number];

export type GenerationStage = PlanStage | 'ready';
