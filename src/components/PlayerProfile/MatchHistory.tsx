import React, { RefObject, useRef, useState } from "react";
import { View } from "react-native";
import CustomText from "@/src/components/ui/CustomText/CustomText";
import { Match } from "@/src/types/match/Match";
import { styles } from "./PlayerProfile.styles";
import MatchesList from "../MatchesList/MatchesList";
import { getPlayedMatches } from "@/src/services/match";
import type { MatchesListRef } from "../MatchesList/MatchesList";
import { removeGetPlayedMatchesCache } from "@/src/services/cache";

interface MatchHistoryProps {
  historyRef?: RefObject<MatchesListRef | null>;
}

export default function MatchHistory({ historyRef }: MatchHistoryProps) {
  const [error, setError] = useState<boolean>(false);
  const fallbackRef = useRef<MatchesListRef | null>(null);
  const matchesListRef = historyRef ?? fallbackRef;

  const loadMatches = async (
    nextPage: number,
    pageSize: number
  ): Promise<[Match[], number] | void> => {
    try {
      setError(false);
      const res = await getPlayedMatches(nextPage, pageSize);
      if (res.error || !res.data) throw new Error("Error al cargar partidos");
      const { matches: newMatches, totalMatches } = res.data;
      return [newMatches, totalMatches];
    } catch (e: any) {
      console.log(e);
      setError(true);
      return;
    }
  };

  const Empty = (
    <View style={styles.emptyState}>
      <CustomText style={styles.emptyStateText} type="body">
        No tenés partidos registrados aún
      </CustomText>
      <CustomText
        style={[styles.emptyStateText, styles.emptyStateSubtext]}
        type="medium"
      >
        Cuando juegues partidos aparecerán aquí
      </CustomText>
    </View>
  );

  return (
    <View style={styles.tabContent}>
      <View style={styles.historySection}>
        <CustomText style={styles.sectionTitle}>
          Historial de Partidos
        </CustomText>
        <MatchesList
          loadMatches={loadMatches}
          error={error}
          ref={matchesListRef}
          EmptyComponent={Empty}
          viewMore
          historyDetails
          allowResults
          refreshData={async () => removeGetPlayedMatchesCache()}
        />
      </View>
    </View>
  );
}
