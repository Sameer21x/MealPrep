import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';

import { AppText, type AppTextVariant } from '@/components/atoms/AppText';

type GradientTextProps = {
  children: string;
  variant?: AppTextVariant;
  colors: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  style?: StyleProp<TextStyle>;
};

export function GradientText({
  children,
  variant = 'amount',
  colors,
  locations,
  style,
}: GradientTextProps) {
  const label = (
    <AppText variant={variant} style={style}>
      {children}
    </AppText>
  );

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={children}>
      <View aria-hidden style={styles.sizer}>
        {label}
      </View>
      <MaskedView style={StyleSheet.absoluteFill} maskElement={<View>{label}</View>}>
        <LinearGradient
          colors={colors}
          locations={locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  sizer: {
    opacity: 0,
  },
});
