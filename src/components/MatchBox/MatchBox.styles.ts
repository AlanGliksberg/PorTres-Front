import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  status: {
    backgroundColor: colors.accent,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    textTransform: "capitalize",
    marginBottom: spacing.sm,
    fontSize: typography.small,
  },
  location: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
    marginRight: 5,
  },
  description: {
    fontSize: typography.small,
    color: colors.description,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: typography.small,
    color: colors.description,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.tag,
    color: colors.tagText,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tagText,
    marginRight: spacing.sm,
    fontSize: typography.small,
  },
  vs: {
    marginHorizontal: spacing.sm,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  applicationsButtonText: {
    color: colors.primary,
  },
  badge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.accent,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: spacing.lg / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: "600",
  },
  column1: {
    width: "65%",
    gap: 2,
  },
  column2: {
    alignItems: "flex-end",
    width: "30%",
    justifyContent: "space-between",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 3,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  moreOptionsButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  applicationContainer: {
    gap: spacing.xs,
  },
  resultsButtonText: {
    color: colors.primary,
  },
});
