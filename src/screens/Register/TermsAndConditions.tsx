import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomText } from "@/src/components";
import { AuthStackParamList } from "@/src/types";
import { colors } from "@/src/theme";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./TermsAndConditions.styles";

const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={18} color={colors.primary} />
        <CustomText type="small" style={styles.backText}>
          Volver
        </CustomText>
      </TouchableOpacity>

      <CustomText.Title style={styles.title}>
        Términos y Condiciones
      </CustomText.Title>

      <ScrollView contentContainerStyle={styles.content}>
        <CustomText type="body" style={styles.paragraph}>
          Estos Términos y Condiciones describen las reglas ficticias del
          servicio. Al utilizar la aplicación aceptás cumplir con cada uno de
          los puntos enumerados a continuación.
        </CustomText>
        <CustomText type="body" style={styles.paragraph}>
          1. Uso responsable: debés utilizar la plataforma con fines recreativos
          y respetar al resto de la comunidad. Cualquier conducta inapropiada
          dará lugar a acciones correctivas.
        </CustomText>
        <CustomText type="body" style={styles.paragraph}>
          2. Gestión de partidos: la organización y participación en partidos
          se rige por la disponibilidad de horarios y canchas, pudiendo la
          aplicación modificar o cancelar encuentros en caso de fuerza mayor.
        </CustomText>
        <CustomText type="body" style={styles.paragraph}>
          3. Protección de datos: toda la información proporcionada será tratada
          con fines operativos internos. La versión final de este documento
          detallará los mecanismos reales de protección de datos.
        </CustomText>
        <CustomText type="body" style={styles.paragraph}>
          4. Actualizaciones: estas condiciones pueden cambiar con actualizaciones
          futuras. Te notificaremos dentro de la app para que te mantengas al
          día con los ajustes.
        </CustomText>
        <CustomText type="body" style={styles.paragraph}>
          Este contenido es ficticio y será reemplazado por la versión definitiva
          antes del lanzamiento.
        </CustomText>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;
