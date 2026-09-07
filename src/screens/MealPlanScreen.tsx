import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import AppLayout from '@/components/layout/AppLayout';
import { DayPills, MealCardSkeleton, SwapPreferenceSheet } from '@/components/molecules';
import { ErrorState } from '@/components/molecules/ErrorState';
import { MealCard } from '@/components/molecules/MealCard';
import { MealCardShell } from '@/components/molecules/MealCardShell';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { CARD_GAP, CARD_WIDTH, DAY_KEYS } from '@/constants/mealPlan';
import { screenGutter, spacing } from '@/constants/spacing';
import type { SwapPreference } from '@/constants/swap';
import { useMealPlanStore } from '@/state/mealPlanStore';
import { useOnboardingStore } from '@/state/onboardingStore';
import { weekCost } from '@/types/mealPlan';

const COST_TOP = 21;
const PILLS_TOP = 13;
const SHEET_TOP = 16;
const COST_CARD_HEIGHT = 72;

const SNAP = CARD_WIDTH + CARD_GAP;

export function MealPlanScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [swapTarget, setSwapTarget] = useState<{ dayIndex: number; mealIndex: number } | null>(
    null,
  );

  const budget = useOnboardingStore((state) => state.budget);

  const status = useMealPlanStore((state) => state.status);
  const plan = useMealPlanStore((state) => state.plan);
  const error = useMealPlanStore((state) => state.error);
  const stage = useMealPlanStore((state) => state.stage);
  const selectedDayIndex = useMealPlanStore((state) => state.selectedDayIndex);
  const swappingKey = useMealPlanStore((state) => state.swappingKey);
  const revisions = useMealPlanStore((state) => state.revisions);
  const generate = useMealPlanStore((state) => state.generate);
  const retry = useMealPlanStore((state) => state.retry);
  const swapMeal = useMealPlanStore((state) => state.swapMeal);
  const selectDay = useMealPlanStore((state) => state.selectDay);

  // The store short-circuits when a plan is already cached, so coming back here costs no request.
  useEffect(() => {
    void generate();
  }, [generate]);

  const meals = useMemo(() => plan?.days[selectedDayIndex]?.meals ?? [], [plan, selectedDayIndex]);

  const cost = useMemo(() => (plan == null ? 0 : weekCost(plan)), [plan]);

  const handleSelectDay = useCallback(
    (index: number) => {
      selectDay(index);
      setSwapTarget(null);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    },
    [selectDay],
  );

  const handleRequestSwap = useCallback(
    (mealIndex: number) => {
      if (swappingKey != null) {
        return;
      }
      setSwapTarget({ dayIndex: selectedDayIndex, mealIndex });
    },
    [selectedDayIndex, swappingKey],
  );

  const handleSwapPreference = useCallback(
    (preference: SwapPreference) => {
      if (swapTarget == null) {
        return;
      }
      const { dayIndex, mealIndex } = swapTarget;
      setSwapTarget(null);
      void swapMeal(dayIndex, mealIndex, preference);
    },
    [swapTarget, swapMeal],
  );

  const sidePadding = Math.max((width - CARD_WIDTH) / 2, screenGutter);

  const renderCard = useCallback(
    ({ item, index }: { item: (typeof meals)[number]; index: number }) => (
      <MealCard
        dayLabel={t(`mealPlan.dayLong.${DAY_KEYS[selectedDayIndex]}`)}
        meal={item}
        mealIndex={index}
        mealCount={meals.length}
        swapping={swappingKey === `${selectedDayIndex}:${index}`}
        onRequestSwap={() => handleRequestSwap(index)}
      />
    ),
    [t, selectedDayIndex, meals.length, swappingKey, handleRequestSwap],
  );

  return (
    <AppLayout>
      <AppText variant="screenTitle" color={colors.surface} style={[styles.title]}>
        {t('mealPlan.greeting')}
      </AppText>

      <View style={styles.costCard}>
        <AppText variant="meta" color={colors.textMuted}>
          {t('mealPlan.estCost')}
        </AppText>
        <View style={styles.costRow}>
          <AppText variant="heading" numberOfLines={1} style={styles.costAmount}>
            {plan != null
              ? t('mealPlan.costPerWeek', { cost: cost.toFixed(0) })
              : t('mealPlan.costUnknown')}
          </AppText>
          <AppText
            variant="meta"
            color={colors.textMuted}
            numberOfLines={1}
            style={styles.costBudget}
          >
            {t('mealPlan.ofBudget', { budget })}
          </AppText>
        </View>
      </View>

      <View style={styles.pills}>
        <DayPills selectedIndex={selectedDayIndex} onSelect={handleSelectDay} />
      </View>

      <View style={[styles.sheet, {}]}>
        {status === 'error' ? (
          <View style={{ paddingHorizontal: sidePadding, flex: 1 }}>
            <MealCardShell>
              <ErrorState
                title={t('mealPlan.errorTitle')}
                message={error ?? t('errors.generic')}
                actionTitle={t('mealPlan.retry')}
                onAction={() => void retry()}
              />
            </MealCardShell>
          </View>
        ) : meals.length > 0 ? (
          <FlatList
            ref={listRef}
            data={meals}
            keyExtractor={(_, index) =>
              `${selectedDayIndex}-${index}-${revisions[`${selectedDayIndex}:${index}`] ?? 0}`
            }
            renderItem={renderCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            contentContainerStyle={{ gap: CARD_GAP }}
            getItemLayout={(_, index) => ({
              length: SNAP,
              offset: SNAP * index,
              index,
            })}
            initialNumToRender={1}
            windowSize={3}
            removeClippedSubviews
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <MealCardSkeleton stage={stage} />
          </View>
        )}
      </View>

      <SwapPreferenceSheet
        visible={swapTarget != null}
        onSelect={handleSwapPreference}
        onClose={() => setSwapTarget(null)}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  costCard: {
    marginTop: COST_TOP,
    height: COST_CARD_HEIGHT,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs / 2,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    alignSelf: 'stretch',
    gap: spacing.sm - 2,
    paddingHorizontal: spacing.md,
  },
  costAmount: {
    flexShrink: 0,
  },
  costBudget: {
    flexShrink: 0,
  },
  pills: {
    marginTop: PILLS_TOP,
  },
  sheet: {
    flexGrow: 1,
    marginTop: SHEET_TOP,
  },
});
