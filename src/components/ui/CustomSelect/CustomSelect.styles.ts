import { colors, spacing, typography } from "@/src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 42,
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  placeholder: {
    color: colors.placeholder,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption,
    marginLeft: 5,
  },
  backdrop: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    maxHeight: "50%",
    padding: spacing.md,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
  },
  item: {
    padding: spacing.sm,
  },
  selected: {
    backgroundColor: colors.selected,
    borderRadius: 4,
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc",
  },
  chevronIcon: {
    marginLeft: spacing.sm,
  },
});
