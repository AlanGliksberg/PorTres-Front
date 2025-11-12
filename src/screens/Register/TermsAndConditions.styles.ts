import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    marginTop: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.sm,
  },
  backText: {
    color: colors.primary,
  },
  title: {
    fontSize: typography.h1,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  paragraph: {
    color: colors.text,
    lineHeight: 20,
  },
});
