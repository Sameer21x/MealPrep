import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BudgetScreen } from '@/screens/BudgetScreen';
import { DietaryScreen } from '@/screens/DietaryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LanderScreen } from '@/screens/LanderScreen';
import { MealPlanScreen } from '@/screens/MealPlanScreen';
import { NutritionalGoalsScreen } from '@/screens/NutritionalGoalsScreen';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (value === null || value === undefined) return true;
  return false;
}

function getInitialRoute({
  isWalkThrough,
  nutritionalGoals,
  dietaryNeeds,
  budget,
}: {
  isWalkThrough: boolean;
  nutritionalGoals: unknown;
  dietaryNeeds: unknown;
  budget: unknown;
}): keyof RootStackParamList {
  if (!isWalkThrough) {
    return 'Lander';
  }

  if (isEmpty(nutritionalGoals)) {
    return 'NutritionalGoals';
  }

  if (isEmpty(dietaryNeeds)) {
    return 'Dietary';
  }

  if (isEmpty(budget)) {
    return 'Budget';
  }

  // all 4 conditions satisfied
  return 'MealPlan';
}

export function RootNavigator() {
  const { nutritionalGoals, dietaryNeeds, budget, isWalkThrough } = useOnboardingStore(
    (state) => state,
  );

  const initialRouteName = getInitialRoute({
    isWalkThrough,
    nutritionalGoals,
    dietaryNeeds,
    budget,
  });

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lander" component={LanderScreen} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="Dietary" component={DietaryScreen} />
      <Stack.Screen name="NutritionalGoals" component={NutritionalGoalsScreen} />
      <Stack.Screen name="MealPlan" component={MealPlanScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
