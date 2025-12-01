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
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border || colors.surface,
  },
  tabButtonActive: {
    backgroundColor: "#e8f1ff",
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.text,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  updateDate: {
    color: colors.description,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  paragraph: {
    color: colors.text,
    lineHeight: 22,
    fontSize: typography.body,
  },
  subTitle: {
    fontSize: typography.h2,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
});
