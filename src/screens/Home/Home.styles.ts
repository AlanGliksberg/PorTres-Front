import { StyleSheet } from "react-native";
import { colors, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flexGrow: 1,
  },
  bottomSection: {
    marginTop: "auto",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  loadResultSection: {
    gap: spacing.sm,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: colors.selectedText,
  },
  createResultButton: {
    alignSelf: "center",
  },
});
