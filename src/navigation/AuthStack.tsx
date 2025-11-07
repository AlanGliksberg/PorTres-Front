import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Login, Register, TermsAndConditions } from "../screens";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
    </Stack.Navigator>
  );
}
