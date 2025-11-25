import React, { useContext, useRef, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Keyboard,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import useCategories from "@/src/hooks/useCategories";
import useGenders from "@/src/hooks/useGenders";
import { matchSchema } from "@/src/schemas/matchSchema";
import { MatchFormValues, Player } from "@/src/types";
import { matchFormDefaultValues } from "@/src/types/forms/MatchForm";
import { CreateTeam } from "@/src/types/player/Team";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomDatePicker from "../ui/CustomDatePicker/CustomDatePicker";
import CustomSelect from "../ui/CustomSelect/CustomSelect";
import CustomText from "../ui/CustomText/CustomText";
import CustomTextInput from "../ui/CustomTextInput/CustomTextInput";
import CustomTimePicker from "../ui/CustomTimePicker/CustomTimePicker";
import FullButton from "../ui/FullButton/FullButton";
import CourtDistribution from "./CourtDistribution";
import ClubPicker from "./ClubPicker";
import { styles } from "./MatchForm.styles";
import { ModalContext } from "@/src/contexts/ModalContext";
import { DURATIONS } from "@/src/constants/match";

export type MatchFormProps = {
  initialValues?: MatchFormValues;
  onSubmit: (values: MatchFormValues) => void;
  blockKeyData?: boolean;
};

const MatchForm: React.FC<MatchFormProps> = ({
  initialValues,
  onSubmit,
  blockKeyData,
}) => {
  const { openErrorModal } = useContext(ModalContext);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<MatchFormValues>({
    defaultValues: initialValues || matchFormDefaultValues,
    resolver: yupResolver(matchSchema) as Resolver<MatchFormValues>,
  });

  const { data: genders = [], loading: loadingGenders } = useGenders();
  const { data: allCategories = [], loading: loadingCats } = useCategories();

  const manualLocationCache = useRef(initialValues?.name || "");
  const isEditingWithoutClub =
    blockKeyData && initialValues?.clubId == null ? true : false;
  const [manualLocation, setManualLocation] =
    useState<boolean>(isEditingWithoutClub);

  const selectedGender = watch("genderId");
  const selectedClubId = watch("clubId");
  const hasSelectedClub =
    selectedClubId !== null && selectedClubId !== undefined;

  const shouldShowClubPicker = !blockKeyData && !manualLocation;
  const shouldShowLocationInput =
    manualLocation || (blockKeyData && !hasSelectedClub);
  const clubPickerError = !manualLocation
    ? errors.name?.message || errors.clubId?.message
    : errors.clubId?.message;

  const handleEnableManualLocation = () => {
    setManualLocation(true);
    setValue("name", manualLocationCache.current || "");
    setValue("clubId", null);
  };

  const handleReturnToClubSelection = () => {
    manualLocationCache.current = getValues("name");
    setManualLocation(false);
    setValue("name", "");
  };
  const categories = allCategories.filter((c) => c.genderId === selectedGender);

  const getNewTeams = (
    teams: CreateTeam[] = [],
    player: Player,
    teamNumber: 1 | 2,
    playerIndex: number
  ) => {
    const updatedTeams = [...teams];
    let team = updatedTeams.find((t) => t.teamNumber === teamNumber);
    if (!team) {
      team = {
        teamNumber: teamNumber,
        players: [],
      };
      updatedTeams.push(team);
    }

    team.players.push(player);
    return updatedTeams;
  };

  const getNewTeamsWithoutPlayer = (
    teams: CreateTeam[] = [],
    player: Player,
    teamNumber: 1 | 2
  ) => {
    const updatedTeams = [...teams];
    let team = updatedTeams.find((t) => t.teamNumber === teamNumber)!;
    team.players = team.players.filter((p) =>
      player.id
        ? p.id !== player.id
        : p.firstName + p.lastName !== player.firstName + player.lastName
    );
    return updatedTeams;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.form}>
        <View style={styles.card}>
          <CustomText.Title>Detalles</CustomText.Title>

          {/* Club */}
          {shouldShowClubPicker && (
            <Controller
              control={control}
              name="clubId"
              render={({ field: { onChange, value } }) => (
                <ClubPicker
                  value={value}
                  onChange={onChange}
                  error={clubPickerError}
                  mandatory={!manualLocation}
                  onSwitchToManual={handleEnableManualLocation}
                />
              )}
            />
          )}

          {/* Ubicación */}
          {shouldShowLocationInput && (
            <>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Ubicación"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nombre o dirección"
                    error={errors.name?.message}
                    mandatory
                    disabled={blockKeyData}
                  />
                )}
              />
              {!blockKeyData && manualLocation && (
                <TouchableOpacity
                  style={styles.manualToggleButton}
                  onPress={handleReturnToClubSelection}
                >
                  <CustomText type="small" style={styles.manualToggleText}>
                    Quiero elegir un club
                  </CustomText>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Descripción */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <CustomTextInput
                label="Descripción"
                value={value}
                onChangeText={onChange}
                placeholder="Dirección o detalles"
                error={errors.description?.message}
              />
            )}
          />

          {/* Fecha */}
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <CustomDatePicker
                label="Fecha"
                onChange={onChange}
                date={value}
                minimumDate={new Date()}
                mandatory
                placeholder="Fecha del partido"
                error={errors.date?.message}
                disabled={blockKeyData}
              />
            )}
          />

          {/* Hora */}
          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value } }) => (
              <CustomTimePicker
                label="Hora"
                onChange={onChange}
                time={value}
                mandatory
                placeholder="Hora del partido"
                error={errors.time?.message}
                disabled={blockKeyData}
              />
            )}
          />

          {/* Duración */}
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                label="Duración"
                data={DURATIONS}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.name}
                value={value}
                onSelect={(v) => {
                  Keyboard.dismiss();
                  onChange(v);
                }}
                error={errors.duration?.message}
                mandatory
                placeholder="Duración del partido"
              />
            )}
          />

          {/* Género */}
          <Controller
            control={control}
            name="genderId"
            rules={{ required: "El género es obligatorio" }}
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                label="Género"
                data={genders}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.name}
                value={value}
                onSelect={(v) => {
                  Keyboard.dismiss();
                  onChange(v);
                }}
                placeholder={
                  loadingGenders ? "Cargando..." : "Género del partido"
                }
                error={errors.genderId?.message}
                mandatory
              />
            )}
          />

          {/* Categoría */}
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: "La categoría es obligatoria" }}
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                label="Categoría"
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.description}
                value={value}
                onSelect={(v) => {
                  Keyboard.dismiss();
                  onChange(v);
                }}
                disabled={!selectedGender}
                placeholder={
                  !selectedGender
                    ? "Primero elegí el género"
                    : loadingCats
                    ? "Cargando..."
                    : "Categoría del partido"
                }
                error={errors.categoryId?.message}
                mandatory
              />
            )}
          />

          {/* Jugadores */}
          <View style={styles.teamsContainer}>
            <Controller
              control={control}
              name="teams"
              render={({ field: { onChange, value } }) => (
                <CourtDistribution
                  teams={value}
                  onPlayerAdd={(player, teamNumber, playerIndex) => {
                    if (
                      value.some((t) =>
                        t.players.some((p) => p.id && p.id === player.id)
                      )
                    ) {
                      openErrorModal(
                        "¡Atención!",
                        "El jugador seleccionado ya fue agregado al partido"
                      );
                      return;
                    }
                    const teams = getNewTeams(
                      value,
                      player,
                      teamNumber,
                      playerIndex
                    );
                    onChange(teams);
                  }}
                  onPlayerRemove={(player, teamNumber) => {
                    const teams = getNewTeamsWithoutPlayer(
                      value,
                      player,
                      teamNumber
                    );
                    onChange(teams);
                  }}
                />
              )}
            />
          </View>
        </View>

        {/* Botón de guardar */}
        <FullButton onPress={handleSubmit(onSubmit)} style={styles.button}>
          <CustomText.ButtonText type="medium">
            Guardar partido
          </CustomText.ButtonText>
        </FullButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MatchForm;
