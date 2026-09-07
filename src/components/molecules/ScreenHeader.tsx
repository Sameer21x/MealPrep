import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/atoms/BackButton';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { screenGutter } from '@/constants/spacing';

const BACK_SIZE = 28;
const GAP = 10;

const STEP_FRACTION = 86 / 315;

type ScreenHeaderProps = {
  onBack: () => void;
  /** 1-based position in the flow. */
  step: number;
  steps: number;
  progressLabel?: string;
};

export function ScreenHeader({ onBack, step, steps, progressLabel }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <BackButton onPress={onBack} size={BACK_SIZE} />
      <ProgressBar
        size="xl"
        value={step >= steps ? 1 : Math.min(1, step * STEP_FRACTION)}
        accessibilityLabel={progressLabel}
        style={styles.progress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenGutter,
    gap: GAP,
  },
  progress: {
    flex: 1,
  },
});
