import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/fonts';
import { DAY_KEYS } from '@/constants/mealPlan';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface DayPillsProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const DayPills = ({ selectedIndex, onSelect }: DayPillsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DAY_KEYS.map((day, index) => {
        const isSelected = selectedIndex === index;

        return (
          <TouchableOpacity
            key={day}
            style={[styles.pill, isSelected && styles.selectedPill]}
            onPress={() => onSelect(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>{day}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  pill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    backgroundColor: colors?.surface,
  },

  selectedPill: {
    backgroundColor: colors?.text,
    fontFamily: fontFamily?.bold,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: colors?.text,
  },
  selectedText: {
    color: colors?.surface,
  },
});
