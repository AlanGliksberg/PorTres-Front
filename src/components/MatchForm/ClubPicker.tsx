import React, { useMemo, useState, useCallback } from "react";
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CustomText from "@/src/components/ui/CustomText/CustomText";
import CustomTextInput from "@/src/components/ui/CustomTextInput/CustomTextInput";
import CustomModalView from "@/src/components/Modals/CustomModalView";
import useClubs from "@/src/hooks/useClubs";
import { Club } from "@/src/types";
import { clubPickerStyles as styles } from "./ClubPicker.styles";
import { colors } from "@/src/theme";

type ClubPickerProps = {
  value: number | null;
  onChange: (clubId: number | null) => void;
  error?: string;
  mandatory?: boolean;
  disabled?: boolean;
  onSwitchToManual?: () => void;
};

const ClubPicker: React.FC<ClubPickerProps> = ({
  value,
  onChange,
  error,
  mandatory,
  disabled = false,
  onSwitchToManual,
}) => {
  const { data: clubs = [], loading } = useClubs();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");

  const selectedClub = clubs.find((club) => club.id === value) || null;

  const filteredClubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter((club) => {
      const nameMatches = club.name.toLowerCase().includes(q);
      const descriptionMatches =
        club.description?.toLowerCase().includes(q) || false;
      return nameMatches || descriptionMatches;
    });
  }, [clubs, query]);

  const closeModal = useCallback(() => {
    setVisible(false);
    setQuery("");
  }, []);

  const handleSelect = useCallback(
    (clubId: number) => {
      onChange(clubId);
      closeModal();
    },
    [closeModal, onChange]
  );

  const handleClear = useCallback(() => {
    onChange(null);
    closeModal();
  }, [closeModal, onChange]);

  const handleManualSelection = useCallback(() => {
    handleClear();
    onSwitchToManual?.();
  }, [handleClear, onSwitchToManual]);

  const renderClub = useCallback(
    ({ item }: { item: Club }) => (
      <ClubListItem club={item} onSelect={handleSelect} />
    ),
    [handleSelect]
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <CustomText type="medium">Club</CustomText>
        {mandatory && <CustomText type="xsmall">{" *"}</CustomText>}
      </View>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          <View style={styles.selectorText}>
            <CustomText
              type="body"
              style={!selectedClub ? styles.placeholder : undefined}
            >
              {selectedClub
                ? selectedClub.name
                : loading
                ? "Cargando clubes..."
                : "Elegí un club"}
            </CustomText>
            {selectedClub?.description ? (
              <CustomText type="small" style={styles.selectedDescription}>
                {selectedClub.description}
              </CustomText>
            ) : null}
          </View>
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text}
          />
        </View>
      </TouchableOpacity>
      {selectedClub && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChange(null)}
          disabled={disabled}
        >
          <CustomText type="small" style={styles.clearText}>
            Quitar selección
          </CustomText>
        </TouchableOpacity>
      )}
      {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}

      <CustomModalView
        visible={visible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["bottom"]}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <CustomText type="h3" bold>
                Elegí un club
              </CustomText>
              <CustomText type="small" style={styles.selectedDescription}>
                Buscá por nombre o descripción
              </CustomText>
            </View>
            <CustomTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar club"
              autoFocus
              containerStyle={styles.searchField}
            />
            {filteredClubs.length ? (
              <FlatList
                data={filteredClubs}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                keyboardShouldPersistTaps="handled"
                renderItem={renderClub}
              />
            ) : (
              <CustomText type="body" style={styles.emptyState}>
                {loading
                  ? "Cargando clubes..."
                  : "No encontramos clubes con ese nombre"}
              </CustomText>
            )}
            {onSwitchToManual && (
              <TouchableOpacity
                style={styles.footerButton}
                onPress={handleManualSelection}
              >
                <CustomText type="body" style={styles.footerButtonText}>
                  No encuentro mi club, cargar otra ubicación
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </CustomModalView>
    </View>
  );
};

export default ClubPicker;

type ClubListItemProps = {
  club: Club;
  onSelect: (clubId: number) => void;
};

const ClubListItem: React.FC<ClubListItemProps> = React.memo(
  ({ club, onSelect }) => {
    return (
      <TouchableOpacity
        style={styles.clubItem}
        onPress={() => onSelect(club.id)}
      >
        <CustomText type="body">{club.name}</CustomText>
        {club.description ? (
          <CustomText type="small" style={styles.itemDescription}>
            {club.description}
          </CustomText>
        ) : null}
      </TouchableOpacity>
    );
  }
);

ClubListItem.displayName = "ClubListItem";
