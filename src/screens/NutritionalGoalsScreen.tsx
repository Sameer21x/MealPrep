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
import { NUTRITIONAL_GOAL_OPTIONS, type NutritionalGoalOption } from '@/constants/nutrition';
import { screenGutter } from '@/constants/spacing';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { RootStackParamList } from '@/types/navigation';

const HEADER_TOP = 23;
const TITLE_TOP = 16;

const TITLE_BOX = 92;
const GRID_TOP = 36;
const CTA_BOTTOM = 24;

export function NutritionalGoalsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const nutritionalGoals = useOnboardingStore((state) => state.nutritionalGoals);
  const toggleNutritionalGoal = useOnboardingStore((state) => state.toggleNutritionalGoal);

  const renderOption = (option: NutritionalGoalOption) => (
    <OptionCard
      label={t(`nutrition.options.${option.id}`)}
      emoji={option.emoji}
      selected={nutritionalGoals.includes(option.id)}
      onPress={() => toggleNutritionalGoal(option.id)}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={{ marginTop: insets.top + HEADER_TOP }}>
        <ScreenHeader
          onBack={navigation.goBack}
          step={3}
          steps={4}
          progressLabel={t('nutrition.progress')}
        />
      </View>

      <View style={styles.titleBox}>
        <AppText variant="title" numberOfLines={2}>
          {t('nutrition.title')}
        </AppText>
      </View>

      <View style={styles.middle}>
        <View style={styles.grid}>
          <OptionGrid
            items={NUTRITIONAL_GOAL_OPTIONS}
            keyOf={(option) => option.id}
            render={renderOption}
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + CTA_BOTTOM }]}>
        <AppButton
          size="xl"
          title={t('common.continue')}
          disabled={nutritionalGoals.length === 0}
          onPress={() => navigation.navigate('MealPlan')}
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
  titleBox: {
    marginTop: TITLE_TOP,
    height: TITLE_BOX,
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
