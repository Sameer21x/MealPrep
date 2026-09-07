import { StyleSheet, View, type DimensionValue } from 'react-native';

import { SkeletonBlock } from '@/components/atoms/SkeletonBlock';
import { GenerationProgress } from '@/components/molecules/GenerationProgress';
import { CARD_PADDING, MealCardShell } from '@/components/molecules/MealCardShell';
import { colors } from '@/constants/colors';
import type { GenerationStage } from '@/constants/mealPlan';
import { spacing } from '@/constants/spacing';

const BAR_HEIGHT = 16;
const BAR_GAP = 12;
const BAR_WIDTHS: DimensionValue[] = ['100%', '86%', '94%', '72%', '81%', '68%'];

export function MealCardSkeleton({ stage }: { stage: GenerationStage | null }) {
  return (
    <MealCardShell
      customStyle={{
        width: '96%',
      }}
    >
      <View style={styles.content}>
        <GenerationProgress stage={stage} />

        <View style={styles.divider} />

        <View style={styles.preview}>
          {BAR_WIDTHS.map((width, index) => (
            <View key={index} style={styles.bar}>
              <SkeletonBlock width={width} height={BAR_HEIGHT} />
            </View>
          ))}
        </View>
      </View>
    </MealCardShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: CARD_PADDING,
    paddingTop: spacing.lg + 2,
  },
  divider: {
    height: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceMuted,
  },
  preview: {
    opacity: 0.85,
  },
  bar: {
    marginBottom: BAR_GAP,
  },
});
