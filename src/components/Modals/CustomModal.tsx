import { colors } from "@/src/theme";
import { ModalProps } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import CustomText from "../ui/CustomText/CustomText";
import FullButton from "../ui/FullButton/FullButton";
import SimpleButton from "../ui/SimpleButton/SimpleButton";
import { styles } from "./CustomModal.styles";
import CustomModalView from "./CustomModalView";

const CustomModal: React.FC<ModalProps> = ({ params, isOpen, closeModal }) => {
  const hideSecondary = params?.hideSecondary;
  return (
    <CustomModalView
      visible={isOpen}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <CustomText style={styles.title}>{params?.title}</CustomText>
                {!params?.hideClose && (
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <MaterialIcons name="close" size={28} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>

              <CustomText style={styles.message}>{params?.message}</CustomText>

              {params?.secondParagraph && (
                <CustomText style={styles.message}>
                  {params?.secondParagraph}
                </CustomText>
              )}

              <View
                style={[
                  styles.buttonsContainer,
                  hideSecondary && styles.singleButtonContainer,
                ]}
              >
                {!hideSecondary && (
                  <SimpleButton
                    title={params?.secondaryLabel || "Cancelar"}
                    onPress={() => {
                      closeModal();
                      params?.secondaryAction?.();
                    }}
                  />
                )}
                <FullButton
                  onPress={() => {
                    closeModal();
                    params?.primaryAction?.();
                  }}
                  size="s"
                >
                  <CustomText.ButtonText type="small">
                    {params?.primaryLabel || "Aceptar"}
                  </CustomText.ButtonText>
                </FullButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </CustomModalView>
  );
};

export default CustomModal;
