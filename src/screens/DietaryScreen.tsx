import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { OptionCard } from '@/components/molecules/OptionCard';
import { OptionGrid } from '@/components/molecules/OptionGrid';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { colors } from '@/constants/colors';
import { DIETARY_OPTIONS, type DietaryOption } from '@/constants/dietary';
import { screenGutter } from '@/constants/spacing';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { RootStackParamList } from '@/types/navigation';

/** Comp: header top 82, title caps 139, first card row 254, CTA 723. */
const HEADER_TOP = 23;
const TITLE_TOP = 16;
const GRID_TOP = 82;
const CTA_BOTTOM = 24;

export function DietaryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dietaryNeeds = useOnboardingStore((state) => state.dietaryNeeds);
  const toggleDietaryNeed = useOnboardingStore((state) => state.toggleDietaryNeed);

  const renderOption = (option: DietaryOption) => (
    <OptionCard
      label={t(`dietary.options.${option.id}`)}
      emoji={option.emoji}
      selected={dietaryNeeds.includes(option.id)}
      onPress={() => toggleDietaryNeed(option.id)}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={{ marginTop: insets.top + HEADER_TOP }}>
        <ScreenHeader
          onBack={navigation.goBack}
          step={2}
          steps={4}
          progressLabel={t('dietary.progress')}
        />
      </View>

      <AppText variant="title" style={styles.title}>
        {t('dietary.title')}
      </AppText>

      <View style={styles.middle}>
        <View style={styles.grid}>
          <OptionGrid items={DIETARY_OPTIONS} keyOf={(option) => option.id} render={renderOption} />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + CTA_BOTTOM }]}>
        <AppButton
          size="xl"
          title={t('common.continue')}
          disabled={dietaryNeeds.length === 0}
          onPress={() => navigation.navigate('NutritionalGoals')}
        />
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
    marginTop: TITLE_TOP,
    paddingHorizontal: screenGutter,
  },
  middle: {
    flex: 1,
  },
  grid: {
    marginTop: GRID_TOP,
    paddingHorizontal: screenGutter,
  },
  footer: {
    paddingHorizontal: screenGutter,
  },
});
