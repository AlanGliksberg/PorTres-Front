import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginTop: 30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
    minHeight: "100%",
    justifyContent: "center",
  },
  content: {
    marginTop: spacing.md,
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
    gap: 10,
  },
  title: {
    marginTop: 0,
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
  photoContainer: {
    gap: spacing.sm,
  },
  photoLabel: {
    color: colors.text,
  },
  photoPlaceholder: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.input,
  },
  photoPlaceholderText: {
    color: colors.placeholder,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.input,
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
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
