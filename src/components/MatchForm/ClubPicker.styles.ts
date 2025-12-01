import { StyleSheet } from "react-native";
import { colors, spacing } from "@/src/theme";

export const clubPickerStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  optionalLabel: {
    marginLeft: spacing.xs,
    color: colors.placeholder,
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 42,
    justifyContent: "center",
    width: "100%",
  },
  disabledSelector: {
    opacity: 0.5,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    flex: 1,
  },
  placeholder: {
    color: colors.placeholder,
  },
  selectedDescription: {
    color: colors.description,
    marginTop: spacing.xs / 2,
  },
  clearButton: {
    marginTop: spacing.xs,
  },
  clearText: {
    color: colors.link,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    padding: spacing.md,
    height: "60%",
  },
  modalHeader: {
    marginBottom: spacing.sm,
  },
  searchField: {
    marginBottom: spacing.sm,
  },
  clubItem: {
    paddingVertical: spacing.sm,
  },
  itemDescription: {
    color: colors.description,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  emptyState: {
    textAlign: "center",
    color: colors.placeholder,
    marginVertical: spacing.md,
  },
  footerButton: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  footerButtonText: {
    color: colors.link,
  },
});
