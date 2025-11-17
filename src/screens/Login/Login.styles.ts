import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    textAlign: "center",
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  inputsContainer: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  googleButton: {
    backgroundColor: colors.google,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  forgotText: {
    color: colors.primary,
    fontSize: typography.small,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  buttonContainer: {
    display: "flex",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  mainButtonsContainer: {
    display: "flex",
    gap: spacing.md,
  },
  secondaryButtonsContainer: {
    display: "flex",
    gap: spacing.sm,
    alignItems: "center",
  },
});
