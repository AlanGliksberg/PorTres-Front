import { colors, spacing, typography } from "@/src/theme";
import { StyleSheet } from "react-native";

const LINE_THICKNESS = 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  backButton: {},
  backPlaceholder: {
    width: 22,
  },
  title: {
    flex: 1,
    textAlign: "left",
    color: colors.white,
    fontSize: typography.h4,
    fontWeight: "600",
  },
  headerSpacer: {
    width: "27%",
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "73%",
    right: 0,
    justifyContent: "center",
  },
  tVerticalLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: LINE_THICKNESS,
    backgroundColor: colors.white,
  },
  tHorizontalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: LINE_THICKNESS,
    marginTop: -LINE_THICKNESS / 2,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
