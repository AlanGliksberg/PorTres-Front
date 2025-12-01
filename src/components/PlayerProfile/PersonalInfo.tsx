import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";

import CustomText from "@/src/components/ui/CustomText/CustomText";
import { colors } from "@/src/theme";
import { Player } from "@/src/types/player/Player";
import { GENDER_CODE } from "@/src/types/player/Gender";
import { styles } from "./PlayerProfile.styles";
import { PlayerModalsContext } from "@/src/contexts/PlayerModalsContext";

interface PersonalInfoProps {
  player: Player | null;
  handleRefresh: () => void;
  readOnly: boolean;
}

export default function PersonalInfo({
  player,
  handleRefresh,
  readOnly = true,
}: PersonalInfoProps) {
  const { openEditProfileModal } = useContext(PlayerModalsContext);

  const onEditProfile = () => {
    if (player) {
      openEditProfileModal(player, handleRefresh);
    }
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CustomText style={styles.sectionTitle}>Datos Personales</CustomText>
          {!readOnly && (
            <TouchableOpacity onPress={onEditProfile}>
              <MaterialIcons name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="account-circle"
              size={20}
              color={colors.primary}
            />
            <CustomText style={styles.detailText}>
              {player?.firstName && player?.lastName
                ? `${player.firstName} ${player.lastName}`
                : "No especificado"}
            </CustomText>
          </View>

          {!readOnly && (
            <View style={styles.detailRow}>
              <MaterialIcons name="phone" size={20} color={colors.primary} />
              <CustomText style={styles.detailText}>
                {player?.phone || "No especificado"}
              </CustomText>
            </View>
          )}

          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name={
                player?.gender?.code === GENDER_CODE.CABALLERO
                  ? "gender-male"
                  : "gender-female"
              }
              size={20}
              color={colors.primary}
            />
            <CustomText style={styles.detailText}>
              {player?.gender?.name || "No especificado"}
            </CustomText>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="target"
              size={20}
              color={colors.primary}
            />
            <CustomText style={styles.detailText}>
              {player?.position?.description || "No especificado"}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
}
