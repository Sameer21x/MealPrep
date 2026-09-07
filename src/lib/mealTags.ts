import type { DietaryNeedId } from '@/constants/dietary';
import type { NutritionalGoalSelection } from '@/constants/nutrition';

/**
 * Discriminated so the id can only ever be paired with its own i18n namespace: a dietary id can
 * never be looked up under `nutrition.options`.
 */
export type MatchedTag =
  | { kind: 'dietary'; id: Exclude<DietaryNeedId, 'none'> }
  | { kind: 'nutrition'; id: Exclude<NutritionalGoalSelection, 'none'> };

/** "High protein", "high_protein" and "high-protein" all collapse to the same key. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * The model is asked for plain wording ("vegetarian", "low salt"), which does not always match our
 * internal id, so each id carries the spellings we are willing to accept back.
 */
const ALIASES: Record<MatchedTag['id'], readonly string[]> = {
  veggie: ['veggie', 'vegetarian'],
  vegan: ['vegan', 'plantbased'],
  pescatarian: ['pescatarian', 'pescetarian'],
  glutenFree: ['glutenfree', 'nogluten'],
  dairyFree: ['dairyfree', 'lactosefree', 'nodairy'],
  high_protein: ['highprotein', 'proteinrich'],
  low_sugar: ['lowsugar', 'nosugar', 'sugarfree'],
  low_fat: ['lowfat'],
  low_carbs: ['lowcarbs', 'lowcarb', 'lowcarbohydrate'],
  low_salt: ['lowsalt', 'lowsodium'],
};

/**
 * Keeps only the tags the model returned that correspond to something the user actually asked
 * for, so the pills read as confirmation of their choices rather than generic labels.
 */
export function matchSelectedTags(
  tags: readonly string[],
  dietaryNeeds: readonly DietaryNeedId[],
  nutritionalGoals: readonly NutritionalGoalSelection[],
): MatchedTag[] {
  const returned = new Set(tags.map(normalise));
  const matched: MatchedTag[] = [];

  const claims = (id: MatchedTag['id']) => ALIASES[id].some((alias) => returned.has(alias));

  for (const id of dietaryNeeds) {
    if (id !== 'none' && claims(id)) {
      matched.push({ kind: 'dietary', id });
    }
  }

  for (const id of nutritionalGoals) {
    if (id !== 'none' && claims(id)) {
      matched.push({ kind: 'nutrition', id });
    }
  }

  return matched;
}
