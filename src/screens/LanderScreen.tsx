import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { LanderIllustration } from '@/components/molecules/LanderIllustration';
import { colors } from '@/constants/colors';
import { screenGutter } from '@/constants/spacing';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { RootStackParamList } from '@/types/navigation';

const TITLE_TOP = 16;
const ILLUSTRATION_LIFT = 4;
const CTA_BOTTOM = 24;

export function LanderScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setWalkThrough = useOnboardingStore((state) => state.setWalkThrough);
  const btnPress = () => {
    setWalkThrough();
    navigation.navigate('Budget');
  };
  return (
    <View style={styles.screen}>
      <AppText variant="display" style={[styles.title, { marginTop: insets.top + TITLE_TOP }]}>
        {t('app.name')}
      </AppText>

      <View style={styles.illustration}>
        <LanderIllustration />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + CTA_BOTTOM }]}>
        <AppButton size="xl" title={t('lander.cta')} onPress={() => btnPress()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    textAlign: 'center',
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: ILLUSTRATION_LIFT,
  },
  footer: {
    paddingHorizontal: screenGutter,
  },
});
