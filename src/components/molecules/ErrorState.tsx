import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppButton } from '@/components/atoms/AppButton';
import { AppIcon } from '@/components/atoms/AppIcon';
import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

type ErrorStateProps = {
  title?: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
};

export function ErrorState({ title, message, actionTitle, onAction }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <AppIcon name="alert-circle-outline" size={36} color={colors.danger} />
      <AppText variant="heading" style={styles.title}>
        {title ?? t('errors.genericTitle')}
      </AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.message}>
        {message}
      </AppText>
      {actionTitle && onAction ? <AppButton title={actionTitle} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  message: {
    textAlign: 'center',
  },
});
