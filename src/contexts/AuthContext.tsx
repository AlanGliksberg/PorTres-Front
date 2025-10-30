import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Platform } from "react-native";
import { USER_TOKEN_SESSION_KEY } from "../constants/auth";
import {
  logout as logoutService,
  refreshToken as refreshTokenService,
} from "../services/auth";
import { clearCache } from "../services/cache";
import { savePlayerPushToken } from "../services/player";
import { JWTPayload } from "../types";
import { decodeToken } from "../utils/auth";
import { requestExpoPushToken } from "../utils/pushNotifications";

type AuthContextData = {
  token: string | null;
  saveToken: (jwt: string) => Promise<void>;
  logout: () => Promise<void>;
  user: JWTPayload | null;
  refreshToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({
  token: null,
  saveToken: async () => {},
  logout: async () => {},
  user: null,
  refreshToken: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const storeToken = async (jwt: string | null) => {
    if (!jwt) return;

    const decodedToken = decodeToken(jwt);
    setUser(decodedToken);
    await AsyncStorage.setItem(USER_TOKEN_SESSION_KEY, jwt);
    setToken(jwt);
  };

  // Al montar, tratar de recuperar el token
  useEffect(() => {
    AsyncStorage.getItem(USER_TOKEN_SESSION_KEY).then(async (stored) => {
      if (stored) storeToken(stored);
      setTimeout(async () => await SplashScreen.hideAsync(), 1500);
    });
  }, []);

  const saveToken = async (jwt: string) => {
    clearCache();
    await GoogleSignin.signOut();

    storeToken(jwt);
  };

  const logout = async () => {
    try {
      const tokenForLogout = expoPushToken ?? (await requestExpoPushToken());
      await logoutService(tokenForLogout ?? null);
    } catch (error) {
      console.log("Error notifying logout:", error);
    }

    await GoogleSignin.signOut();
    await AsyncStorage.removeItem(USER_TOKEN_SESSION_KEY);
    clearCache();
    setExpoPushToken(null);
    setToken(null);
  };

  const refreshToken = async () => {
    const res = await refreshTokenService(token!);
    if (res.error || !res?.data?.token)
      console.log("Error refreshing token", res.message);
    else storeToken(res.data.token);
  };

  useEffect(() => {
    if (!token || !user?.playerId) return;

    let isSubscribed = true;

    const syncPushToken = async () => {
      try {
        const expoToken = await requestExpoPushToken();
        if (!expoToken || !isSubscribed) return;

        setExpoPushToken(expoToken);
        await savePlayerPushToken({
          token: expoToken,
          deviceType: Platform.OS,
        });
      } catch (error) {
        console.log("Failed to register push token:", error);
      }
    };

    syncPushToken();

    return () => {
      isSubscribed = false;
    };
  }, [token, user?.playerId]);

  return (
    <AuthContext.Provider
      value={{ token, saveToken, logout, user, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
