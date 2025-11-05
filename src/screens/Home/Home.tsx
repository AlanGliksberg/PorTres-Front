import React from "react";
import {
  CustomScreen,
  TabSelector,
  ContactInfo,
  MyMatches,
  MyResults,
} from "@/src/components";
import { HOME_PAGE_NAME } from "@/src/constants/pages";
import { View } from "react-native";
import { styles } from "./Home.styles";

const tabs = [
  { id: "partidos", label: "Mis partidos", component: <MyMatches /> },
  { id: "resultados", label: "Resultados", component: <MyResults /> },
];

export default function Home() {
  return (
    <CustomScreen title={HOME_PAGE_NAME}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <TabSelector tabs={tabs} />
        </View>
        <View style={styles.bottomSection}>
          <ContactInfo />
        </View>
      </View>
    </CustomScreen>
  );
}
