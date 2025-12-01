import { colors, spacing } from "@/src/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";
import CustomText from "../ui/CustomText/CustomText";
import CustomTextInput from "../ui/CustomTextInput/CustomTextInput";
import CustomSelect from "../ui/CustomSelect/CustomSelect";
import FullButton from "../ui/FullButton/FullButton";
import useGenders from "@/src/hooks/useGenders";
import useCategories from "@/src/hooks/useCategories";
import { styles } from "./NewPlayerForm.styles";
import { Player } from "@/src/types";

interface NewPlayerFormProps {
  onAddNewPlayer: (playerData: Player) => void;
}

const NewPlayerForm: React.FC<NewPlayerFormProps> = ({ onAddNewPlayer }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [genderId, setGenderId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");

  const { data: genders } = useGenders(true);
  const { data: allCategories } = useCategories(true);

  // Filtrar categorías por género seleccionado
  const categories = allCategories.filter((c) => c.genderId === genderId);

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !categoryId || !genderId) {
      // TODO: Mostrar error de validación
      return;
    }

    const player = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      categoryId,
      category: categories.find((c) => c.id === categoryId),
      genderId,
      gender: genders.find((g) => g.id === genderId),
      phone: phone.trim() || null,
    } as Player;

    onAddNewPlayer(player);
  };

  const isFormValid =
    firstName.trim() && lastName.trim() && categoryId && genderId;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
    >
      <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
        <View style={styles.header}>
          <MaterialIcons name="person-add" size={48} color={colors.primary} />
          <CustomText style={styles.description} type="body">
            Completá los datos para invitar al jugador
          </CustomText>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Nombre"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ingresa el nombre"
            mandatory
          />

          <CustomTextInput
            label="Apellido"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ingresa el apellido"
            mandatory
          />

          <CustomSelect
            label="Género"
            data={genders}
            value={genderId}
            onSelect={(v) => {
              Keyboard.dismiss();
              setGenderId(v);
            }}
            keyExtractor={(item) => item.id.toString()}
            labelExtractor={(item) => item.name}
            placeholder="Seleccioná el género"
            mandatory
          />

          <CustomSelect
            label="Categoría"
            data={categories}
            value={categoryId}
            onSelect={(v) => {
              Keyboard.dismiss();
              setCategoryId(v);
            }}
            keyExtractor={(item) => item.id.toString()}
            labelExtractor={(item) => item.description}
            placeholder="Seleccioná la categoría"
            mandatory
            disabled={!genderId}
          />

          <CustomTextInput
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="Ingresa el número de teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.actions}>
          <FullButton onPress={handleSubmit} disabled={!isFormValid} size="xl">
            <MaterialIcons name="add" size={20} color={colors.white} />
            <CustomText style={styles.buttonText} bold>
              Agregar jugador
            </CustomText>
          </FullButton>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewPlayerForm;
