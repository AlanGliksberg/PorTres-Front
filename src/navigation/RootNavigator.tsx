// src/navigation/RootNavigator.tsx
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { SetPlayerStack } from "./SetPlayerStack";
import { navigationRef } from "./navigationRef";
import { Linking } from "react-native";
import { parseMatchIdFromDeepLink } from "../utils/match";

export default function RootNavigator() {
  const { token, user } = useContext(AuthContext);
  const [pendingMatchId, setPendingMatchId] = useState<number | null>(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  let PageToShow = <></>;
  if (token) {
    if (user?.playerId) {
      PageToShow = <AppStack />;
    } else {
      PageToShow = <SetPlayerStack />;
    }
  } else {
    PageToShow = <AuthStack />;
  }

  const handleDeepLinkUrl = useCallback((url?: string | null) => {
    const matchId = parseMatchIdFromDeepLink(url);
    if (matchId) {
      setPendingMatchId(matchId);
    }
  }, []);

  useEffect(() => {
    const loadInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        handleDeepLinkUrl(initialUrl);
      } catch (e) {
        console.log("Error leyendo deep link inicial", e);
      }
    };
    loadInitialUrl();

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLinkUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLinkUrl]);

  useEffect(() => {
    if (
      isNavigationReady &&
      pendingMatchId &&
      token &&
      user?.playerId &&
      navigationRef.isReady()
    ) {
      navigationRef.navigate("QuieroJugar", { matchId: pendingMatchId });
      setPendingMatchId(null);
    }
  }, [isNavigationReady, pendingMatchId, token, user?.playerId]);

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => setIsNavigationReady(true)}
      >
        {PageToShow}
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
