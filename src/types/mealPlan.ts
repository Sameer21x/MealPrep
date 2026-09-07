import { z } from 'zod';

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
});

export const mealSchema = z.object({
  name: z.string().min(1),
  prepMinutes: z.number().int().nonnegative(),
  servings: z.number().int().positive(),
  pricePerServing: z.number().nonnegative(),
  tags: z.array(z.string()),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(z.string().min(1)).min(1),
});

export const dayPlanSchema = z.object({
  day: z.string().min(1),
  meals: z.array(mealSchema).min(1),
});

export const mealPlanSchema = z.object({
  days: z.array(dayPlanSchema).length(WEEKDAYS.length),
});

export const singleMealSchema = z.object({ meal: mealSchema });

export type Ingredient = z.infer<typeof ingredientSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type DayPlan = z.infer<typeof dayPlanSchema>;
export type MealPlan = z.infer<typeof mealPlanSchema>;

export function weekCost(plan: MealPlan): number {
  return plan.days.reduce(
    (total, day) =>
      total + day.meals.reduce((sum, meal) => sum + meal.pricePerServing * meal.servings, 0),
    0,
  );
}
