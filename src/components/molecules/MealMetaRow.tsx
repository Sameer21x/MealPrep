import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/atoms/AppIcon';
import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

const GLYPH = 14;

type MealMetaRowProps = {
  prepMinutes: number;
  servings: number;
  pricePerServing: number;
};

function Item({ icon, label }: { icon: AppIconName; label: string }) {
  return (
    <View style={styles.item}>
      <AppIcon name={icon} size={GLYPH} color={colors.textMuted} />
      <AppText variant="meta" color={colors.textMuted} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

export function MealMetaRow({ prepMinutes, servings, pricePerServing }: MealMetaRowProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Item icon="time-outline" label={t('mealPlan.meta.minutes', { count: prepMinutes })} />
      <Item icon="people-outline" label={t('mealPlan.meta.servings', { count: servings })} />
      <Item
        icon="pricetag-outline"
        label={t('mealPlan.meta.perServing', { price: pricePerServing.toFixed(2) })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  label: {
    fontSize: 12,
    lineHeight: 17,
  },
});
