import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/atoms/AppIcon';
import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { PLAN_STAGES, type GenerationStage } from '@/constants/mealPlan';
import { spacing } from '@/constants/spacing';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const GUTTER = 22;
const CHECK = 16;
const DOT = 8;
const RING = 10;
const PULSE_MS = 620;
const DIM = 0.28;

type RowState = 'done' | 'active' | 'pending';

function activeIndexFor(stage: GenerationStage | null): number {
  if (stage == null) {
    return 0;
  }
  if (stage === 'ready') {
    return PLAN_STAGES.length;
  }
  return PLAN_STAGES.indexOf(stage);
}

function stateFor(index: number, activeIndex: number): RowState {
  if (index < activeIndex) {
    return 'done';
  }
  return index === activeIndex ? 'active' : 'pending';
}

function PulsingDot() {
  const reduceMotion = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: DIM, duration: PULSE_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_MS, useNativeDriver: true }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

/** Pops in when a row remounts as done — Marker swaps branch, so this always enters fresh. */
function CheckMark() {
  const reduceMotion = useReduceMotion();
  const [enter] = useState(() => new Animated.Value(reduceMotion ? 1 : 0.4));

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return;
    }

    Animated.spring(enter, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [enter, reduceMotion]);

  return (
    <Animated.View style={{ opacity: enter, transform: [{ scale: enter }] }}>
      <AppIcon name="checkmark" size={CHECK} color={colors.accent} />
    </Animated.View>
  );
}

function Marker({ state }: { state: RowState }) {
  if (state === 'done') {
    return (
      <View style={styles.gutter}>
        <CheckMark />
      </View>
    );
  }

  if (state === 'active') {
    return (
      <View style={styles.gutter}>
        <PulsingDot />
      </View>
    );
  }

  return (
    <View style={styles.gutter}>
      <View style={styles.ring} />
    </View>
  );
}

const LABEL_COLOR: Record<RowState, string> = {
  done: colors.textMuted,
  active: colors.text,
  pending: colors.disabledText,
};

function ReadyLine({ visible }: { visible: boolean }) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(visible || reduceMotion ? 1 : 0.4));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    Animated.timing(opacity, {
      toValue: visible ? 1 : 0.4,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [opacity, reduceMotion, visible]);

  return (
    <Animated.View style={[styles.ready, { opacity }]}>
      <AppText
        variant="sectionLabel"
        color={visible ? colors.accent : colors.disabledText}
        numberOfLines={1}
      >
        {t('mealPlan.progress.ready')}
      </AppText>
    </Animated.View>
  );
}

/**
 * Narrates the wait as a short checklist. Stages come from the service as real work starts, so a
 * tick always stands for something that finished rather than a timer.
 */
export function GenerationProgress({ stage }: { stage: GenerationStage | null }) {
  const { t } = useTranslation();
  const activeIndex = activeIndexFor(stage);
  const ready = stage === 'ready';
  const current = ready ? 'ready' : (PLAN_STAGES[activeIndex] ?? PLAN_STAGES[0]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${t('mealPlan.progress.title')}. ${t(`mealPlan.progress.${current}`)}`}
    >
      <AppText variant="dayTitle">{t('mealPlan.progress.title')}</AppText>

      <View style={styles.list}>
        {PLAN_STAGES.map((name, index) => {
          const state = stateFor(index, activeIndex);

          return (
            <View key={name} style={styles.row}>
              <Marker state={state} />
              {/* Both variants are 14/20, so the active row never shifts the rows below it. */}
              <AppText
                variant={state === 'active' ? 'sectionLabel' : 'label'}
                color={LABEL_COLOR[state]}
                numberOfLines={1}
                style={styles.label}
              >
                {t(`mealPlan.progress.${name}`)}
              </AppText>
            </View>
          );
        })}
      </View>

      <ReadyLine visible={ready} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.lg + 2,
    gap: spacing.md + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  label: {
    flexShrink: 1,
  },
  gutter: {
    width: GUTTER,
    height: GUTTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  ring: {
    width: RING,
    height: RING,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.disabledText,
  },
  ready: {
    marginTop: spacing.xl,
    marginLeft: GUTTER + spacing.sm + 2,
  },
});
