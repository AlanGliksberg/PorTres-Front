import React, { useContext } from "react";
import {
  CustomScreen,
  TabSelector,
  ContactInfo,
  MyMatches,
  MyResults,
  CustomText,
  FullButton,
} from "@/src/components";
import { HOME_PAGE_NAME } from "@/src/constants/pages";
import { View } from "react-native";
import { styles } from "./Home.styles";
import { PlayerModalsContext } from "@/src/contexts/PlayerModalsContext";

const tabs = [
  { id: "partidos", label: "Mis partidos", component: <MyMatches /> },
  { id: "resultados", label: "Resultados", component: <MyResults /> },
];

export default function Home() {
  const { openLoadResultModal } = useContext(PlayerModalsContext);

  return (
    <CustomScreen title={HOME_PAGE_NAME}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <TabSelector tabs={tabs} />
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.loadResultSection}>
            <View style={styles.separator} />
            <CustomText bold>Cargá un resultado de otro partido:</CustomText>
            <FullButton
              onPress={() => openLoadResultModal(null, false)}
              size="l"
              style={styles.createResultButton}
            >
              <CustomText.ButtonText uppercase type="small">
                Cargar resultado
              </CustomText.ButtonText>
            </FullButton>
          </View>
          <ContactInfo />
        </View>
      </View>
    </CustomScreen>
  );
}
