import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flexGrow: 1,
  },
  bottomSection: {
    marginTop: "auto",
    paddingBottom: spacing.sm,
  },
});
