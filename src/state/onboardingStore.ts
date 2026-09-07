import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BUDGET_DEFAULT } from '@/constants/budget';

import type { DietaryNeedId } from '@/constants/dietary';
import type { NutritionalGoalSelection } from '@/constants/nutrition';

import { toggleDietaryNeed as nextDietaryNeeds } from '@/lib/dietary';
import { toggleNutritionalGoal as nextNutritionalGoals } from '@/lib/nutrition';

type OnboardingState = {
  budget: number;
  dietaryNeeds: DietaryNeedId[];
  nutritionalGoals: NutritionalGoalSelection[];
  isWalkThrough: boolean;

  setBudget: (budget: number) => void;
  toggleDietaryNeed: (id: DietaryNeedId) => void;
  toggleNutritionalGoal: (id: NutritionalGoalSelection) => void;
  setWalkThrough: () => void;
  reset: () => void;
};

const initialState = {
  budget: BUDGET_DEFAULT,
  dietaryNeeds: [] as DietaryNeedId[],
  nutritionalGoals: [] as NutritionalGoalSelection[],
  isWalkThrough: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setBudget: (budget) =>
        set({
          budget,
        }),

      toggleDietaryNeed: (id) =>
        set((state) => ({
          dietaryNeeds: nextDietaryNeeds(state.dietaryNeeds, id),
        })),

      toggleNutritionalGoal: (id) =>
        set((state) => ({
          nutritionalGoals: nextNutritionalGoals(state.nutritionalGoals, id),
        })),

      setWalkThrough: () =>
        set({
          isWalkThrough: true,
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'mealprep-onboarding-storage',

      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
