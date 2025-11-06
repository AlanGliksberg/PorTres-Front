import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { styles } from "./MyMatches.style";
import {
  AppStackParamList,
  Match,
  MeFaltaAlguienStackParamList,
} from "@/src/types";
import MatchesList from "../MatchesList/MatchesList";
import type { MatchesListRef } from "../MatchesList/MatchesList";
import CustomText from "../ui/CustomText/CustomText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/src/theme";
import { getMyMatches } from "@/src/services/match";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import SimpleButton from "../ui/SimpleButton/SimpleButton";
import { removeLiveMatchesCache } from "@/src/services/cache";

const MyMatches: React.FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation =
    useNavigation<
      NavigationProp<AppStackParamList & MeFaltaAlguienStackParamList>
    >();
  const matchesListRef = useRef<MatchesListRef | null>(null);

  let loadMatches = async (
    nextPage: number,
    pageSize: number
  ): Promise<[Match[], number] | void> => {
    try {
      setError(false);
      const res = await getMyMatches(nextPage, pageSize);
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
          ¡No tenés partidos!
        </CustomText>
        <CustomText type="medium" style={styles.emptySubtitle}>
          Te invitamos a unirte a los partidos disponibles
        </CustomText>
        <SimpleButton
          title="Buscá partidos"
          size="m"
          onPress={() => navigation.navigate("QuieroJugar")}
          textStyle={styles.search}
        />
      </View>
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
          error={error}
          EmptyComponent={Empty}
          viewMore
          showDetails
          refreshData={async () => {
            removeLiveMatchesCache();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default MyMatches;
