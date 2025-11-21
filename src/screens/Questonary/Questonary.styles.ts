// src/screens/PlayerInfoScreen.styles.ts
import { colors, spacing } from "@/src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    marginBottom: 25,
  },
  buttonText: {
    color: colors.primary,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    width: "80%",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // elevación Android
    elevation: 4,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text,
  },
  subLabel: {
    marginBottom: spacing.md,
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc",
    marginVertical: spacing.md,
  },
  questionsContainer: {
    gap: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
    alignSelf: "flex-end",
  },
  photoSection: {
    gap: spacing.xs,
    alignItems: "center",
  },
  photoLabel: {
    color: colors.text,
    alignSelf: "flex-start",
  },
  photoSubtitle: {
    color: colors.placeholder,
    alignSelf: "flex-start",
  },
  photoPlaceholder: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 65,
    width: 130,
    height: 130,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.input,
  },
  photoPlaceholderText: {
    color: colors.placeholder,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  photoPreview: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: "center",
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  photoActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  photoActionText: {
    color: colors.primary,
  },
  photoRemoveText: {
    color: colors.error,
  },
});
