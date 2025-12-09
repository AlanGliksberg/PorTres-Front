import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/src/theme";

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  subtitleText: {
    flexShrink: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  labelContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  inputDescription: {
    marginBottom: spacing.xs,
    color: colors.placeholder,
  },
  inputBorderStyle: {
    borderColor: colors.placeholder,
    borderWidth: 1,
  },
  phoneInput: {
    fontSize: typography.medium,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: spacing.lg,
  },
});
