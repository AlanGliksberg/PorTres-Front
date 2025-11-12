import { StyleSheet } from "react-native";
import { colors, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },
  filtersCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    // Sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Elevación Android
    elevation: 2,
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  matchesScroll: {
    flex: 1,
    marginBottom: spacing.md
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 40,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.white,
    height: 300,
  },
  textContainer: {
    gap: spacing.md,
  },
  emptyTitle: {
    textAlign: "center",
    fontWeight: "600",
  },
  emptySubtitle: {
    textAlign: "center",
    color: colors.placeholder,
  },
});
