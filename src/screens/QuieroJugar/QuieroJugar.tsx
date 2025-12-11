import React, { useState } from "react";
import {
  ApplicationsList,
  AvailableMatchesList,
  CustomScreen,
  TabSelector,
} from "@/src/components";
import { QUIERO_JUGAR_PAGE_NAME } from "@/src/constants/pages";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "@/src/types";

export default function QuieroJugar() {
  const route = useRoute<RouteProp<AppStackParamList, "QuieroJugar">>();
  const deepLinkMatchId = route.params?.matchId ?? null;
  const [key, setKey] = useState(1);

  const tabs = [
    {
      id: "partidos",
      label: "Partidos",
      component: <AvailableMatchesList deepLinkMatchId={deepLinkMatchId} />,
    },
    {
      id: "postulaciones",
      label: "Mis postulaciones",
      component: (
        <ApplicationsList goToMatches={() => setKey((prev) => prev + 1)} />
      ),
    },
  ];
  return (
    <CustomScreen title={QUIERO_JUGAR_PAGE_NAME}>
      <TabSelector tabs={tabs} key={key} />
    </CustomScreen>
  );
}
