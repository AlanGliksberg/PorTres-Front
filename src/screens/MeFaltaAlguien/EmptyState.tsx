import { CustomText, FullButton } from "@/src/components";
import { colors } from "@/src/theme";
import { AppStackParamList, MeFaltaAlguienStackParamList } from "@/src/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./MeFaltaAlguien.styles";

const EmptyState: React.FC = () => {
  const navigation =
    useNavigation<
      NavigationProp<AppStackParamList & MeFaltaAlguienStackParamList>
    >();

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="tennis-ball"
        size={100}
        color={colors.secondary}
      />
      <CustomText.Title style={styles.emptyTitle}>
        ¡Jugá tu próximo partido!
      </CustomText.Title>
      <CustomText style={styles.emptySubtitle} bold>
        Informanos los detalles de tu partido y nosotros nos encargamos de toda
        la organización.
      </CustomText>
      <CustomText style={styles.emptyDescription}>
        Te conseguimos a los jugadores para que solo te preocupes por disfrutar.
      </CustomText>
      <FullButton
        style={styles.emptyPrimaryButton}
        size="l"
        onPress={() => navigation.navigate("CrearPartido")}
      >
        <CustomText.ButtonText uppercase>Creá tu partido</CustomText.ButtonText>
      </FullButton>
      <TouchableOpacity onPress={() => navigation.navigate("QuieroJugar")}>
        <CustomText.ButtonText
          type="small"
          uppercase
          style={styles.emptySecondaryLink}
        >
          Buscá partidos
        </CustomText.ButtonText>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;
