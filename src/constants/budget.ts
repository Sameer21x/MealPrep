export const BUDGET_MIN = 25;
export const BUDGET_MAX = 150;
export const BUDGET_STEP = 1;
export const BUDGET_DEFAULT = 82;

export type BudgetTierId = 'friendly' | 'balanced' | 'variety' | 'flex';

export type BudgetTier = {
  id: BudgetTierId;
  emoji: string;
  min: number;
  max: number;
};

export const BUDGET_TIERS: readonly BudgetTier[] = [
  { id: 'friendly', emoji: '💰', min: BUDGET_MIN, max: 45 },
  { id: 'balanced', emoji: '🥗', min: 45, max: 80 },
  { id: 'variety', emoji: '✨', min: 80, max: 110 },
  { id: 'flex', emoji: '👑', min: 110, max: BUDGET_MAX },
];

export function budgetTierFor(amount: number): BudgetTier {
  if (amount <= 45) {
    return BUDGET_TIERS[0];
  }
  if (amount <= 80) {
    return BUDGET_TIERS[1];
  }
  if (amount <= 110) {
    return BUDGET_TIERS[2];
  }
  return BUDGET_TIERS[3];
}
