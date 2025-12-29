import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, PanResponder, View } from "react-native";
import { Match, MatchResult, Player } from "@/src/types";
import BaseModal from "./BaseModal";
import CustomTextInput from "../ui/CustomTextInput/CustomTextInput";
import CustomText from "../ui/CustomText/CustomText";
import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";
import TeamAvatars from "../TeamAvatars/TeamAvatars";
import {
  dateToString,
  parseDateStringToDDMMYYYY,
  timeToString,
} from "@/src/utils/common";
import { styles } from "./LoadResultModal.styles";
import FullButton from "../ui/FullButton/FullButton";
import {
  matchIsFriendly,
  matchResultIsValid,
  parseSets,
} from "@/src/utils/match";
import { ModalContext } from "@/src/contexts/ModalContext";
import SimpleButton from "../ui/SimpleButton/SimpleButton";
import BorderedButton from "../ui/BorderedButton/BorderedButton";
import {
  acceptMatchResult,
  createMatchWithResult,
  updateMatchResult,
} from "@/src/services/match";
import {
  removeGetPlayedMatchesCache,
  removeMyResultsCache,
} from "@/src/services/cache";
import CustomTimePicker from "../ui/CustomTimePicker/CustomTimePicker";
import CustomDatePicker from "../ui/CustomDatePicker/CustomDatePicker";
import CustomSelect from "../ui/CustomSelect/CustomSelect";
import useCategories from "@/src/hooks/useCategories";
import useGenders from "@/src/hooks/useGenders";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface LoadResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  match: Match | null;
  onSaveResult?: () => void;
  readOnly: boolean;
}

type SlotLayout = { x: number; y: number; width: number; height: number };

type TeamSlots = {
  team1: (Player | null)[];
  team2: (Player | null)[];
};

type DragOrigin =
  | { type: "pool"; index: number }
  | { type: "slot"; team: 1 | 2; index: number };

const LoadResultModal: React.FC<LoadResultModalProps> = ({
  isVisible,
  onClose,
  match,
  onSaveResult,
  readOnly,
}) => {
  const { openModal, openErrorModal } = useContext(ModalContext);
  const [location, setLocation] = useState<string>();
  const [date, setDate] = useState<Date | null>();
  const [time, setTime] = useState<Date | null>();

  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);
  const [isEditingTeams, setIsEditingTeams] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<(Player | null)[]>(
    []
  );
  const [editTeams, setEditTeams] = useState<TeamSlots>({
    team1: [null, null],
    team2: [null, null],
  });
  const [slotLayouts, setSlotLayouts] = useState<{
    team1: (SlotLayout | null)[];
    team2: (SlotLayout | null)[];
  }>({ team1: [null, null], team2: [null, null] });
  const slotRefs = useRef<{
    team1: React.RefObject<View | null>[];
    team2: React.RefObject<View | null>[];
  }>({
    team1: [React.createRef<View | null>(), React.createRef<View | null>()],
    team2: [React.createRef<View | null>(), React.createRef<View | null>()],
  });

  const { data: genders = [], loading: loadingGenders } = useGenders();
  const { data: allCategories = [], loading: loadingCats } = useCategories();
  const [categories, setCategories] = useState(allCategories);

  const filterCategories = (selectedGender: number) => {
    setCategories(allCategories.filter((c) => c.genderId === selectedGender));
  };

  const [gender, setGender] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);

  const [existingResult, setExistingResult] = useState<MatchResult | null>(
    null
  );
  const [formData, setFormData] = useState<MatchResult>({
    team1Set1: "",
    team1Set2: "",
    team1Set3: "",
    team2Set1: "",
    team2Set2: "",
    team2Set3: "",
  });

  const friendlyMatch = matchIsFriendly(match);

  // Actualizar el estado cuando match cambie
  useEffect(() => {
    const currentParsedSets = parseSets(match);
    if (currentParsedSets) {
      setExistingResult(currentParsedSets);
      setFormData({
        team1Set1: currentParsedSets.team1Set1 || "",
        team1Set2: currentParsedSets.team1Set2 || "",
        team1Set3: currentParsedSets.team1Set3 || "",
        team2Set1: currentParsedSets.team2Set1 || "",
        team2Set2: currentParsedSets.team2Set2 || "",
        team2Set3: currentParsedSets.team2Set3 || "",
      });
    } else {
      setExistingResult(null);
      setFormData({
        team1Set1: "",
        team1Set2: "",
        team1Set3: "",
        team2Set1: "",
        team2Set2: "",
        team2Set3: "",
      });
    }
  }, [match]);

  useEffect(() => {
    if (match) {
      const team1Players =
        match.teams.find((t) => t.teamNumber === 1)?.players || [];
      const team2Players =
        match.teams.find((t) => t.teamNumber === 2)?.players || [];
      setTeam1(team1Players);
      setTeam2(team2Players);
    } else {
      setTeam1([]);
      setTeam2([]);
    }
    setIsEditingTeams(false);
    setAvailablePlayers([]);
    setEditTeams({ team1: [null, null], team2: [null, null] });
  }, [match]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof MatchResult, value: string) => {
    // Solo permitir números del 0 al 9
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const startEditingTeams = () => {
    const players = [...team1, ...team2];
    setAvailablePlayers(players);
    setEditTeams({ team1: [null, null], team2: [null, null] });
    setIsEditingTeams(true);
  };

  const cancelEditingTeams = () => {
    setAvailablePlayers([]);
    setEditTeams({ team1: [null, null], team2: [null, null] });
    setIsEditingTeams(false);
  };

  const finishEditingTeams = () => {
    const hasEmptySlot =
      editTeams.team1.some((player) => !player) ||
      editTeams.team2.some((player) => !player);

    if (hasEmptySlot) {
      openErrorModal(
        "Cambiar equipos",
        "Completá los equipos antes de continuar."
      );
      return;
    }

    setTeam1(editTeams.team1.filter((p): p is Player => !!p));
    setTeam2(editTeams.team2.filter((p): p is Player => !!p));
    setIsEditingTeams(false);
  };

  const updateSlotLayout = (team: 1 | 2, index: number) => {
    const key = team === 1 ? "team1" : "team2";
    const ref = slotRefs.current[key][index];
    ref.current?.measureInWindow((x, y, width, height) => {
      setSlotLayouts((prev) => {
        const next = { ...prev, [key]: [...prev[key]] } as {
          team1: (SlotLayout | null)[];
          team2: (SlotLayout | null)[];
        };
        next[key][index] = { x, y, width, height };
        return next;
      });
    });
  };

  const findDropSlot = (x: number, y: number) => {
    const teams: Array<{ key: "team1" | "team2"; team: 1 | 2 }> = [
      { key: "team1", team: 1 },
      { key: "team2", team: 2 },
    ];

    for (const { key, team } of teams) {
      for (let index = 0; index < 2; index += 1) {
        const layout = slotLayouts[key][index];
        if (!layout) continue;
        const inside =
          x >= layout.x &&
          x <= layout.x + layout.width &&
          y >= layout.y &&
          y <= layout.y + layout.height;
        if (inside) {
          return { team, index };
        }
      }
    }
    return null;
  };

  const removePlayerFromTeams = (teams: TeamSlots, playerId: number) => ({
    team1: teams.team1.map((player) =>
      player?.id === playerId ? null : player
    ),
    team2: teams.team2.map((player) =>
      player?.id === playerId ? null : player
    ),
  });

  const handleDrop = (
    player: Player,
    origin: DragOrigin,
    dropX: number,
    dropY: number
  ) => {
    const target = findDropSlot(dropX, dropY);
    if (!target) return false;

    const targetKey = target.team === 1 ? "team1" : "team2";
    const targetPlayer = editTeams[targetKey][target.index];

    if (targetPlayer && targetPlayer.id !== player.id) {
      return false;
    }

    setEditTeams((prev) => {
      const cleared = removePlayerFromTeams(prev, player.id);
      const nextTeam = [...cleared[targetKey]];
      nextTeam[target.index] = player;
      return { ...cleared, [targetKey]: nextTeam };
    });

    if (origin.type === "pool") {
      setAvailablePlayers((prev) =>
        prev.map((item, index) => (index === origin.index ? null : item))
      );
    }
    return true;
  };

  const DraggableAvatar: React.FC<{
    player: Player;
    origin: DragOrigin;
  }> = ({ player, origin }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
      setHidden(false);
    }, [player.id]);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_event, gesture) => {
          pan.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_event, gesture) => {
          const dropped = handleDrop(
            player,
            origin,
            gesture.moveX,
            gesture.moveY
          );
          if (dropped) {
            setHidden(true);
            pan.setValue({ x: 0, y: 0 });
            return;
          }
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;

    return (
      <Animated.View
        style={[
          styles.draggableAvatar,
          { transform: pan.getTranslateTransform() },
          hidden ? styles.dragHidden : null,
        ]}
        {...panResponder.panHandlers}
      >
        <PlayerAvatar player={player} size="s" touchable={false} />
      </Animated.View>
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!match) {
        if (!location || !date || !time) {
          openErrorModal(
            "Cargar resultado",
            "Te faltan algunos datos para completar el partido"
          );
          return;
        }

        if (team1.length < 2 || team2.length < 2) {
          openErrorModal(
            "Cargar resultado",
            "Te faltan algunos jugadores para completar el partido"
          );
          return;
        }
      }

      if (!matchResultIsValid(formData)) {
        openErrorModal(
          "Cargar resultado",
          "El formato del resultado es incorrecto"
        );
        return;
      }

      if (!match) {
        const response = await createMatchWithResult(
          location!,
          dateToString(date!),
          timeToString(time!),
          gender!,
          category!,
          team1,
          team2,
          formData
        );
        if (response.error) throw Error(response.message);
      } else if (existingResult) {
        // TODO - si no modifico el resultado, aceptar tambien (pudo haber rechazado sin cambiar nada)
        // aceptar resultado
        const response = await acceptMatchResult(match!.id);
        if (response.error) throw Error(response.message);
      } else {
        const matchTeam1Players =
          match!.teams.find((t) => t.teamNumber === 1)?.players || [];
        const matchTeam2Players =
          match!.teams.find((t) => t.teamNumber === 2)?.players || [];
        const team1Changed =
          team1.length !== matchTeam1Players.length ||
          team1.some(
            (player, index) => player.id !== matchTeam1Players[index]?.id
          );
        const team2Changed =
          team2.length !== matchTeam2Players.length ||
          team2.some(
            (player, index) => player.id !== matchTeam2Players[index]?.id
          );
        const teamsChanged = team1Changed || team2Changed;

        const response = await updateMatchResult(
          match!.id,
          formData,
          teamsChanged ? team1.map((player) => player.id) : undefined,
          teamsChanged ? team2.map((player) => player.id) : undefined
        );
        if (response.error) throw Error(response.message);
      }

      removeMyResultsCache();
      removeGetPlayedMatchesCache();
      onSaveResult?.();
      openModal({
        title: existingResult ? "Resultado aceptado" : "Resultado cargado",
        message: matchIsFriendly(match, team1, team2)
          ? "El resultado fue cargado correctamente"
          : existingResult
          ? "El resultado fue aceptado. Próximamente se verá reflejado en tu ranking."
          : "El resultado fue cargado. Ahora hay que esperar a que el otro equipo lo acepte.",
      });
      onClose();
    } catch (error) {
      console.error("Error saving result:", error);
      openErrorModal(
        "Cargar resultado",
        "Hubo un error cargando el resultado. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styleIfWinner = (a: string | undefined, b: string | undefined) => {
    if (!a || !b) return null;
    return a > b ? styles.scoreInputContainerWinner : null;
  };

  const addPlayerToTeam = (player: Player, teamNumber: 1 | 2) => {
    if (teamNumber === 1) setTeam1((prev) => [...prev, player]);
    else setTeam2((prev) => [...prev, player]);
  };

  const removePlayerFromTeam = (player: Player, teamNumber: 1 | 2) => {
    if (teamNumber === 1)
      setTeam1((prev) => prev.filter((p) => p.id !== player.id));
    else setTeam2((prev) => prev.filter((p) => p.id !== player.id));
  };

  const rejectResult = () => {
    // TODO - si se rechaza pero no se cambia nada, tomar como que se acepto
    setExistingResult(null);
  };

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      title={
        friendlyMatch || readOnly
          ? "Resultado"
          : existingResult
          ? "Confirmar resultado"
          : "Cargar resultado"
      }
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Información del partido */}
        <View style={styles.section}>
          <CustomTextInput
            label="Lugar"
            placeholder="Ubicación del partido"
            value={match ? match?.location : location}
            onChangeText={setLocation}
            editable={!match}
            containerStyle={match && styles.disabledInput}
          />

          <View style={styles.row}>
            {match ? (
              <CustomTextInput
                label="Fecha"
                value={parseDateStringToDDMMYYYY(match.date) || undefined}
                editable={!match}
                containerStyle={[
                  match && styles.disabledInput,
                  styles.halfWidth,
                ]}
              />
            ) : (
              <CustomDatePicker
                label="Fecha"
                placeholder="Fecha"
                onChange={setDate}
                date={date || null}
                inputStyles={styles.halfWidth}
              />
            )}
            {match ? (
              <CustomTextInput
                label="Hora"
                value={match.time}
                editable={false}
                containerStyle={[styles.disabledInput, styles.halfWidth]}
              />
            ) : (
              <CustomTimePicker
                label="Hora"
                placeholder="Hora"
                onChange={setTime}
                time={time || null}
                inputStyles={styles.halfWidth}
              />
            )}
          </View>

          {!match && (
            <View style={styles.row}>
              <CustomSelect
                label="Género"
                data={genders}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.name}
                value={gender}
                onSelect={(v) => {
                  Keyboard.dismiss();
                  setGender(v);
                  filterCategories(v);
                }}
                placeholder={loadingGenders ? "Cargando..." : "Género"}
                inputStyles={styles.halfWidth}
              />
              <CustomSelect
                label="Categoría"
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.description}
                value={category}
                onSelect={(v) => {
                  Keyboard.dismiss();
                  setCategory(v);
                }}
                disabled={!gender}
                placeholder={loadingCats ? "Cargando..." : "Categoría"}
                inputStyles={styles.halfWidth}
              />
            </View>
          )}
        </View>

        {/* Jugadores */}
        <View style={styles.section}>
          <View style={styles.playersHeader}>
            <CustomText type="medium" style={styles.sectionTitle}>
              Jugadores
            </CustomText>
            {!readOnly && match && (
              <View style={styles.changeTeamsActions}>
                {isEditingTeams && (
                  <SimpleButton
                    title="Cancelar"
                    onPress={cancelEditingTeams}
                    size="s"
                  />
                )}
                <BorderedButton
                  size="s"
                  onPress={() => {
                    if (existingResult) return;
                    if (isEditingTeams) {
                      finishEditingTeams();
                    } else {
                      startEditingTeams();
                    }
                  }}
                  disabled={!!existingResult}
                  style={[
                    styles.changeTeamsButton,
                    existingResult ? styles.disabledButton : null,
                  ]}
                >
                  <CustomText
                    type="xsmall"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.changeTeamsButtonText}
                  >
                    {isEditingTeams ? "Listo" : "Cambiar equipos"}
                  </CustomText>
                </BorderedButton>
              </View>
            )}
          </View>
          {isEditingTeams && (
            <CustomText type="small" style={styles.changeTeamsHint}>
              Arrastrá los jugadores a los equipos.
            </CustomText>
          )}

          {isEditingTeams ? (
            <>
              <View style={styles.editPlayersRow}>
                <View style={styles.editPlayersGroup}>
                  {availablePlayers
                    .slice(0, 2)
                    .map((player, index) =>
                      player ? (
                        <DraggableAvatar
                          key={`pool-${player.id}`}
                          player={player}
                          origin={{ type: "pool", index }}
                        />
                      ) : (
                        <View
                          key={`pool-empty-${index}`}
                          style={styles.poolSlot}
                        />
                      )
                    )}
                </View>
                <View style={styles.editPlayersGroup}>
                  {availablePlayers
                    .slice(2, 4)
                    .map((player, index) =>
                      player ? (
                        <DraggableAvatar
                          key={`pool-${player.id}`}
                          player={player}
                          origin={{ type: "pool", index: index + 2 }}
                        />
                      ) : (
                        <View
                          key={`pool-empty-${index + 2}`}
                          style={styles.poolSlot}
                        />
                      )
                    )}
                </View>
              </View>
              <View style={styles.editTeamsContainer}>
                <View style={styles.teamColumn}>
                  <CustomText type="small" style={styles.teamLabel}>
                    Equipo 1
                  </CustomText>
                  <View style={styles.editSlotsRow}>
                    {[0, 1].map((index) => {
                      const slotPlayer = editTeams.team1[index];
                      return (
                        <View
                          key={`team1-slot-${index}`}
                          ref={slotRefs.current.team1[index]}
                          onLayout={() => updateSlotLayout(1, index)}
                          style={styles.slotCircle}
                        >
                          {slotPlayer ? (
                            <DraggableAvatar
                              player={slotPlayer}
                              origin={{ type: "slot", team: 1, index }}
                            />
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.teamColumn}>
                  <CustomText type="small" style={styles.teamLabel}>
                    Equipo 2
                  </CustomText>
                  <View style={styles.editSlotsRow}>
                    {[0, 1].map((index) => {
                      const slotPlayer = editTeams.team2[index];
                      return (
                        <View
                          key={`team2-slot-${index}`}
                          ref={slotRefs.current.team2[index]}
                          onLayout={() => updateSlotLayout(2, index)}
                          style={styles.slotCircle}
                        >
                          {slotPlayer ? (
                            <DraggableAvatar
                              player={slotPlayer}
                              origin={{ type: "slot", team: 2, index }}
                            />
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.teamsContainer}>
              <View style={styles.teamColumn}>
                <CustomText type="small" style={styles.teamLabel}>
                  Equipo 1
                </CustomText>
                <TeamAvatars
                  players={team1}
                  match={match || undefined}
                  team={1}
                  isCreator={!match}
                  callback={async (p: Player) => addPlayerToTeam(p, 1)}
                  canDelete
                  removeCallback={async (p: Player) =>
                    removePlayerFromTeam(p, 1)
                  }
                />
              </View>

              <View style={styles.teamColumn}>
                <CustomText type="small" style={styles.teamLabel}>
                  Equipo 2
                </CustomText>
                <TeamAvatars
                  players={team2}
                  match={match || undefined}
                  team={2}
                  isCreator={!match}
                  callback={async (p: Player) => addPlayerToTeam(p, 2)}
                  canDelete
                  removeCallback={async (p: Player) =>
                    removePlayerFromTeam(p, 2)
                  }
                />
              </View>
            </View>
          )}

          {/* Resultados */}
          <View style={styles.resultsContainer}>
            <View style={styles.setRow}>
              <CustomText type="medium" style={styles.setLabel}>
                Set 1
              </CustomText>
              <View style={styles.scoreInputsRow}>
                <CustomTextInput
                  value={formData.team1Set1}
                  onChangeText={(value) =>
                    handleInputChange("team1Set1", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team1Set1, formData.team2Set1),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
                <CustomTextInput
                  value={formData.team2Set1}
                  onChangeText={(value) =>
                    handleInputChange("team2Set1", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team2Set1, formData.team1Set1),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
              </View>
            </View>

            <View style={styles.setRow}>
              <CustomText type="medium" style={styles.setLabel}>
                Set 2
              </CustomText>
              <View style={styles.scoreInputsRow}>
                <CustomTextInput
                  value={formData.team1Set2}
                  onChangeText={(value) =>
                    handleInputChange("team1Set2", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team1Set2, formData.team2Set2),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
                <CustomTextInput
                  value={formData.team2Set2}
                  onChangeText={(value) =>
                    handleInputChange("team2Set2", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team2Set2, formData.team1Set2),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
              </View>
            </View>

            <View style={styles.setRow}>
              <CustomText type="medium" style={styles.setLabel}>
                Set 3
              </CustomText>
              <View style={styles.scoreInputsRow}>
                <CustomTextInput
                  value={formData.team1Set3}
                  onChangeText={(value) =>
                    handleInputChange("team1Set3", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team1Set3, formData.team2Set3),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
                <CustomTextInput
                  value={formData.team2Set3}
                  onChangeText={(value) =>
                    handleInputChange("team2Set3", value)
                  }
                  containerStyle={[
                    styles.scoreInputContainer,
                    styleIfWinner(formData.team2Set3, formData.team1Set3),
                  ]}
                  style={styles.scoreInput}
                  keyboardType="numeric"
                  maxLength={2}
                  disabled={!!existingResult}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Botón de guardar */}
        {!readOnly && (
          <>
            <FullButton onPress={handleSave} size="xl" disabled={isLoading}>
              <CustomText.ButtonText type="medium">
                {isLoading ? "Guardando..." : "Confirmar resultado"}
              </CustomText.ButtonText>
            </FullButton>
            {existingResult && (
              <View style={styles.rejectButton}>
                <SimpleButton
                  title="Rechazar resultado"
                  onPress={rejectResult}
                />
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
    </BaseModal>
  );
};

export default LoadResultModal;
