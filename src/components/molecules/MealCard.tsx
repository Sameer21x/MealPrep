import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AppIcon } from '@/components/atoms/AppIcon';
import { AppText } from '@/components/atoms/AppText';
import { TagPill } from '@/components/atoms/TagPill';
import { IngredientRow } from '@/components/molecules/IngredientRow';
import { CARD_PADDING, MealCardShell } from '@/components/molecules/MealCardShell';
import { MealMetaRow } from '@/components/molecules/MealMetaRow';
import { colors } from '@/constants/colors';
import { iconSize } from '@/constants/dimensions';
import { slotKeysFor } from '@/constants/mealPlan';
import { spacing } from '@/constants/spacing';
import { matchSelectedTags } from '@/lib/mealTags';
import { useMealPlanStore } from '@/state/mealPlanStore';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { Meal } from '@/types/mealPlan';

const TITLE_TOP = 18;

type MealCardProps = {
  dayLabel: string;
  meal: Meal;
  /** Position within the day, used for the slot label. */
  mealIndex: number;
  mealCount: number;
  swapping: boolean;
  onRequestSwap: () => void;
};

export function MealCard({
  dayLabel,
  meal,
  mealIndex,
  mealCount,
  swapping,
  onRequestSwap,
}: MealCardProps) {
  const { t } = useTranslation();
  const dietaryNeeds = useOnboardingStore((state) => state.dietaryNeeds);
  const nutritionalGoals = useOnboardingStore((state) => state.nutritionalGoals);
  const relaxedGoals = useMealPlanStore((state) => state.relaxedGoals);

  const [checked, setChecked] = useState<readonly boolean[]>(() =>
    meal.ingredients.map(() => false),
  );

  const toggle = useCallback((index: number) => {
    setChecked((current) =>
      current.map((value, position) => (position === index ? !value : value)),
    );
  }, []);

  const tags = useMemo(
    () => matchSelectedTags(meal.tags, dietaryNeeds, nutritionalGoals),
    [meal.tags, dietaryNeeds, nutritionalGoals],
  );

  const slotKey = slotKeysFor(mealCount)[mealIndex] ?? null;

  const relaxedNote = useMemo(() => {
    if (relaxedGoals.length === 0) {
      return null;
    }
    const names = relaxedGoals.map((goal) => t(`nutrition.options.${goal}`));
    return t('mealPlan.relaxed', { goals: names.join(', ') });
  }, [relaxedGoals, t]);

  return (
    <MealCardShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="dayTitle">{dayLabel}</AppText>

        {relaxedNote ? (
          <View style={styles.notice}>
            <AppIcon
              name="information-circle-outline"
              size={iconSize.sm}
              color={colors.textMuted}
            />
            <AppText variant="meta" color={colors.textMuted} style={styles.noticeText}>
              {relaxedNote}
            </AppText>
          </View>
        ) : null}

        <View style={styles.head}>
          {slotKey ? (
            <AppText variant="meta" color={colors.accent} style={styles.slot}>
              {t(`mealPlan.slot.${slotKey}`)}
            </AppText>
          ) : null}
          <AppText variant="mealName">{meal.name}</AppText>
          <View style={styles.meta}>
            <MealMetaRow
              prepMinutes={meal.prepMinutes}
              servings={meal.servings}
              pricePerServing={meal.pricePerServing}
            />
          </View>
        </View>

        {tags.length > 0 ? (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <TagPill
                key={tag.id}
                label={
                  tag.kind === 'dietary'
                    ? t(`dietary.options.${tag.id}`)
                    : t(`nutrition.options.${tag.id}`)
                }
              />
            ))}
          </View>
        ) : null}

        <AppText variant="sectionLabel" style={styles.section}>
          {t('mealPlan.ingredients')}
        </AppText>
        {meal.ingredients.map((ingredient, index) => (
          <IngredientRow
            key={`${ingredient.name}-${index}`}
            name={ingredient.name}
            quantity={ingredient.quantity}
            checked={checked[index] ?? false}
            onToggle={() => toggle(index)}
          />
        ))}

        <AppText variant="sectionLabel" style={styles.section}>
          {t('mealPlan.recipe')}
        </AppText>
        {meal.steps.map((step, index) => (
          <View key={`${index}-${step.slice(0, 12)}`} style={styles.step}>
            <AppText variant="meta" color={colors.accent} style={styles.stepNumber}>
              {index + 1}
            </AppText>
            <AppText variant="label" style={styles.stepText}>
              {step}
            </AppText>
          </View>
        ))}

        <AppButton
          variant="secondary"
          size="md"
          title={t('mealPlan.swap')}
          leftIcon="swap-horizontal"
          loading={swapping}
          onPress={onRequestSwap}
          style={styles.swap}
        />
      </ScrollView>
    </MealCardShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CARD_PADDING,
    paddingTop: TITLE_TOP,
    paddingBottom: spacing.xxl,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm - 2,
    marginTop: spacing.md,
  },
  noticeText: {
    flex: 1,
  },
  head: {
    marginTop: spacing.xl + spacing.xs,
  },
  slot: {
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  meta: {
    marginTop: spacing.xs + 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepNumber: {
    width: 16,
    textAlign: 'center',
  },
  stepText: {
    flex: 1,
  },
  swap: {
    marginTop: spacing.xl,
  },
});
