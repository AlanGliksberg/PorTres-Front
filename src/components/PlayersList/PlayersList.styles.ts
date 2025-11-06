import { colors, spacing } from "@/src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    marginTop: spacing.md,
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sub: {
    marginTop: spacing.xs,
    color: colors.placeholder,
  },
  addIconContainer: {
    marginLeft: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc",
    marginVertical: 4,
    marginHorizontal: spacing.md,
  },
  filtersButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: spacing.sm,
    marginRight: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  filtersButtonText: {
    marginLeft: spacing.xs,
    color: colors.primary,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 15,
  },
  emptyText: {
    width: "80%",
    textAlign: "center",
    lineHeight: 24,
    color: colors.placeholder,
  },
  activeFilterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: "white",
  },
  filterIconContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
