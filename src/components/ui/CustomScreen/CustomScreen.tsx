import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./CustomScreen.styles";
import CustomText from "../CustomText/CustomText";

interface CustomScreenProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  loading?: boolean;
}

const CustomScreen: React.FC<CustomScreenProps> = ({
  children,
  title,
  showBack = false,
  loading = false,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <CustomText style={styles.title}>{title}</CustomText>
        </View>
        <View style={styles.headerSpacer} />
        <View pointerEvents="none" style={styles.headerDecoration}>
          {/* <View style={styles.tVerticalLine} />
          <View style={styles.tHorizontalLine} /> */}
        </View>
      </View>
      <View style={styles.content}>
        {loading ? (
          <BlurView intensity={50} style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </BlurView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomScreen;
