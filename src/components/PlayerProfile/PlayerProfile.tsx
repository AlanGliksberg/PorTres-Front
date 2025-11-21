import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RefreshControl, ScrollView } from "react-native";
import { getCurrentPlayer } from "@/src/services/player";
import { Player } from "@/src/types/player/Player";
import { styles } from "./PlayerProfile.styles";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import type { MatchesListRef } from "../MatchesList/MatchesList";
import type { TabType } from "./ProfileTabs";

interface PlayerProfileProps {
  playerId: number;
}

export default function PlayerProfile({ playerId }: PlayerProfileProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const { hideLoading, showLoading, loading } = useContext(LoadingContext);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const matchHistoryRef = useRef<MatchesListRef | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const loadPlayerData = useCallback(async () => {
    try {
      showLoading();
      setError(null);
      const playerResponse = await getCurrentPlayer(false);
      if (playerResponse.error || !playerResponse.data) {
        setError("Error al cargar los datos del jugador");
        return;
      }
      const foundPlayer = playerResponse.data.player;
      setPlayer(foundPlayer);
    } catch (err) {
      setError("Error al cargar los datos del jugador");
      console.error("Error loading player data:", err);
    } finally {
      hideLoading();
    }
  }, []);

  useEffect(() => {
    loadPlayerData();
  }, [loadPlayerData, playerId]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (activeTab === "historial") {
        await matchHistoryRef.current?.refresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [activeTab]);

  // TODO - mejorar manejo de error y agregar loading
  // considerar poder cerrar sesion si hay un error
  if (loading) {
    return <></>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <ProfileHeader player={player} onPhotoUpdated={loadPlayerData} />
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        player={player}
        handleRefresh={handleRefresh}
        matchHistoryRef={matchHistoryRef}
      />
    </ScrollView>
  );
}
