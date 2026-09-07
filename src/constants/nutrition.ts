import type { Product } from '@/types/product';

export type NutritionalGoal = 'high_protein' | 'low_sugar' | 'low_fat' | 'low_carbs' | 'low_salt';

export type NutritionalGoalSelection = NutritionalGoal | 'none';

export type NutritionalGoalOption = {
  id: NutritionalGoalSelection;
  emoji?: string;
};

export const NUTRITIONAL_GOAL_OPTIONS: readonly NutritionalGoalOption[] = [
  { id: 'none' },
  { id: 'high_protein', emoji: '🥩' },
  { id: 'low_sugar', emoji: '🍯' },
  { id: 'low_fat', emoji: '🫑' },
  { id: 'low_carbs', emoji: '🍝' },
  { id: 'low_salt', emoji: '🧂' },
];

type NutritionField = keyof Product['nutrition'];

/** Thresholds are per 100g, matching the catalogue's `nutrition` object. */
export const NUTRITION_RULES: Record<
  NutritionalGoal,
  { field: NutritionField; min?: number; max?: number }
> = {
  high_protein: { field: 'proteins100g', min: 10 },
  low_sugar: { field: 'sugars100g', max: 5 },
  low_fat: { field: 'fat100g', max: 3 },
  low_carbs: { field: 'carbohydrates100g', max: 10 },
  low_salt: { field: 'salt100g', max: 0.3 },
};
