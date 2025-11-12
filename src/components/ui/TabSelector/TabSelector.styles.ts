import { colors, spacing } from "@/src/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    backgroundColor: colors.white, // fondo blanco
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.selectedText,
    alignSelf: "center",
    height: 44,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabSelected: {
    backgroundColor: colors.selected,
  },
  tabText: {
    color: colors.placeholder,
  },
  tabTextSelected: {
    color: colors.selectedText,
  },
  divider: {
    width: 2,
    backgroundColor: colors.selectedText,
    alignSelf: "center",
    height: "100%",
  },
  content: {
    flex: 1,
  },
});
