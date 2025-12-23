import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@/src/constants/auth";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import { ModalProvider } from "@/src/contexts/ModalContext";
import { PlayerModalsProvider } from "@/src/contexts/PlayerModalsContext";
import AnimatedSplash from "@/src/components/Splash/AnimatedSplash";
import ForceUpdateModal from "@/src/components/ForceUpdate/ForceUpdateModal";
import RootNavigator from "@/src/navigation/RootNavigator";
import { useForceUpdate } from "@/src/hooks/useForceUpdate";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: IOS_CLIENT_ID,
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    // Auto-apply OTA updates as soon as they are available
    if (__DEV__) return;
    const checkAndApply = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.warn("OTA update failed", error);
      }
    };
    checkAndApply();
  }, []);

  if (forceUpdate.loading) {
    return (
      <SafeAreaProvider style={styles.flex}>
        <GestureHandlerRootView style={styles.flex}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.flex}>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={styles.flex}>
        {forceUpdate.requiresUpdate ? (
          <>
            <ForceUpdateModal
              visible
              storeUrl={forceUpdate.storeUrl}
            />
          </>
        ) : (
          <>
            <AuthProvider>
              <ModalProvider>
                <PlayerModalsProvider>
                  <LoadingProvider>
                    <RootNavigator />
                  </LoadingProvider>
                </PlayerModalsProvider>
              </ModalProvider>
            </AuthProvider>
            {!hasAnimated && (
              <AnimatedSplash onFinish={() => setHasAnimated(true)} />
            )}
          </>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
