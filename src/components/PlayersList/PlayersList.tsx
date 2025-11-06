import { getPlayers } from "@/src/services/player";
import { colors } from "@/src/theme";
import { Player } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import CustomSearchInput from "../ui/CustomSearchInput/CustomSearchInput";
import CustomText from "../ui/CustomText/CustomText";
import ErrorSection from "../ui/ErrorSection/ErrorSection";
import EmptyState from "./EmptyState";
import FiltersModal from "./FiltersModal";
import { styles } from "./PlayersList.styles";
import PlayerItem from "./PlayerItem";
import SimpleButton from "../ui/SimpleButton/SimpleButton";

const PAGE_SIZE = 10;

interface PlayersListProps {
  onPlayerSelect?: (p: Player) => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ onPlayerSelect }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const [appliedGenders, setAppliedGenders] = useState<string[]>([]);
  const [appliedPositions, setAppliedPositions] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);

  const [tempGenders, setTempGenders] = useState<string[]>([]);
  const [tempPositions, setTempPositions] = useState<string[]>([]);
  const [tempCategories, setTempCategories] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const hasActiveFilters =
    appliedGenders.length > 0 ||
    appliedPositions.length > 0 ||
    appliedCategories.length > 0;

  const toggle = (
    val: string,
    arr: string[],
    setter: (v: string[]) => void
  ) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const resetFilters = () => {
    setTempGenders([]);
    setTempPositions([]);
    setTempCategories([]);
  };

  const loadPlayers = useCallback(
    async (pageToLoad: number, append: boolean) => {
      if (pageToLoad === 1) {
        setLoading(true);
        setError(false);
      } else {
        setLoadingMore(true);
      }

      try {
        const resultPlayers = await getPlayers({
          name: playerName,
          gender: appliedGenders,
          position: appliedPositions,
          category: appliedCategories,
          page: pageToLoad,
          pageSize: PAGE_SIZE,
        });

        if (resultPlayers.error || !resultPlayers.data)
          throw new Error("Error buscando jugadores");

        const fetchedPlayers = resultPlayers.data.players || [];
        setPlayers((prevPlayers) =>
          append ? [...prevPlayers, ...fetchedPlayers] : fetchedPlayers
        );
        setHasMore(fetchedPlayers.length === PAGE_SIZE);
        setPage(pageToLoad);
      } catch (e) {
        console.log("Error:", e);
        if (pageToLoad === 1) {
          setError(true);
          setPlayers([]);
        }
      } finally {
        if (pageToLoad === 1) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [appliedCategories, appliedGenders, appliedPositions, playerName]
  );

  const searchPlayers = useCallback(() => {
    loadPlayers(1, false);
  }, [loadPlayers]);

  const loadMorePlayers = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    loadPlayers(page + 1, true);
  }, [hasMore, loadPlayers, loading, loadingMore, page]);

  useEffect(() => {
    searchPlayers();
  }, [searchPlayers]);

  const clearSearch = () => {
    setPlayerName("");
    setPlayers([]);
    setHasMore(false);
    setPage(1);
  };

  const openFilters = () => {
    setTempGenders(appliedGenders);
    setTempPositions(appliedPositions);
    setTempCategories(appliedCategories);
    setModalVisible(true);
  };

  const applyFilters = () => {
    setAppliedGenders(tempGenders);
    setAppliedPositions(tempPositions);
    setAppliedCategories(tempCategories);
    setModalVisible(false);
  };

  return (
    <View style={styles.searchContainer}>
      <CustomSearchInput
        placeholder="Buscá un jugador por nombre"
        startSearchingOn={3}
        onSearch={setPlayerName}
        onClear={clearSearch}
      />
      <TouchableOpacity
        style={styles.filtersButton}
        onPress={openFilters}
        activeOpacity={0.7}
      >
        <View style={styles.filterIconContainer}>
          <MaterialIcons name="filter-list" size={20} color={colors.primary} />
          {hasActiveFilters && <View style={styles.activeFilterBadge} />}
        </View>
        <CustomText style={styles.filtersButtonText}>Filtros</CustomText>
      </TouchableOpacity>
      <FiltersModal
        visible={modalVisible}
        selectedGenders={tempGenders}
        selectedPositions={tempPositions}
        selectedCategories={tempCategories}
        onToggleGender={(g) => toggle(g, tempGenders, setTempGenders)}
        onTogglePosition={(p) => toggle(p, tempPositions, setTempPositions)}
        onToggleCategory={(c) => toggle(c, tempCategories, setTempCategories)}
        onApply={applyFilters}
        onCancel={() => setModalVisible(false)}
        resetFilters={resetFilters}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {error && (
            <ErrorSection
              message="Error buscando jugadores"
              onRetry={searchPlayers}
            />
          )}
          {!error && (
            <FlatList
              data={players}
              keyExtractor={(p) => p.id.toString()}
              style={styles.list}
              keyboardShouldPersistTaps="never"
              renderItem={({ item }) => (
                <PlayerItem player={item} onPlayerSelect={onPlayerSelect} />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => <EmptyState />}
              ListFooterComponent={() =>
                loadingMore ? (
                  <View style={styles.footer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : hasMore ? (
                  <View style={styles.footer}>
                    <SimpleButton
                      title="Ver más"
                      onPress={loadMorePlayers}
                    />
                  </View>
                ) : null
              }
            />
          )}
        </>
      )}
    </View>
  );
};

export default PlayersList;
