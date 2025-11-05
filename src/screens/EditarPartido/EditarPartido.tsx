import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { ScrollView } from "react-native";

import MatchForm from "@/src/components/MatchForm/MatchForm";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import { ModalContext } from "@/src/contexts/ModalContext";
import { removeLiveMatchesCache } from "@/src/services/cache";
import { updateMatch } from "@/src/services/match";
import { MatchFormValues } from "@/src/types";
import { UpdateMatchBody } from "@/src/types/api/Match";
import { MeFaltaAlguienStackParamList } from "@/src/types/navigation/MeFaltaAlguienStack";
import {
  dateToString,
  parseStringToDate,
  parseStringToTime,
  timeToString,
} from "@/src/utils/common";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from "./EditarPartido.styles";

type EditarPartidoRouteProp = RouteProp<
  MeFaltaAlguienStackParamList,
  "EditarPartido"
>;
type NavigationProp = NativeStackNavigationProp<MeFaltaAlguienStackParamList>;

const EditarPartido: React.FC = () => {
  const route = useRoute<EditarPartidoRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { match } = route.params;
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { openErrorModal } = useContext(ModalContext);

  const initialValues: MatchFormValues = {
    name: match.location,
    description: match.description || "",
    date: parseStringToDate(match.date),
    time: parseStringToTime(match.time),
    duration: match.duration as 60 | 90 | 120,
    genderId: match.gender.id,
    categoryId: match.category.id,
    teams: match.teams || [],
  };

  const handleSubmit = async (values: MatchFormValues) => {
    const data: UpdateMatchBody = {
      location: values.name,
      description: values.description,
      date: dateToString(values.date!),
      time: timeToString(values.time!),
      duration: values.duration!,
      genderId: values.genderId!,
      categoryId: values.categoryId!,
      teams: {
        team1:
          values.teams
            .find((t) => t.teamNumber === 1)
            ?.players.map((p) => (p.id ? { id: p.id } : p)) || [],
        team2:
          values.teams
            .find((t) => t.teamNumber === 2)
            ?.players.map((p) => (p.id ? { id: p.id } : p)) || [],
      },
    };

    showLoading();
    const res = await updateMatch(match.id, data);
    hideLoading();

    if (res.error) {
      if (res.code === 4) {
        openErrorModal(
          "Editar partido",
          "El género de uno o más jugadores no coincide con el género del partido"
        );
      } else if (res.code === 16) {
        openErrorModal(
          "Editar partido",
          "No se puede repetir un jugador en el partido"
        );
      } else {
        openErrorModal(
          "Editar partido",
          "Hubo un error inesperado actualizando el partido"
        );
      }
    } else {
      removeLiveMatchesCache();
      navigation.navigate("MeFaltaAlguien");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
    >
      <MatchForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        blockKeyData
      />
    </ScrollView>
  );
};

export default EditarPartido;
