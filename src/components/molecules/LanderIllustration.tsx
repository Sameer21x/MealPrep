import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

const DESIGN_WIDTH = 393;
const BLOCK_HEIGHT = 353;
const FOOD_SIZE = 40;

const BAG = { left: 124, top: 68, width: 147, height: 182 };

/** The shared pivot every food item orbits around: the center of the bag image. */
const BAG_CENTER = {
  x: BAG.left + BAG.width / 2,
  y: BAG.top + BAG.height / 2,
};

const ORBIT_RADIUS = 155;

/** One full lap, shared by every item so they all move at the same angular speed. */
const ORBIT_DURATION = 18000;

const CIRCLE_STEPS = 32;

const FOOD_ORDER = ['steak', 'apple', 'carrot', 'cheese', 'olive', 'corn', 'eggplant'] as const;

type FoodKey = (typeof FOOD_ORDER)[number];

const FOOD_SOURCES: Record<FoodKey, ImageSourcePropType> = {
  steak: require('../../../assets/images/food/steak.png'),
  apple: require('../../../assets/images/food/apple.png'),
  carrot: require('../../../assets/images/food/carrot.png'),
  cheese: require('../../../assets/images/food/cheese.png'),
  olive: require('../../../assets/images/food/olive.png'),
  corn: require('../../../assets/images/food/corn.png'),
  eggplant: require('../../../assets/images/food/eggplant.png'),
};

function buildOrbitTable(steps: number, radius: number, startAngle: number) {
  const inputRange: number[] = [];
  const offsetXTable: number[] = [];
  const offsetYTable: number[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = startAngle + t * Math.PI * 2;
    inputRange.push(t);
    offsetXTable.push(Math.cos(angle) * radius);
    offsetYTable.push(Math.sin(angle) * radius);
  }

  return { inputRange, offsetXTable, offsetYTable };
}

type OrbitingFoodItem = {
  key: FoodKey;
  startAngle: number;
};

const SLOT_ANGLE = (Math.PI * 2) / FOOD_ORDER.length;
const FOOD: OrbitingFoodItem[] = FOOD_ORDER.map((key, index) => ({
  key,
  startAngle: index * SLOT_ANGLE,
}));

function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) {
        setReduceMotion(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

type FloatingFoodProps = {
  item: OrbitingFoodItem;
  scale: number;
  animate: boolean;
};

function FloatingFood({ item, scale, animate }: FloatingFoodProps) {
  const [progress] = useState(() => new Animated.Value(0));

  // Built once per item (its inputs never change at runtime), reused across renders.
  const [{ inputRange, offsetXTable, offsetYTable }] = useState(() =>
    buildOrbitTable(CIRCLE_STEPS, ORBIT_RADIUS, item.startAngle),
  );

  useEffect(() => {
    if (!animate) {
      progress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: ORBIT_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => loop.stop();
  }, [animate, progress]);

  const translateX = progress.interpolate({
    inputRange,
    outputRange: offsetXTable.map((x) => x * scale),
  });

  const translateY = progress.interpolate({
    inputRange,
    outputRange: offsetYTable.map((y) => y * scale),
  });

  return (
    <Animated.View
      style={[
        styles.absolute,
        {
          left: BAG_CENTER.x * scale - (FOOD_SIZE * scale) / 2,
          top: BAG_CENTER.y * scale - (FOOD_SIZE * scale) / 2,
          width: FOOD_SIZE * scale,
          height: FOOD_SIZE * scale,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      <Image source={FOOD_SOURCES[item.key]} style={styles.fill} resizeMode="contain" />
    </Animated.View>
  );
}

export function LanderIllustration() {
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const scale = width / DESIGN_WIDTH;

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height: BLOCK_HEIGHT * scale }}
    >
      <Image
        source={require('../../../assets/images/esselunga-bag.png')}
        resizeMode="contain"
        style={[
          styles.absolute,
          {
            left: BAG.left * scale,
            top: BAG.top * scale,
            width: BAG.width * scale,
            height: BAG.height * scale,
          },
        ]}
      />
      {FOOD.map((item) => (
        <FloatingFood key={item.key} item={item} scale={scale} animate={!reduceMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});
