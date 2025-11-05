import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useCallback, useMemo, useState } from "react";
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Keyboard,
  Platform,
  Modal,
} from "react-native";
import CustomText from "../CustomText/CustomText";
import { styles } from "./CustomDatePicker.styles";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import FullButton from "../FullButton/FullButton";
import SimpleButton from "../SimpleButton/SimpleButton";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import CustomModalView from "../../Modals/CustomModalView";

interface CustomDatePickerProps {
  label?: string;
  date: Date | null;
  minimumDate?: Date;
  onChange: (d: Date | null) => void;
  mandatory?: boolean;
  placeholder?: string;
  error?: string;
  inputStyles?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  neutralButtonLabel?: string;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  date,
  minimumDate,
  onChange,
  mandatory,
  placeholder,
  error,
  inputStyles,
  neutralButtonLabel,
  disabled,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const toggleDatePicker = useCallback(() => {
    setShowDatePicker((prev) => !prev);
  }, []);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== "ios") toggleDatePicker();
    Keyboard.dismiss();
    if (event.type === "neutralButtonPressed") {
      onChange(null);
      return;
    } else if (event.type === "dismissed") {
      return;
    }
    if (date) onChange(date);
  };

  const changeIosDate = () => {
    onDateChange({ type: "set" } as DateTimePickerEvent, date || new Date());
    toggleDatePicker();
  };

  const resetIosDate = () => {
    onDateChange({ type: "neutralButtonPressed" } as DateTimePickerEvent);
    toggleDatePicker();
  };

  const tapToOpen = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(6) // evita tap si hubo scroll > 6px
        .onEnd((_evt, success) => {
          if (success) {
            runOnJS(toggleDatePicker)(); // 🚀 llamar función JS desde worklet
          }
        }),
    [toggleDatePicker]
  );

  return (
    <View>
      {label && (
        <View style={styles.labelContainer}>
          <CustomText type="medium" style={styles.label}>
            {label}
          </CustomText>
          {mandatory && (
            <CustomText type="xsmall" style={styles.label}>
              {" *"}
            </CustomText>
          )}
        </View>
      )}

      {Platform.OS === "ios" ? (
        <CustomModalView
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleDatePicker}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={toggleDatePicker}
          >
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => {}}
            >
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="inline"
                onChange={onDateChange}
                minimumDate={minimumDate}
                themeVariant="light"
              />

              <View style={styles.buttonsSection}>
                <FullButton onPress={changeIosDate}>
                  <CustomText.ButtonText type="h4">
                    Confirmar
                  </CustomText.ButtonText>
                </FullButton>

                {neutralButtonLabel && (
                  <SimpleButton
                    title={neutralButtonLabel}
                    onPress={resetIosDate}
                  />
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </CustomModalView>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={minimumDate}
            neutralButton={{ label: neutralButtonLabel }}
            themeVariant="light"
          />
        )
      )}

      <GestureDetector gesture={tapToOpen}>
        <View pointerEvents="box-only">
          <CustomTextInput
            placeholder={placeholder || "Seleccioná la fecha"}
            value={date?.toLocaleDateString()}
            // onPressIn={toggleDatePicker}
            editable={false}
            containerStyle={inputStyles}
            disabled={disabled}
          />
        </View>
      </GestureDetector>

      {error && <CustomText style={styles.errorText}>{error}</CustomText>}
    </View>
  );
};

export default CustomDatePicker;
