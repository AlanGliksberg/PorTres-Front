import { createNavigationContainerRef } from "@react-navigation/native";
import { AppStackParamList } from "../types/navigation/AppStack";

export const navigationRef =
  createNavigationContainerRef<AppStackParamList>();
