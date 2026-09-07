import { NUTRITION_RULES, type NutritionalGoalSelection } from '@/constants/nutrition';
import type { Product } from '@/types/product';

/**
 * Mirrors `toggleDietaryNeed`: picking "None" clears everything, and picking anything else drops
 * "None". Unlike the dietary needs there are no mutually exclusive groups here, so every goal
 * simply stacks.
 */
export function toggleNutritionalGoal(
  current: readonly NutritionalGoalSelection[],
  id: NutritionalGoalSelection,
): NutritionalGoalSelection[] {
  if (id === 'none') {
    return current.includes('none') ? [] : ['none'];
  }

  const without = current.filter((goal) => goal !== 'none');

  return without.includes(id) ? without.filter((goal) => goal !== id) : [...without, id];
}

export function matchesNutritionalGoals(
  product: Product,
  goals: readonly NutritionalGoalSelection[],
): boolean {
  if (goals.length === 0 || goals.includes('none')) {
    return true;
  }

  const nutrition = product.nutrition;

  // No nutrition block at all: there is nothing to test the goal against, so it cannot qualify.
  if (nutrition == null) {
    return false;
  }

  // Goals combine with AND: a product has to satisfy every one of them.
  for (const goal of goals) {
    if (goal === 'none') {
      continue;
    }

    const rule = NUTRITION_RULES[goal];
    const value = nutrition[rule.field];

    // A missing or non-numeric reading is never silently read as zero.
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return false;
    }

    if (rule.min != null && value < rule.min) {
      return false;
    }

    if (rule.max != null && value > rule.max) {
      return false;
    }
  }

  return true;
}

export function filterByNutritionalGoals(
  products: readonly Product[],
  goals: readonly NutritionalGoalSelection[],
): Product[] {
  return products.filter((product) => matchesNutritionalGoals(product, goals));
}
