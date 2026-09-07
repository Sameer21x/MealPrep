import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';

const CARD_HEIGHT = 104;
const BORDER = 2;
const EMOJI_SIZE = 32;
const EMOJI_LINE = 33;
const PADDING_WITH_EMOJI = 20;
const PADDING_LABEL_ONLY = 36.5;

type OptionCardProps = {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function OptionCard({ label, emoji, selected, onPress, style }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.card,
        { paddingTop: emoji ? PADDING_WITH_EMOJI : PADDING_LABEL_ONLY },
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {emoji ? (
        <AppText
          // The glyph carries no meaning the label doesn't already state.
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.emoji}
        >
          {emoji}
        </AppText>
      ) : null}
      <AppText variant="cardLabel" style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: radii.lg,
    borderWidth: BORDER,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  pressed: {
    opacity: 0.75,
  },
  emoji: {
    fontSize: EMOJI_SIZE,
    lineHeight: EMOJI_LINE,
  },
  label: {
    textAlign: 'center',
  },
});
