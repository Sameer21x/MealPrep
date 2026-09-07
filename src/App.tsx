import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/molecules/ErrorState';
import { colors } from '@/constants/colors';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import i18n from '@/i18n';
import { RootNavigator } from '@/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

function AppContent() {
  const { t } = useTranslation();
  const { isAppReady, error } = useAppInitialization();

  if (!isAppReady) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.bootError}>
        <ErrorState title={t('app.bootErrorTitle')} message={t('errors.boot')} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  bootError: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
