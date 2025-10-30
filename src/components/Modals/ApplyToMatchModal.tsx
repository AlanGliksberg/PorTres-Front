import React, { useContext, useState } from "react";
import { View } from "react-native";
import BaseModal from "./BaseModal";
import CustomTextInput from "../ui/CustomTextInput/CustomTextInput";
import { Match } from "@/src/types";
import CustomText from "../ui/CustomText/CustomText";
import SimpleButton from "../ui/SimpleButton/SimpleButton";
import { styles } from "./ApplyToMatchModal.styles";
import CustomTextArea from "../ui/CustomTextArea/CustomTextArea";
import { AuthContext } from "@/src/contexts/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/src/theme";
import FullButton from "../ui/FullButton/FullButton";
import { ModalContext } from "@/src/contexts/ModalContext";
import { applyToMatch } from "@/src/services/application";

interface ApplyToMatchModalProps {
  isVisible: boolean;
  onClose: () => void;
  match: Match | null;
  team: 1 | 2 | undefined;
  onSuccess?: () => void;
}

const ApplyToMatchModal: React.FC<ApplyToMatchModalProps> = ({
  isVisible,
  onClose,
  match,
  team,
  onSuccess,
}) => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const { openErrorModal, openModal } = useContext(ModalContext);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await applyToMatch(match!.id, team || 1, message, phone);
      if (res.error) {
        throw new Error(res.message);
      }
      openModal({
        title: "Postulación exitosa",
        message:
          "Tu postulacion ya le llegó al organizador del partido. Cuando haya alguna novedad te vamos a avisar.",
        primaryAction: onSuccess,
      });
    } catch (error) {
      console.error(error);
      openErrorModal(
        "Error en postulación",
        "Hubo un error al postularte al partido. Intentá nuevamente."
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setPhone("");
    onClose();
  };

  return (
    <BaseModal isVisible={isVisible} onClose={handleClose} title="Postularme">
      <View style={styles.container}>
        <View style={styles.subtitle}>
          <CustomText type="h4">Postulate al partido</CustomText>
          <CustomText type="h4" bold>
            {" "}
            {match?.location}
          </CustomText>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={18}
              color={colors.text}
            />
            <CustomText type="small">
              Enviá un mensaje al organizador del partido (opcional)
            </CustomText>
          </View>
          <CustomTextArea
            placeholder="Me gustaría participar en este partido..."
            value={message}
            onChangeText={setMessage}
            containerStyle={styles.inputBorderStyle}
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Feather name="phone" size={16} color={colors.text} />
            <CustomText type="small">
              Número de teléfono (recomendado)
            </CustomText>
          </View>
          <CustomTextInput
            placeholder="El organizador podrá contactarte"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.phoneInput}
            containerStyle={styles.inputBorderStyle}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <SimpleButton
            title="Cancelar"
            onPress={handleClose}
            containerStyle={styles.cancelButton}
          />
          <FullButton onPress={handleSubmit} size="s" disabled={loading}>
            <CustomText.ButtonText type="small">
              Postularme
            </CustomText.ButtonText>
          </FullButton>
        </View>
      </View>
    </BaseModal>
  );
};

export default ApplyToMatchModal;
