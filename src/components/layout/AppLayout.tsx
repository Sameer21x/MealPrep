import { colors } from '@/constants/colors';
import { ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;

  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarColor?: string;

  scrollable?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

const AppLayout = ({
  children,
  style,
  contentContainerStyle,

  statusBarStyle = 'dark-content',
  statusBarColor = '#FFFFFF',

  scrollable = true,
  showsVerticalScrollIndicator = false,
}: AppLayoutProps) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === 'android' ? statusBarColor : undefined}
      />

      {scrollable ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors?.accent, // status bar color
  },

  container: {
    flex: 1,
    backgroundColor: colors?.accent,
    paddingHorizontal: 14,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default AppLayout;
