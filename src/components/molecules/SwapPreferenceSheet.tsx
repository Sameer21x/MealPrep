import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { OptionCard } from '@/components/molecules/OptionCard';
import { OptionGrid } from '@/components/molecules/OptionGrid';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { screenGutter, spacing } from '@/constants/spacing';
import { SWAP_PREFERENCE_OPTIONS, type SwapPreference } from '@/constants/swap';

/** Long enough to see the green selected state used on screens 3 and 4, short enough not to stall. */
const SELECT_HOLD_MS = 280;

type SwapPreferenceSheetProps = {
  visible: boolean;
  onSelect: (preference: SwapPreference) => void;
  onClose: () => void;
};

export function SwapPreferenceSheet({ visible, onSelect, onClose }: SwapPreferenceSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SwapPreference | null>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      return;
    }

    if (commitTimer.current != null) {
      clearTimeout(commitTimer.current);
      commitTimer.current = null;
    }
  }, [visible]);

  useEffect(
    () => () => {
      if (commitTimer.current != null) {
        clearTimeout(commitTimer.current);
      }
    },
    [],
  );

  const handleSelect = (id: SwapPreference) => {
    if (selected != null) {
      return;
    }

    setSelected(id);

    commitTimer.current = setTimeout(() => {
      commitTimer.current = null;
      onSelect(id);
      setSelected(null);
    }, SELECT_HOLD_MS);
  };

  const busy = selected != null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={busy ? undefined : onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={busy ? undefined : onClose}
          accessibilityRole="button"
          accessibilityLabel={t('mealPlan.swapCancel')}
        />
        <View style={styles.sheet}>
          <AppText variant="heading" style={styles.title}>
            {t('mealPlan.swapTitle')}
          </AppText>

          <OptionGrid
            items={SWAP_PREFERENCE_OPTIONS}
            keyOf={(item) => item.id}
            render={(item) => (
              <OptionCard
                label={t(`mealPlan.swapOptions.${item.id}`)}
                emoji={item.emoji}
                selected={selected === item.id}
                onPress={() => handleSelect(item.id)}
              />
            )}
          />

          <AppButton
            variant="ghost"
            size="md"
            title={t('mealPlan.swapCancel')}
            disabled={busy}
            onPress={onClose}
            style={styles.cancel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: screenGutter,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  cancel: {
    marginTop: spacing.sm,
  },
});
