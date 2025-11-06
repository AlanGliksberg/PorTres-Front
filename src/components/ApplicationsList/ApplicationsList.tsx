import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Match } from "@/src/types";
import { getAppliedMatches } from "@/src/services/match";
import {
  CustomText,
  MatchesList,
  SimpleButton,
} from "@/src/components";
import type { MatchesListRef } from "@/src/components";
import { removeLiveMatchesCache } from "@/src/services/cache";
import { styles } from "./ApplicationsList.styles";

interface ApplicationsListProps {
  goToMatches: () => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ goToMatches }) => {
  const [error, setError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const matchesListRef = useRef<MatchesListRef | null>(null);

  const loadMatches = async (
    nextPage: number = 1,
    pageSize: number
  ): Promise<[Match[], number] | void> => {
    try {
      setError(false);
      const res = await getAppliedMatches(nextPage, pageSize);
      if (res.error || !res.data) throw new Error("Error al cargar partidos");
      const { matches: newMatches, totalMatches } = res.data;
      return [newMatches, totalMatches];
    } catch (e: any) {
      console.log(e);
      setError(true);
      return;
    }
  };

  const EmptyState = (
    <View style={styles.emptyContainer}>
      <CustomText type="h4" bold style={styles.emptyTitle}>
        No tenés postulaciones por ahora
      </CustomText>
      <CustomText type="medium" style={styles.emptySubtitle}>
        Para postularte buscá un partido disponible y dejale tu solicitud al
        creador del partido
      </CustomText>
      <SimpleButton title="Ver partidos disponibles" onPress={goToMatches} />
    </View>
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await matchesListRef.current?.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.matchesScroll}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <MatchesList
          ref={matchesListRef}
          loadMatches={loadMatches}
          refreshData={async () => {
            removeLiveMatchesCache();
          }}
          error={error}
          EmptyComponent={EmptyState}
          viewMore
          showDetails
        />
      </ScrollView>
    </View>
  );
};

export default ApplicationsList;
