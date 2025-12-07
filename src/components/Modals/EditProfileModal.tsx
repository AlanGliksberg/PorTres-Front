import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";

import { ModalContext } from "@/src/contexts/ModalContext";

import CustomSelect from "@/src/components/ui/CustomSelect/CustomSelect";
import CustomText from "@/src/components/ui/CustomText/CustomText";
import CustomTextInput from "@/src/components/ui/CustomTextInput/CustomTextInput";
import FullButton from "@/src/components/ui/FullButton/FullButton";
import usePositions from "@/src/hooks/usePositions";
import { updatePlayer } from "@/src/services/player";
import { Player } from "@/src/types/player/Player";
import { Position } from "@/src/types/player/Position";
import { styles } from "./EditProfileModal.styles";
import CustomModalView from "./CustomModalView";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  player: Player | null;
  onUpdate?: () => void;
}

export default function EditProfileModal({
  isVisible,
  onClose,
  player,
  onUpdate,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const { data: positions } = usePositions(isVisible);
  const { openErrorModal, openModal } = useContext(ModalContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [positionId, setPositionId] = useState(0);

  useEffect(() => {
    if (player) {
      setFirstName(player.firstName || "");
      setLastName(player.lastName || "");
      setPhone(player.phone || "");
      setPositionId(player.position?.id || 0);
    }
  }, [player]);

  const handleClose = () => {
    onClose();
  };

  const handleModalPress = () => {
    Keyboard.dismiss();
  };

  const onSubmit = async () => {
    setLoading(true);

    const res = await updatePlayer({
      firstName,
      lastName,
      phone,
      positionId,
      playerId: player?.id,
    });

    if (res.error) {
      openErrorModal(
        "Error",
        "No se pudo actualizar el perfil. Intentá nuevamente."
      );
      setLoading(false);
      return;
    }

    openModal({
      title: "Perfil actualizado",
      message: "Tu perfil ha sido actualizado correctamente",
      primaryLabel: "Aceptar",
      primaryAction: () => {
        handleClose();
        if (onUpdate) {
          onUpdate();
        }
      },
    });
    setLoading(false);
  };

  return (
    <CustomModalView
      visible={isVisible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={handleModalPress}
        >
          <View style={styles.header}>
            <CustomText style={styles.title}>
              Editar datos personales
            </CustomText>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            <CustomTextInput
              label="Nombre"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ingresa tu nombre"
            />

            <CustomTextInput
              label="Apellido"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingresa tu apellido"
            />

            <CustomTextInput
              label="Teléfono"
              value={phone}
              onChangeText={setPhone}
              placeholder="Ingresa tu teléfono"
              keyboardType="phone-pad"
            />

            {positions && (
              <CustomSelect<Position>
                label="Posición"
                data={positions}
                value={positionId}
                onSelect={setPositionId}
                keyExtractor={(pos: Position) => pos.id.toString()}
                labelExtractor={(pos: Position) => pos.description}
                placeholder="Seleccioná tu posición"
              />
            )}
          </ScrollView>

          <View style={styles.footer}>
            <FullButton onPress={onSubmit} disabled={loading}>
              <CustomText style={styles.buttonText}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </CustomText>
            </FullButton>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </CustomModalView>
  );
}
