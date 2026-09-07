import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/atoms/AppButton';
import { AppText } from '@/components/atoms/AppText';
import { GradientText } from '@/components/atoms/GradientText';
import { BudgetInsight } from '@/components/molecules/BudgetInsight';
import { BudgetSlider } from '@/components/molecules/BudgetSlider';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP, budgetTierFor } from '@/constants/budget';
import { amountGradient, colors } from '@/constants/colors';
import { screenGutter } from '@/constants/spacing';
import { useOnboardingStore } from '@/state/onboardingStore';
import type { RootStackParamList } from '@/types/navigation';

const HEADER_TOP = 23;
const TITLE_TOP = 16;
const AMOUNT_TOP = 120;
const PER_WEEK_TOP = 7;
const INSIGHT_TOP = 20;
const SLIDER_TOP = 28;
const SLIDER_GUTTER = 24;
const CTA_BOTTOM = 24;

export function BudgetScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const budget = useOnboardingStore((state) => state.budget);
  const setBudget = useOnboardingStore((state) => state.setBudget);

  return (
    <View style={styles.screen}>
      <View style={{ marginTop: insets.top + HEADER_TOP }}>
        <ScreenHeader
          onBack={navigation.goBack}
          step={1}
          steps={4}
          progressLabel={t('budget.progress')}
        />
      </View>

      <AppText variant="title" style={styles.title}>
        {t('budget.title')}
      </AppText>

      <View style={styles.middle}>
        <View style={styles.amount}>
          <GradientText colors={amountGradient.colors} locations={amountGradient.locations}>
            {`\u20AC${budget}`}
          </GradientText>
        </View>

        <AppText variant="heading" color={colors.textMuted} style={styles.perWeek}>
          {t('budget.perWeek')}
        </AppText>

        <View style={styles.insight}>
          <BudgetInsight budget={budget} />
        </View>

        <BudgetSlider
          value={budget}
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          onChange={setBudget}
          label={`${t('budget.sliderLabel')}. ${t(`budget.insight.${budgetTierFor(budget).id}`)}`}
          style={styles.slider}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + CTA_BOTTOM }]}>
        <AppButton
          size="xl"
          title={t('common.continue')}
          onPress={() => navigation.navigate('Dietary')}
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
  amount: {
    marginTop: AMOUNT_TOP,
    alignItems: 'center',
  },
  perWeek: {
    marginTop: PER_WEEK_TOP,
    textAlign: 'center',
  },
  insight: {
    marginTop: INSIGHT_TOP,
  },
  slider: {
    marginTop: SLIDER_TOP,
    marginHorizontal: SLIDER_GUTTER,
  },
  footer: {
    paddingHorizontal: screenGutter,
  },
});
