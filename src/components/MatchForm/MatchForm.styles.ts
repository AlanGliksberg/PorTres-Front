import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";

export const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 8,
    // Sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Elevación Android
    elevation: 3,
  },
  button: {
    marginTop: spacing.lg,
  },
  teamsContainer: {
    marginTop: spacing.lg,
  },
  manualToggleButton: {
    marginTop: spacing.xs,
  },
  manualToggleText: {
    color: colors.link,
  },
});
