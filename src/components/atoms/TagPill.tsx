import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { spacing } from '@/constants/spacing';

type TagPillProps = {
  label: string;
};

export function TagPill({ label }: TagPillProps) {
  return (
    <View style={styles.pill}>
      <AppText variant="tagLabel" color={colors.accent}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.accentMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
});
