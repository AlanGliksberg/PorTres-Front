import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@/src/constants/auth";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LoadingProvider } from "@/src/contexts/LoadingContext";
import { ModalProvider } from "@/src/contexts/ModalContext";
import { PlayerModalsProvider } from "@/src/contexts/PlayerModalsContext";
import AnimatedSplash from "@/src/components/Splash/AnimatedSplash";
import RootNavigator from "@/src/navigation/RootNavigator";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: IOS_CLIENT_ID,
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  return (
    <SafeAreaProvider style={styles.flex}>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={styles.flex}>
        <AuthProvider>
          <ModalProvider>
            <PlayerModalsProvider>
              <LoadingProvider>
                <RootNavigator />
              </LoadingProvider>
            </PlayerModalsProvider>
          </ModalProvider>
        </AuthProvider>
        {!hasAnimated && <AnimatedSplash onFinish={() => setHasAnimated(true)} />}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
