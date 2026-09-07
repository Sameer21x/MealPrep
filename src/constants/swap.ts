import type { NutritionalGoal } from '@/constants/nutrition';

export const SWAP_PREFERENCES = ['faster', 'cheaper', 'healthier', 'surprise'] as const;

export type SwapPreference = (typeof SWAP_PREFERENCES)[number];

export type SwapPreferenceOption = {
  id: SwapPreference;
  emoji: string;
};

/** Order matches the popup: faster, cheaper, healthier, surprise. */
export const SWAP_PREFERENCE_OPTIONS: readonly SwapPreferenceOption[] = [
  { id: 'faster', emoji: '⚡' },
  { id: 'cheaper', emoji: '💰' },
  { id: 'healthier', emoji: '🥗' },
  { id: 'surprise', emoji: '🔄' },
];

/** Same as the weekly-plan call; surprise is the only preference that turns this up. */
export const SWAP_TEMPERATURE = 0.4;
export const SURPRISE_TEMPERATURE = 0.7;

export const FASTER_MINUTES_DELTA = 10;
export const FASTER_MINUTES_FLOOR = 10;
export const CHEAPER_PRICE_RATIO = 0.7;

/** Used only when the user picked nothing (or "None") on the nutritional goals screen. */
export const HEALTHIER_DEFAULT_GOALS: readonly NutritionalGoal[] = ['low_fat', 'low_sugar'];
