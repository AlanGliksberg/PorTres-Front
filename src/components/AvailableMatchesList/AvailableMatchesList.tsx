import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { styles } from "./AvailableMatchesList.styles";
import MatchesFilters from "./MatchesFilters";
import { Match, MatchFilters } from "@/src/types";
import MatchesList from "../MatchesList/MatchesList";
import type { MatchesListRef } from "../MatchesList/MatchesList";
import CustomText from "../ui/CustomText/CustomText";
import { getMatchesWithFilters } from "@/src/services/match";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/src/theme";

const AvailableMatchesList: React.FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>({
    description: null,
    dateFrom: null,
    dateTo: null,
    timeFrom: null,
    timeTo: null,
    gender: null,
    category: null,
    duration: null,
  });
  const matchesListRef = useRef<MatchesListRef | null>(null);

  let loadMatches = async (
    nextPage: number,
    pageSize: number
  ): Promise<[Match[], number] | void> => {
    try {
      setError(false);
      const res = await getMatchesWithFilters(
        nextPage,
        pageSize,
        filters,
        false
      );
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
    <View style={styles.emptyContainer}>
      <Ionicons name="tennisball-outline" size={100} color={colors.secondary} />
      <View style={styles.textContainer}>
        <CustomText type="h4" bold style={styles.emptyTitle}>
          No se encontraron partidos con los filtros seleccionados
        </CustomText>
        <CustomText type="medium" style={styles.emptySubtitle}>
          Ajustá los filtros para encontrar partidos que te interesen
        </CustomText>
      </View>
    </View>
  );

  const handleFiltersChange = (filters: MatchFilters) => {
    setFilters(filters);
  };

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
      <View style={styles.filtersCard}>
        <MatchesFilters onFiltersChange={handleFiltersChange} />
      </View>

      <ScrollView
        style={styles.matchesScroll}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <MatchesList
          ref={matchesListRef}
          key={JSON.stringify(filters)}
          loadMatches={loadMatches}
          error={error}
          EmptyComponent={Empty}
          viewMore
          allowApplications
        />
      </ScrollView>
    </View>
  );
};

export default AvailableMatchesList;
