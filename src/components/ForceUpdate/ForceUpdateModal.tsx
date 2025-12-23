import React from "react";
import { Linking, Modal, Platform, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import CustomText from "../ui/CustomText/CustomText";
import FullButton from "../ui/FullButton/FullButton";
import { styles } from "./ForceUpdateModal.styles";

type ForceUpdateModalProps = {
  visible: boolean;
  message?: string;
  storeUrl?: string;
};

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  message,
  storeUrl,
}) => {
  const handleOpenStore = () => {
    if (!storeUrl) return;
    Linking.openURL(storeUrl).catch((error) =>
      console.warn("No se pudo abrir la tienda", error)
    );
  };

  const subtitle =
    message ||
    "Necesitás actualizar a la última versión para seguir usando PorTres.";

  const platformLabel = Platform.OS === "ios" ? "App Store" : "Play Store";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <MaterialIcons
              name="system-update"
              size={34}
              color={colors.secondary}
            />
          </View>
          <CustomText type="h3" bold style={styles.textCenter}>
            Actualizá la app
          </CustomText>
          <CustomText type="body" style={[styles.textCenter]}>
            {subtitle}
          </CustomText>
          <FullButton onPress={handleOpenStore} disabled={!storeUrl} size="l">
            <CustomText.ButtonText
              bold
              type="medium"
              style={{ color: "white" }}
            >
              Ir a {platformLabel}
            </CustomText.ButtonText>
          </FullButton>
        </View>
      </View>
    </Modal>
  );
};

export default ForceUpdateModal;
