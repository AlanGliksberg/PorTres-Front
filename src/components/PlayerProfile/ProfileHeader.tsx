import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import CustomText from "@/src/components/ui/CustomText/CustomText";
import { AuthContext } from "@/src/contexts/AuthContext";
import { Player } from "@/src/types/player/Player";
import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";
import { styles } from "./PlayerProfile.styles";
import { getPlayedMatchesCount } from "@/src/services/match";
import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ModalContext } from "@/src/contexts/ModalContext";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import {
  deletePlayerPicture,
  updatePlayerPicture,
} from "@/src/services/player";
import { removeAllMatchesCache } from "@/src/services/cache";

interface ProfileHeaderProps {
  player: Player | null;
  onPhotoUpdated?: () => void;
  readOnly: boolean;
}

export default function ProfileHeader({
  player,
  onPhotoUpdated,
  readOnly = true,
}: ProfileHeaderProps) {
  const { openErrorModal, openModal } = useContext(ModalContext);
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const [matchesCount, setMatchesCount] = useState<number | string>(0);
  const [loadingMatchesCount, setLoadingMatchesCount] = useState(false);
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    const loadMatchesCount = async () => {
      setLoadingMatchesCount(true);
      if (player?.id) {
        const response = await getPlayedMatchesCount(player.id);
        if (!response.error && response.data) {
          setMatchesCount(response.data.count);
        } else {
          setMatchesCount("S/I");
        }
      }
      setLoadingMatchesCount(false);
    };

    loadMatchesCount();
  }, [player]);

  const requestGalleryAccess = async () => {
    if (galleryPermission?.granted) return true;
    const permission = await requestGalleryPermission();
    if (!permission.granted) {
      openErrorModal(
        "Permisos",
        "Necesitamos acceder a tu galería para que puedas actualizar tu foto de perfil."
      );
      return false;
    }
    return true;
  };

  const handleEditPhoto = async () => {
    const hasPermission = await requestGalleryAccess();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      cameraType: ImagePicker.CameraType.front,
      shape: "oval",
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    const photoPayload = {
      uri: asset.uri,
      type: asset.mimeType || "image/jpeg",
      name:
        asset.fileName ||
        `profile-photo-${Date.now()}.${
          (asset.mimeType || "image/jpeg").split("/").pop() || "jpg"
        }`,
    };

    try {
      showLoading();
      const response = await updatePlayerPicture(photoPayload);
      if (response.error) {
        openErrorModal(
          "Foto de perfil",
          "No pudimos actualizar tu foto. Intentá nuevamente."
        );
        return;
      }
      onPhotoUpdated?.();
      removeAllMatchesCache();
      openModal({
        title: "Foto actualizada",
        message: "Tu foto de perfil se actualizó correctamente.",
        primaryLabel: "Aceptar",
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      openErrorModal(
        "Foto de perfil",
        "Ocurrió un error al actualizar tu foto. Intentá nuevamente."
      );
    } finally {
      hideLoading();
    }
  };

  const removePhoto = async () => {
    try {
      showLoading();
      const response = await deletePlayerPicture();
      if (response.error) {
        openErrorModal(
          "Foto de perfil",
          "No pudimos eliminar tu foto. Intentá nuevamente."
        );
        return;
      }
      onPhotoUpdated?.();
      openModal({
        title: "Foto eliminada",
        message: "Tu foto de perfil se eliminó correctamente.",
        primaryLabel: "Aceptar",
      });
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      openErrorModal(
        "Foto de perfil",
        "Ocurrió un error al eliminar tu foto. Intentá nuevamente."
      );
    } finally {
      hideLoading();
    }
  };

  const handleRemovePhoto = () => {
    if (!player?.user?.photoUrl) return;
    openModal({
      title: "Eliminar foto",
      message: "¿Estás seguro de que querés eliminar tu foto de perfil?",
      primaryLabel: "Eliminar",
      primaryAction: removePhoto,
      secondaryLabel: "Cancelar",
    });
  };

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <PlayerAvatar player={player} size="xl" touchable={false} />
        {!readOnly && (
          <View style={styles.avatarActions}>
            {player?.user?.photoUrl && (
              <TouchableOpacity
                style={[styles.avatarActionButton, styles.deleteAvatarButton]}
                onPress={handleRemovePhoto}
              >
                <MaterialIcons name="delete" size={16} color={colors.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.avatarActionButton,
                styles.editAvatarButton,
                !player?.user?.photoUrl ? styles.soloIcon : null,
              ]}
              onPress={handleEditPhoto}
            >
              <MaterialIcons name="edit" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.profileInfo}>
        <CustomText style={styles.playerName}>
          {player?.firstName || "S/I"} {player?.lastName}
        </CustomText>
        <CustomText style={styles.playerEmail}>
          {!readOnly && player?.user?.email}
        </CustomText>
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <CustomText style={styles.statValue}>
              {player?.category?.description || "S/I"}
            </CustomText>
            <CustomText style={styles.statLabel}>Categoría</CustomText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CustomText style={styles.statValue}>
              {player?.rankingPoints || "S/I"}
            </CustomText>
            <CustomText style={styles.statLabel}>Puntos</CustomText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CustomText style={styles.statValue}>
              {loadingMatchesCount ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                matchesCount
              )}
            </CustomText>
            <CustomText style={styles.statLabel}>Partidos</CustomText>
          </View>
        </View>
      </View>
    </View>
  );
}
