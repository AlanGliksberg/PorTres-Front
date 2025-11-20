import React, { useState } from "react";
import {
  FlatList,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import CustomText, { CustomTextProps } from "../CustomText/CustomText";
import { styles } from "./CustomSelect.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";
import CustomModalView from "../../Modals/CustomModalView";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = {
  id: string | number;
};

export interface CustomSelectProps<T extends Item> {
  label: string;
  labelStyles?: TextStyle;
  labelProps?: CustomTextProps;
  placeholder?: string;
  data: T[];
  value: T["id"] | null;
  onSelect: (id: T["id"]) => void;
  keyExtractor: (item: T) => string;
  labelExtractor: (item: T) => string;
  disabled?: boolean;
  error?: string;
  mandatory?: boolean;
  withReset?: boolean;
  inputStyles?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
}

const CustomSelect = <T extends Item>({
  label,
  labelStyles,
  labelProps,
  placeholder = "Seleccioná...",
  data,
  value,
  onSelect,
  keyExtractor,
  labelExtractor,
  disabled,
  error,
  mandatory,
  withReset = false,
  inputStyles,
}: CustomSelectProps<T>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = data.find((item) => item.id === value) || null;

  // Agregar opción de reset si está habilitada
  const dataWithReset = withReset
    ? [
        ...data,
        {
          id: -1,
          name: "Restablecer",
          code: "Restablecer",
          description: "Restablecer",
        } as unknown as T,
      ]
    : data;

  const handleSelect = (selectedId: T["id"]) => {
    if (selectedId === -1) {
      // Si se selecciona reset, pasar null
      onSelect(null as unknown as T["id"]);
    } else {
      // Selección normal
      onSelect(selectedId);
    }
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <CustomText type="medium" style={labelStyles} {...labelProps}>
          {label}
        </CustomText>
        {mandatory && <CustomText type="xsmall">{" *"}</CustomText>}
      </View>

      <TouchableOpacity
        style={[styles.selectButton, disabled && styles.disabled, inputStyles]}
        onPress={() => !disabled && setModalVisible(true)}
      >
        <CustomText
          type="body"
          style={(!selectedItem && styles.placeholder) || undefined}
        >
          {selectedItem ? labelExtractor(selectedItem) : placeholder}
        </CustomText>
        <Ionicons
          name={modalVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color={disabled ? colors.disabled : colors.text}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}

      <CustomModalView
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView edges={["bottom"]} style={styles.modalSafeArea}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <FlatList
              data={dataWithReset}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => {
                const isSelected = item.id === value;
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.selected]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <CustomText type="body">{labelExtractor(item)}</CustomText>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </SafeAreaView>
      </CustomModalView>
    </View>
  );
};

export default CustomSelect;
