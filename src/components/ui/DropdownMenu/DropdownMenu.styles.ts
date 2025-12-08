import { colors, spacing } from "@/src/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
  },
  trigger: {
    height: 26,
    width: 26,
    // padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    borderRadius: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: -height,
    left: -width,
    right: -width,
    bottom: -height,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  menuContainer: {
    position: "absolute",
    top: 35,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.xs,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
  },
  destructiveOption: {
    backgroundColor: colors.error + "10",
  },
  optionIcon: {
    marginRight: spacing.sm,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  destructiveText: {
    color: colors.error,
  },
});
