import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

import { promoFontAssets } from '@/constants/fonts';

type AppInitializationState = {
  isAppReady: boolean;
  showIntro: boolean;
  error: Error | null;
  dismissIntro: () => void;
};

export function useAppInitialization(): AppInitializationState {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        await Font.loadAsync(promoFontAssets);
        if (!cancelled) {
          setIsAppReady(true);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('App failed to start.'));
          setIsAppReady(true);
        }
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const dismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  return {
    isAppReady,
    showIntro: isAppReady && showIntro && !error,
    error,
    dismissIntro,
  };
}
