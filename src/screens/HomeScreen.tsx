import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { BackButton } from '@/components/atoms/BackButton';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <BackButton onPress={() => {}} />

      <View style={styles.group}>
        <AppText variant="label" color={colors.textMuted}>
          Buttons
        </AppText>
        <AppButton title={t('common.continue')} onPress={() => {}} />
        <AppButton title={t('common.continue')} onPress={() => {}} disabled />
        <AppButton title={t('common.continue')} onPress={() => {}} loading />
        <AppButton title={t('common.continue')} onPress={() => {}} variant="secondary" />
      </View>

      <View style={styles.group}>
        <AppText variant="label" color={colors.textMuted}>
          Progress
        </AppText>
        <ProgressBar value={0.2} />
        <ProgressBar value={0.5} />
        <ProgressBar value={0.8} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  group: {
    gap: spacing.md,
  },
});
