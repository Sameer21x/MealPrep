import type { DietaryNeedId } from '@/constants/dietary';
import type { NutritionalGoalSelection } from '@/constants/nutrition';
import { matchesDietaryNeeds } from '@/lib/dietary';
import { matchesNutritionalGoals } from '@/lib/nutrition';
import type { Product } from '@/types/product';

export type CatalogSelections = {
  /** Weekly budget in euros. */
  budget: number;
  dietaryNeeds: readonly DietaryNeedId[];
  nutritionalGoals: readonly NutritionalGoalSelection[];
};

/**
 * A single item costing more than the entire week's budget can never appear in the plan, so it is
 * dropped up front. Keeping the basket total under budget is a different problem — that belongs to
 * whatever assembles the plan, since it depends on how many items get picked.
 */
export function isWithinBudget(product: Product, budget: number): boolean {
  const price = product.price?.amount;

  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return false;
  }

  return price <= budget;
}

/**
 * The one call screen 05 makes before building its prompt: every filter ANDed together, so the
 * result is the set of products that satisfies the budget, the dietary needs and the nutritional
 * goals at once.
 */
export function composeFilters(
  products: readonly Product[],
  { budget, dietaryNeeds, nutritionalGoals }: CatalogSelections,
): Product[] {
  return products.filter(
    (product) =>
      isWithinBudget(product, budget) &&
      matchesDietaryNeeds(product, dietaryNeeds) &&
      matchesNutritionalGoals(product, nutritionalGoals),
  );
}
