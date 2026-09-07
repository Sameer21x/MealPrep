import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { type BudgetTier, budgetTierFor } from '@/constants/budget';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { spacing } from '@/constants/spacing';
import { useReduceMotion } from '@/hooks/useReduceMotion';

type BudgetInsightProps = {
  budget: number;
};

function Pill({ tier }: { tier: BudgetTier }) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const [enter] = useState(() => new Animated.Value(reduceMotion ? 1 : 0.7));

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return;
    }

    Animated.spring(enter, {
      toValue: 1,
      friction: 7,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [enter, reduceMotion]);

  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${t(`budget.insight.${tier.id}`)}. ${t('budget.insightRange', {
        min: tier.min,
        max: tier.max,
      })}`}
      style={[
        styles.pill,
        {
          opacity: enter,
          transform: [
            {
              scale: enter.interpolate({
                inputRange: [0.7, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
    >
      <AppText accessibilityElementsHidden importantForAccessibility="no" style={styles.emoji}>
        {tier.emoji}
      </AppText>
      <AppText variant="label">{t(`budget.insight.${tier.id}`)}</AppText>
    </Animated.View>
  );
}

export function BudgetInsight({ budget }: BudgetInsightProps) {
  const { t } = useTranslation();
  const tier = budgetTierFor(budget);

  return (
    <View style={styles.block}>
      <Pill key={tier.id} tier={tier} />
      <AppText variant="caption" color={colors.textMuted} style={styles.range}>
        {t('budget.insightRange', { min: tier.min, max: tier.max })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
  },
  emoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  range: {
    letterSpacing: 0.2,
  },
});
