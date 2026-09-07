import { fontFamily } from '@/constants/fonts';

/**
 * Promo reports ascent 1.1283em + descent 0.2565em, so its natural line box is 1.385x the
 * font size. Every lineHeight below stays at or above that figure; going under it makes
 * Android clip descenders.
 */
export const typography = {
  /** Lander wordmark. Ink measures 224x34 in the 393pt comp, matched to Promo Bold at 48. */
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 68,
    letterSpacing: -1,
  },
  /**
   * Screen question headline. Semi Bold is what the comps measure: it predicts their ink widths
   * (329 / 301 / 347) to within 4pt, where Bold overshoots every one by 11-13 and pushes
   * "Any nutritional goals?" past the 353pt gutter box onto a second line.
   */
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 33,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  /** Budget figure. Comp digits are 69pt tall; lineHeight keeps the baseline inside the box. */
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 96,
    lineHeight: 100,
    letterSpacing: -1,
  },
  /** "Bon appetit!" on the meal plan. Comp ink is 245x41, which fits Semi Bold at 40. */
  screenTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: -0.8,
  },
  heading: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  /** Day name inside the meal card. Comp ink is 94pt wide for "Monday". */
  dayTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 24,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  /** Meal name. Comp ink is 227pt for "BBQ Chicken Loaded Jackets". */
  mealName: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  /** "Ingredients" / "Recipe". Comp ink is 83 and 47pt wide. */
  sectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  /** Prep time, servings, price per serving, and the "Est. cost" caption. */
  meta: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 19,
  },
  /** Day pills. */
  pillLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 19,
  },
  tagLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 23,
  },
  /** Option card label. Comp ink is 90pt wide for "Pescatarian", 95 for "High protein". */
  cardLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: -0.45,
  },
  buttonLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 23,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
} as const;
