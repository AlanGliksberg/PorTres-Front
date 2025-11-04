import { colors } from "@/src/theme";
import { Match, Player } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import NewPlayerForm from "./NewPlayerForm";
import PlayersList from "../PlayersList/PlayersList";
import CustomText from "../ui/CustomText/CustomText";
import { styles } from "./AddPlayerToMatchModal.styles";
import { getCurrentPlayer } from "@/src/services/player";
import CustomModalView from "./CustomModalView";

interface PlayerDetailsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  match: Match | null;
  team: number | null;
  onPlayerAdd?: (p: Player) => void;
}

type TabType = "existing" | "new";

const AddPlayerToMatchModal: React.FC<PlayerDetailsModalProps> = ({
  isOpen,
  closeModal,
  match,
  team,
  onPlayerAdd,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("existing");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("existing");
    }
  }, [isOpen]);

  const handleAddMyself = async () => {
    const res = await getCurrentPlayer();
    if (res.error || !res.data) {
      // TODO - modal de error inesperado
      return;
    }

    handleAddExistingPlayer(res.data.player);
  };

  const handleAddExistingPlayer = (player: Player) => {
    onPlayerAdd?.(player);
    onClose();
  };

  const handleAddNewPlayer = (player: Player) => {
    onPlayerAdd?.(player);
    onClose();
  };

  const onClose = () => {
    closeModal();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "existing":
        return (
          <View style={styles.tabContent}>
            <PlayersList onPlayerSelect={handleAddExistingPlayer} />
          </View>
        );
      case "new":
        return (
          <View
            style={[
              styles.tabContent,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <NewPlayerForm onAddNewPlayer={handleAddNewPlayer} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <CustomModalView
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <CustomText style={styles.title} bold type="h3">
                  Agregar jugador
                </CustomText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.headerRoundButton}
                onPress={handleAddMyself}
              >
                <MaterialIcons
                  name="person-add"
                  size={16}
                  color={colors.white}
                />
                <CustomText style={styles.headerRoundButtonText}>
                  Incluirme
                </CustomText>
              </TouchableOpacity>

              {/* Pestañas para otras opciones */}
              <View style={styles.tabsContainer}>
                <View style={styles.tabsHeader}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === "existing" && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab("existing")}
                  >
                    <CustomText
                      style={[
                        styles.tabText,
                        activeTab === "existing" && styles.tabTextActive,
                      ]}
                      bold={activeTab === "existing"}
                      type="medium"
                    >
                      Jugadores registrados
                    </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === "new" && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab("new")}
                  >
                    <CustomText
                      style={[
                        styles.tabText,
                        activeTab === "new" && styles.tabTextActive,
                      ]}
                      bold={activeTab === "new"}
                      type="medium"
                    >
                      Jugador no registrado
                    </CustomText>
                  </TouchableOpacity>
                </View>

                {renderTabContent()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </CustomModalView>
  );
};

export default AddPlayerToMatchModal;
