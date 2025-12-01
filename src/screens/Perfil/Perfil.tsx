import { PlayerProfile } from "@/src/components";
import CustomScreen from "@/src/components/ui/CustomScreen/CustomScreen";
import { PERFIL_PAGE_NAME } from "@/src/constants/pages";
import { AuthContext } from "@/src/contexts/AuthContext";
import React, { useContext } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "@/src/types/navigation/AppStack";
import { navigationRef } from "@/src/navigation/navigationRef";

export default function Perfil() {
  const { user } = useContext(AuthContext);
  const route = useRoute<RouteProp<AppStackParamList, "MiPerfil">>();
  const requestedPlayerId = route.params?.playerId;
  const showOtherProfile =
    requestedPlayerId !== undefined && requestedPlayerId !== user?.playerId;
  const playerId = showOtherProfile ? requestedPlayerId : user!.playerId!;
  const readOnly = showOtherProfile ? route.params?.readOnly ?? true : false;
  const returnToTab = route.params?.returnToTab;
  const returnToParams = route.params?.returnToParams;

  const handleBack = () => {
    if (!navigationRef.isReady()) return;
    if (readOnly && returnToTab) {
      (navigationRef as any).navigate(
        returnToTab,
        returnToParams ??
          (returnToTab === "MeFaltaAlguienStack"
            ? { screen: "MeFaltaAlguien" }
            : undefined)
      );
      return;
    }
    if (navigationRef.canGoBack()) navigationRef.goBack();
  };

  return (
    <CustomScreen
      title={PERFIL_PAGE_NAME}
      showBack={readOnly}
      onBack={readOnly ? handleBack : undefined}
    >
      <PlayerProfile playerId={playerId} readOnly={readOnly} />
    </CustomScreen>
  );
}
