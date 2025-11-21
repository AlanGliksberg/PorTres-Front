import { colors } from "@/src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInverse: {
    backgroundColor: colors.white,
  },
  avatarText: {
    color: colors.white,
  },
  avatarTextInverse: {
    color: colors.primary,
  },
  border: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  size_s: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  size_m: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  size_l: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  size_xl: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
});
