import MatchForm from "@/src/components/MatchForm/MatchForm";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import { ModalContext } from "@/src/contexts/ModalContext";
import { removeLiveMatchesCache } from "@/src/services/cache";
import { createMatch } from "@/src/services/match";
import {
  CreateMatchBody,
  MatchFormValues,
  MeFaltaAlguienStackParamList,
} from "@/src/types";
import { dateToString, timeToString } from "@/src/utils/common";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./CrearPartido.styles";

const CrearPartido: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<MeFaltaAlguienStackParamList>>();
  const { openErrorModal } = useContext(ModalContext);
  const { hideLoading, showLoading } = useContext(LoadingContext);

  const onSubmit = async (form: MatchFormValues) => {
    const data: CreateMatchBody = {
      description: form.description,
      date: dateToString(form.date!),
      time: timeToString(form.time!),
      categoryId: form.categoryId!,
      duration: form.duration!,
      genderId: form.genderId!,
      teams: {
        team1:
          form.teams
            .find((t) => t.teamNumber === 1)
            ?.players.map((p) => (p.id ? { id: p.id } : p)) || [],
        team2:
          form.teams
            .find((t) => t.teamNumber === 2)
            ?.players.map((p) => (p.id ? { id: p.id } : p)) || [],
      },
    };
    if (form.clubId) {
      data.clubId = form.clubId;
    } else {
      data.location = form.name;
    }
    showLoading();
    const res = await createMatch(data);
    hideLoading();
    if (res.error) {
      if (res.code === 4) {
        openErrorModal(
          "Crear partido",
          "El género de uno o más jugadores no coincide con el género del partido"
        );
      } else if (res.code === 16) {
        openErrorModal(
          "Crear partido",
          "No se puede repetir un jugador en el partido"
        );
      } else {
        openErrorModal(
          "Crear partido",
          "Hubo un error inesperado creando el partido"
        );
      }
    } else {
      removeLiveMatchesCache();
      navigation.navigate("MeFaltaAlguien");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <MatchForm onSubmit={onSubmit} />
      </ScrollView>
    </View>
  );
};

export default CrearPartido;
