// src/navigation/RootNavigator.tsx
import React, { useContext } from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { SetPlayerStack } from "./SetPlayerStack";
import { navigationRef } from "./navigationRef";

export default function RootNavigator() {
  const { token, user } = useContext(AuthContext);

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

  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={navigationRef}>{PageToShow}</NavigationContainer>
    </NavigationIndependentTree>
  );
}
