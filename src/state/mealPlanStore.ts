import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GenerationStage } from '@/constants/mealPlan';
import type { NutritionalGoal } from '@/constants/nutrition';
import type { SwapPreference } from '@/constants/swap';

import { wait } from '@/lib/wait';

import {
  generateMealPlan,
  generateReplacementMeal,
  MealPlanError,
  type MealPlanRequest,
} from '@/services/mealPlanService';

import { useOnboardingStore } from '@/state/onboardingStore';

import type { MealPlan } from '@/types/mealPlan';

export type MealPlanStatus = 'idle' | 'loading' | 'success' | 'error';

const READY_BEAT_MS = 900;

type MealPlanState = {
  status: MealPlanStatus;
  plan: MealPlan | null;
  error: string | null;

  stage: GenerationStage | null;

  relaxedGoals: NutritionalGoal[];

  selectedDayIndex: number;

  swappingKey: string | null;

  revisions: Record<string, number>;

  generate: () => Promise<void>;
  retry: () => Promise<void>;
  swapMeal: (dayIndex: number, mealIndex: number, preference: SwapPreference) => Promise<void>;
  selectDay: (index: number) => void;
  reset: () => void;
};

const initialState = {
  status: 'idle' as MealPlanStatus,
  plan: null,
  error: null,
  stage: null,
  relaxedGoals: [] as NutritionalGoal[],
  selectedDayIndex: 0,
  swappingKey: null,
  revisions: {} as Record<string, number>,
};

function currentRequest(): MealPlanRequest {
  const { budget, dietaryNeeds, nutritionalGoals } = useOnboardingStore.getState();

  return {
    budget,
    dietaryNeeds,
    nutritionalGoals,
  };
}

function messageFor(error: unknown): string {
  return error instanceof MealPlanError ? error.message : 'Something went wrong.';
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      ...initialState,

      generate: async () => {
        const { plan, status } = get();

        if (plan != null || status === 'loading') {
          return;
        }

        set({
          status: 'loading',
          error: null,
          stage: 'preferences',
        });

        try {
          const { plan, relaxedGoals } = await generateMealPlan(currentRequest(), (stage) =>
            set({ stage }),
          );

          set({
            stage: 'ready',
          });

          await wait(READY_BEAT_MS);

          set({
            plan,
            relaxedGoals,
            status: 'success',
            stage: null,
          });
        } catch (error) {
          set({
            status: 'error',
            error: messageFor(error),
            stage: null,
          });
        }
      },

      retry: async () => {
        set({
          plan: null,
          status: 'idle',
          error: null,
          stage: null,
          relaxedGoals: [],
          revisions: {},
          selectedDayIndex: 0,
          swappingKey: null,
        });

        await get().generate();
      },

      swapMeal: async (dayIndex, mealIndex, preference) => {
        const { plan, swappingKey } = get();

        const day = plan?.days[dayIndex];
        const meal = day?.meals[mealIndex];

        if (plan == null || day == null || meal == null || swappingKey != null) {
          return;
        }

        const key = `${dayIndex}:${mealIndex}`;

        set({
          swappingKey: key,
        });

        try {
          const replacement = await generateReplacementMeal(
            currentRequest(),
            day.day,
            meal,
            preference,
          );

          set((state) => {
            if (state.plan == null) {
              return {};
            }

            return {
              plan: {
                days: state.plan.days.map((existingDay, index) =>
                  index === dayIndex
                    ? {
                        ...existingDay,
                        meals: existingDay.meals.map((existingMeal, position) =>
                          position === mealIndex ? replacement : existingMeal,
                        ),
                      }
                    : existingDay,
                ),
              },

              revisions: {
                ...state.revisions,
                [key]: (state.revisions[key] ?? 0) + 1,
              },
            };
          });
        } catch {
        } finally {
          set({
            swappingKey: null,
          });
        }
      },

      selectDay: (index) =>
        set({
          selectedDayIndex: index,
        }),

      reset: () => set(initialState),
    }),

    {
      name: 'mealprep-meal-plan-storage',

      storage: createJSONStorage(() => AsyncStorage),

      // Only persist useful application data.
      partialize: (state) => ({
        plan: state.plan,
        relaxedGoals: state.relaxedGoals,
        selectedDayIndex: state.selectedDayIndex,
        revisions: state.revisions,
      }),

      // `status` is not persisted (it would otherwise freeze on "loading"). If a plan came back
      // from disk, treat it as already generated so the cost chip and the rest of the screen agree.
      onRehydrateStorage: () => (state) => {
        if (state?.plan != null) {
          state.status = 'success';
        }
      },
    },
  ),
);
