import { StyleSheet, View } from 'react-native';

const GAP = 16;
const COLUMNS = 2;

type OptionGridProps<T> = {
  items: readonly T[];
  keyOf: (item: T) => string;
  render: (item: T) => React.ReactNode;
};

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export function OptionGrid<T>({ items, keyOf, render }: OptionGridProps<T>) {
  const rows = chunk(items, COLUMNS);

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={keyOf(row[0])} style={styles.row}>
          {row.map((item) => (
            <View key={keyOf(item)} style={styles.cell}>
              {render(item)}
            </View>
          ))}
          {/* Keeps a trailing odd card the same width as the rest. */}
          {Array.from({ length: COLUMNS - row.length }, (_, i) => (
            <View key={`filler-${i}`} style={styles.filler} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  cell: {
    flex: 1,
  },
  filler: {
    flex: 1,
  },
});
