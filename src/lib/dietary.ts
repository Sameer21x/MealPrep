import {
  ALLERGEN_EGGS,
  ALLERGEN_GLUTEN,
  ALLERGEN_MILK,
  DAIRY_CATEGORIES,
  DAIRY_DEPARTMENTS,
  EGG_CATEGORIES,
  EXCLUSIVE_DIETS,
  FISH_CATEGORIES,
  FISH_DEPARTMENTS,
  LABEL_VEGAN,
  LABEL_VEGETARIAN,
  MEAT_CATEGORIES,
  MEAT_DEPARTMENTS,
  SEAFOOD_ALLERGENS,
  type DietaryNeedId,
} from '@/constants/dietary';
import type { Product } from '@/types/product';

export function toggleDietaryNeed(
  current: readonly DietaryNeedId[],
  id: DietaryNeedId,
): DietaryNeedId[] {
  if (id === 'none') {
    return current.includes('none') ? [] : ['none'];
  }

  const without = current.filter((need) => need !== 'none');

  if (without.includes(id)) {
    return without.filter((need) => need !== id);
  }

  if (EXCLUSIVE_DIETS.includes(id)) {
    return [...without.filter((need) => !EXCLUSIVE_DIETS.includes(need)), id];
  }

  return [...without, id];
}

function has(taxa: { id: string }[] | undefined, ids: readonly string[]) {
  return (taxa ?? []).some((taxon) => ids.includes(taxon.id));
}

function isMeat(product: Product) {
  return (
    MEAT_DEPARTMENTS.includes(product.department?.id) ||
    (product.category != null && MEAT_CATEGORIES.includes(product.category.id))
  );
}

function isFish(product: Product) {
  return (
    FISH_DEPARTMENTS.includes(product.department?.id) ||
    (product.category != null && FISH_CATEGORIES.includes(product.category.id)) ||
    has(product.allergens, SEAFOOD_ALLERGENS)
  );
}

function isDairyOrEgg(product: Product) {
  return (
    DAIRY_DEPARTMENTS.includes(product.department?.id) ||
    (product.category != null &&
      (DAIRY_CATEGORIES.includes(product.category.id) ||
        EGG_CATEGORIES.includes(product.category.id))) ||
    has(product.allergens, [ALLERGEN_MILK, ALLERGEN_EGGS])
  );
}

export function matchesDietaryNeeds(product: Product, needs: readonly DietaryNeedId[]): boolean {
  if (needs.length === 0 || needs.includes('none')) {
    return true;
  }

  const labelledVegan = has(product.labels, [LABEL_VEGAN]);
  const labelledVegetarian = labelledVegan || has(product.labels, [LABEL_VEGETARIAN]);

  for (const need of needs) {
    switch (need) {
      case 'veggie':
        if (!labelledVegetarian && (isMeat(product) || isFish(product))) {
          return false;
        }
        break;

      case 'vegan':
        if (!labelledVegan && (isMeat(product) || isFish(product) || isDairyOrEgg(product))) {
          return false;
        }
        break;

      case 'pescatarian':
        if (isMeat(product)) {
          return false;
        }
        break;

      case 'glutenFree':
        if (has(product.allergens, [ALLERGEN_GLUTEN])) {
          return false;
        }
        break;

      case 'dairyFree':
        if (
          has(product.allergens, [ALLERGEN_MILK]) ||
          DAIRY_DEPARTMENTS.includes(product.department?.id) ||
          (product.category != null && DAIRY_CATEGORIES.includes(product.category.id))
        ) {
          return false;
        }
        break;

      default:
        break;
    }
  }

  return true;
}

export function filterByDietaryNeeds(
  products: readonly Product[],
  needs: readonly DietaryNeedId[],
): Product[] {
  return products.filter((product) => matchesDietaryNeeds(product, needs));
}
