import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginTop: 30,
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
  buttonText: {
    color: colors.primary,
  },
  inner: {
    flex: 1,
  },
  content: {
    marginTop: spacing.md,
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
    gap: 10,
  },
  title: {
    marginTop: 50,
    fontSize: typography.h1,
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  tycContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: 8,
  },
  tycCheckbox: {
    padding: spacing.xs,
  },
  tycText: {
    flex: 1,
    color: colors.text,
  },
  tycLink: {
    color: colors.link,
    textDecorationLine: "underline",
  },
});
