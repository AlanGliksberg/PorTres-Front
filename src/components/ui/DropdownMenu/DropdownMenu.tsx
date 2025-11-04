import { colors } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import CustomText from "../CustomText/CustomText";
import { styles } from "./DropdownMenu.styles";

interface DropdownOption {
  label: string;
  onPress: () => void;
  icon?: string;
  destructive?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  triggerIcon?: string;
  triggerIconSize?: number;
  triggerIconColor?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  triggerIcon = "more-vert",
  triggerIconSize = 20,
  triggerIconColor = colors.description,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  const handleOptionPress = (option: DropdownOption) => {
    option.onPress();
    setIsVisible(false);
  };

  if (options && options.length === 0) return <></>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.trigger}>
        <MaterialIcons
          name={triggerIcon as any}
          size={triggerIconSize}
          color={triggerIconColor}
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.menuContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                option.destructive && styles.destructiveOption,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              {option.icon && (
                <MaterialIcons
                  name={option.icon as any}
                  size={16}
                  color={option.destructive ? colors.error : colors.text}
                  style={styles.optionIcon}
                />
              )}
              <CustomText
                style={[
                  styles.optionText,
                  option.destructive && styles.destructiveText,
                ]}
              >
                {option.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isVisible && (
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default DropdownMenu;
