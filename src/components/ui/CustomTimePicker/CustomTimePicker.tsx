import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import CustomText from "../CustomText/CustomText";
import { styles } from "./CustomTimePicker.styles";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import FullButton from "../FullButton/FullButton";
import SimpleButton from "../SimpleButton/SimpleButton";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import CustomModalView from "../../Modals/CustomModalView";

interface CustomTimePickerProps {
  label?: string;
  time: Date | null;
  onChange: (d: Date | null) => void;
  mandatory?: boolean;
  placeholder?: string;
  error?: string;
  inputStyles?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  neutralButtonLabel?: string;
  disabled?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  time,
  onChange,
  mandatory,
  placeholder,
  error,
  inputStyles,
  neutralButtonLabel,
  disabled,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const toggleTimePicker = useCallback(() => {
    setShowTimePicker((prev) => {
      if (disabled && !prev) return prev;
      return !prev;
    });
  }, [disabled]);

  const d = new Date();
  d.setHours(19, 0, 0, 0);
  const selectedTime = time || d;

  const onTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    if (Platform.OS !== "ios") toggleTimePicker();
    Keyboard.dismiss();
    if (event.type === "neutralButtonPressed") {
      onChange(null);
      return;
    } else if (event.type === "dismissed") {
      return;
    }
    if (time) onChange(time);
  };

  const changeIosTime = () => {
    onTimeChange({ type: "set" } as DateTimePickerEvent, time || d);
    toggleTimePicker();
  };

  const resetIosTime = () => {
    onTimeChange({ type: "neutralButtonPressed" } as DateTimePickerEvent);
    toggleTimePicker();
  };

  const tapToOpen = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(6)
        .enabled(!disabled)
        .onEnd((_evt, success) => {
          if (success) {
            runOnJS(toggleTimePicker)();
          }
        }),
    [disabled, toggleTimePicker]
  );

  return (
    <View>
      {label && (
        <View style={styles.labelContainer}>
          <CustomText type="medium" style={styles.label}>
            Hora
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
          visible={showTimePicker}
          animationType="slide"
          onRequestClose={toggleTimePicker}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={toggleTimePicker}
          >
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => {}}
            >
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
                is24Hour
                themeVariant="light"
              />
              <View style={styles.buttonsSection}>
                <FullButton onPress={changeIosTime}>
                  <CustomText.ButtonText type="h4">
                    Confirmar
                  </CustomText.ButtonText>
                </FullButton>

                {neutralButtonLabel && (
                  <SimpleButton
                    title={neutralButtonLabel}
                    onPress={resetIosTime}
                  />
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </CustomModalView>
      ) : (
        showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
            is24Hour
            neutralButton={{ label: neutralButtonLabel }}
            themeVariant="light"
          />
        )
      )}

      <GestureDetector gesture={tapToOpen}>
        <View pointerEvents="box-only">
          <CustomTextInput
            placeholder={placeholder || "Seleccioná la hora"}
            value={time?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
            // onPressIn={toggleTimePicker}
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

export default CustomTimePicker;
