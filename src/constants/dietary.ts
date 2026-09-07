export type DietaryNeedId =
  'none' | 'veggie' | 'vegan' | 'pescatarian' | 'glutenFree' | 'dairyFree';

export type DietaryOption = {
  id: DietaryNeedId;
  emoji?: string;
};

export const DIETARY_OPTIONS: readonly DietaryOption[] = [
  { id: 'none' },
  { id: 'veggie', emoji: '🥕' },
  { id: 'vegan', emoji: '🌱' },
  { id: 'pescatarian', emoji: '🐟' },
  { id: 'glutenFree', emoji: '🌾' },
  { id: 'dairyFree', emoji: '🥛' },
];

/**
 * The three eating patterns are alternatives to one another, while the two "free from" needs
 * stack on top of any of them. "None" clears everything.
 */
export const EXCLUSIVE_DIETS: readonly DietaryNeedId[] = ['veggie', 'vegan', 'pescatarian'];

/**
 * Taxonomy taken from the catalogue itself: 17 departments, 73 categories and 14 allergen ids
 * across 3,295 products. Departments are the coarse net, categories catch animal products that
 * sit in mixed departments (a ham in "pantry", a cheese in "breakfast"), and allergens catch the
 * rest. `en:meat-alternatives` is deliberately absent everywhere: it is plant protein.
 */
export const MEAT_DEPARTMENTS: readonly string[] = ['carne', 'salumi'];
export const FISH_DEPARTMENTS: readonly string[] = ['pesce'];
export const DAIRY_DEPARTMENTS: readonly string[] = ['latticini'];

export const MEAT_CATEGORIES: readonly string[] = [
  'en:meats',
  'en:hams',
  'en:poultries',
  'en:prepared-meats',
  'en:sausages',
];

export const FISH_CATEGORIES: readonly string[] = ['en:fishes', 'en:canned-fishes', 'en:seafood'];

export const DAIRY_CATEGORIES: readonly string[] = [
  'en:cheeses',
  'en:yogurts',
  'en:milks',
  'en:butters',
  'en:creams',
];

export const EGG_CATEGORIES: readonly string[] = ['en:eggs'];

export const ALLERGEN_GLUTEN = 'en:gluten';
export const ALLERGEN_MILK = 'en:milk';
export const ALLERGEN_EGGS = 'en:eggs';
export const SEAFOOD_ALLERGENS: readonly string[] = ['en:fish', 'en:crustaceans', 'en:molluscs'];

export const LABEL_VEGAN = 'en:vegan';
export const LABEL_VEGETARIAN = 'en:vegetarian';
