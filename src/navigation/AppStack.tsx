import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationState } from "@react-navigation/native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FALTA_ALGUIEN_PAGE_NAME,
  HOME_PAGE_NAME,
  PERFIL_PAGE_NAME,
  QUIERO_JUGAR_PAGE_NAME,
} from "../constants/pages";
import { Home, Perfil, QuieroJugar } from "../screens";
import { colors, typography } from "../theme";
import { AppStackParamList } from "../types";
import MeFaltaAlguienStack from "./MeFaltaAlguienStack";

const Tab = createBottomTabNavigator<AppStackParamList>();

const shouldResetStack = (state?: NavigationState) =>
  state?.type === "stack" && state.index > 0;

const createTabPressListener = (
  routeName: keyof AppStackParamList,
  params?: Record<string, unknown>
) => {
  return ({ navigation, route }: any) => ({
    tabPress: (event: { preventDefault: () => void }) => {
      const currentRoute = navigation
        .getState()
        .routes.find((r: { key: string }) => r.key === route.key);
      const state = currentRoute?.state as NavigationState | undefined;

      if (shouldResetStack(state)) {
        event.preventDefault();
        navigation.navigate(routeName, params);
      }
    },
  });
};

// TODO - cuando se entra a cada pestaña se deberia scrollear arriba de todo.
export function AppStack() {
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: typography.xsmall },
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 56 + tabBarPaddingBottom,
        },
        popToTopOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: HOME_PAGE_NAME,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
        listeners={createTabPressListener("Home")}
      />

      <Tab.Screen
        name="QuieroJugar"
        component={QuieroJugar}
        options={{
          title: QUIERO_JUGAR_PAGE_NAME,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sports-tennis" size={size} color={color} />
          ),
        }}
        listeners={createTabPressListener("QuieroJugar")}
      />

      <Tab.Screen
        name="MeFaltaAlguienStack"
        component={MeFaltaAlguienStack}
        options={{
          title: FALTA_ALGUIEN_PAGE_NAME,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="group-add" size={size} color={color} />
          ),
        }}
        listeners={createTabPressListener("MeFaltaAlguienStack", {
          screen: "MeFaltaAlguien",
        })}
      />

      <Tab.Screen
        name="MiPerfil"
        component={Perfil}
        options={{
          title: PERFIL_PAGE_NAME,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (event: { preventDefault: () => void }) => {
            event.preventDefault();
            navigation.navigate("MiPerfil", {
              playerId: undefined,
              readOnly: false,
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
