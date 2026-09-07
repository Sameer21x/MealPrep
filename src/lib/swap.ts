import type { NutritionalGoal, NutritionalGoalSelection } from '@/constants/nutrition';
import {
  CHEAPER_PRICE_RATIO,
  FASTER_MINUTES_DELTA,
  FASTER_MINUTES_FLOOR,
  HEALTHIER_DEFAULT_GOALS,
  SURPRISE_TEMPERATURE,
  SWAP_TEMPERATURE,
  type SwapPreference,
} from '@/constants/swap';
import type { Meal } from '@/types/mealPlan';

export type SwapConstraints = {
  preference: SwapPreference;
  temperature: number;
  /** English prompt line; the catalogue the model cooks from is English. */
  nudge: string;
  maxPrepMinutes?: number;
  maxPricePerServing?: number;
  /**
   * Goals sent to composeFilters / the prompt. Dietary needs never live here — those stay on the
   * original request so a swap cannot drop an allergy or ethic the user already chose.
   */
  nutritionalGoals: readonly NutritionalGoalSelection[];
};

const NUDGE: Record<SwapPreference, string> = {
  faster: 'Fewer steps, minimal active cooking time.',
  cheaper: 'Prioritize inexpensive, simple ingredients.',
  healthier: 'Favor whole ingredients over processed ones.',
  surprise: 'Something different in style from the current meal — a different cuisine or protein.',
};

function selectedGoals(goals: readonly NutritionalGoalSelection[]): NutritionalGoal[] {
  return goals.filter((goal): goal is NutritionalGoal => goal !== 'none');
}

/**
 * Turns a popup choice plus the meal on screen into the extra constraints for a replacement call.
 * Nutritional goals from onboarding are kept, except Healthier fills in low-fat + low-sugar when
 * the user had picked none.
 */
export function buildSwapConstraints(
  preference: SwapPreference,
  meal: Meal,
  nutritionalGoals: readonly NutritionalGoalSelection[],
): SwapConstraints {
  switch (preference) {
    case 'faster':
      return {
        preference,
        temperature: SWAP_TEMPERATURE,
        nudge: NUDGE.faster,
        maxPrepMinutes: Math.max(FASTER_MINUTES_FLOOR, meal.prepMinutes - FASTER_MINUTES_DELTA),
        nutritionalGoals,
      };
    case 'cheaper':
      return {
        preference,
        temperature: SWAP_TEMPERATURE,
        nudge: NUDGE.cheaper,
        maxPricePerServing: Math.round(meal.pricePerServing * CHEAPER_PRICE_RATIO * 100) / 100,
        nutritionalGoals,
      };
    case 'healthier': {
      const active = selectedGoals(nutritionalGoals);
      return {
        preference,
        temperature: SWAP_TEMPERATURE,
        nudge: NUDGE.healthier,
        nutritionalGoals: active.length > 0 ? active : HEALTHIER_DEFAULT_GOALS,
      };
    }
    case 'surprise':
      return {
        preference,
        temperature: SURPRISE_TEMPERATURE,
        nudge: NUDGE.surprise,
        nutritionalGoals,
      };
  }
}
