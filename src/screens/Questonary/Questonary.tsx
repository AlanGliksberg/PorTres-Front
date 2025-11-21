import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomSelect from "@/src/components/ui/CustomSelect/CustomSelect";
import CustomText from "@/src/components/ui/CustomText/CustomText";
import FullButton from "@/src/components/ui/FullButton/FullButton";

import { CustomRadioInput, ToggleGroup } from "@/src/components";
import { AuthContext } from "@/src/contexts/AuthContext";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import { ModalContext } from "@/src/contexts/ModalContext";
import useCategories from "@/src/hooks/useCategories";
import useGenders from "@/src/hooks/useGenders";
import usePositions from "@/src/hooks/usePositions";
import useQuestions from "@/src/hooks/useQuestions";
import { createPlayer } from "@/src/services/player";
import { colors } from "@/src/theme";
import { CreatePlayerPayload } from "@/src/types/api/Player";
import { REQUIRED_LABEL } from "@/src/utils/customValidator";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import CustomQuestions from "./CustomQuestions";
import { styles } from "./Questonary.styles";
import { GENDER_CODE } from "@/src/types/player/Gender";
import * as ImagePicker from "expo-image-picker";
import { CameraType } from "expo-image-picker";

type QuestionValues = {
  genderId: number | null;
  positionId: number | null;
  knowsCategory: boolean | null;
  categoryId: number | null;
  dynamicQuestions: { value: number | null }[];
  phone?: string;
};

const Questonary: React.FC = () => {
  const { data: genders, loading: gendersLoading } = useGenders(true);
  const { data: positions, loading: positionsLoading } = usePositions();
  const { data: allCategories } = useCategories(true);
  const { questions } = useQuestions();
  const navigation = useNavigation();
  const { openErrorModal, openModal } = useContext(ModalContext);
  const { refreshToken } = useContext(AuthContext);
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const [mediaPermission, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionValues>({
    defaultValues: {
      genderId: null,
      positionId: null,
      knowsCategory: null,
      categoryId: null,
      dynamicQuestions: questions.map(() => ({ value: null })),
    },
    mode: "onChange",
  });

  const selectedGender = watch("genderId");
  const selectedPosition = watch("positionId");
  const knowsCategory = watch("knowsCategory");
  const [profilePhoto, setProfilePhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const categories = allCategories.filter((c) => c.genderId === selectedGender);

  const requestGalleryPermission = async () => {
    if (mediaPermission?.granted) return true;
    const permissionResult = await requestMediaPermission();
    if (!permissionResult.granted) {
      openErrorModal(
        "Permisos",
        "Necesitamos permisos para acceder a tus fotos y poder cargar tu imagen de perfil."
      );
      return false;
    }
    return true;
  };

  const handleSelectProfilePhoto = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      cameraType: CameraType.front,
      shape: "oval",
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setProfilePhoto(asset);
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(null);
  };

  const onSubmit = async (values: QuestionValues) => {
    const data: CreatePlayerPayload = {
      genderId: values.genderId!,
      positionId: values.positionId!,
      knowsCategory: values.knowsCategory!,
      categoryId: values.categoryId || undefined,
      answers: values.dynamicQuestions.map((q) => q.value!),
      phone: values.phone,
      profilePhoto: profilePhoto
        ? {
            uri: profilePhoto.uri,
            type: profilePhoto.mimeType || "image/jpeg",
            name:
              profilePhoto.fileName ||
              `profile-photo-${Date.now()}.${(
                profilePhoto.mimeType || "image/jpeg"
              )
                .split("/")
                .pop()}`,
          }
        : undefined,
    };

    try {
      showLoading();
      const res = await createPlayer(data);
      if (res.error) {
        openErrorModal("Error", "Hubo un error al crear el jugador");
      } else {
        openModal({
          title:
            res.data?.player?.gender?.code === GENDER_CODE.DAMA
              ? "¡Bienvenida!"
              : "¡Bienvenido!",
          message:
            !data.knowsCategory && res.data?.player.category?.description
              ? `Según tus respuestas, definimos que tu categoría es ${res.data?.player.category?.description}. Tu perfil quedó configurado. Ahora podés empezar a buscar partidos y conectar con otros jugadores ¡Que disfrutes del juego!`
              : "Ya configuraste tu perfil. Ahora podés empezar a buscar partidos y conectar con otros jugadores ¡Que disfrutes del juego!",
          primaryLabel: "Ingresar",
          primaryAction: refreshToken,
          secondaryAction: refreshToken,
          hideClose: true,
        });
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={18} color={colors.primary} />
        <CustomText type="small" style={styles.buttonText}>
          Volver
        </CustomText>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <CustomText type="h1" style={styles.title} bold>
          Información del Jugador
        </CustomText>
        <CustomText type="body" style={styles.subtitle}>
          Completá tu perfil para ayudarnos a encontrar partidos adecuados
        </CustomText>
      </View>

      <View style={styles.card}>
        <View style={styles.photoSection}>
          <CustomText bold type="small" style={styles.photoLabel}>
            Foto de perfil (opcional)
          </CustomText>
          <CustomText type="small" style={styles.photoSubtitle}>
            Cargá tu foto ahora para que los jugadores te puedan reconocer. Sino
            podés cargarla luego en tu perfil.
          </CustomText>

          {profilePhoto ? (
            <>
              <Image
                source={{ uri: profilePhoto.uri }}
                style={styles.photoPreview}
              />
              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={handleSelectProfilePhoto}
                >
                  <Ionicons name="camera" size={18} color={colors.primary} />
                  <CustomText type="small" style={styles.photoActionText}>
                    Cambiar foto
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={handleRemoveProfilePhoto}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.error}
                  />
                  <CustomText type="small" style={styles.photoRemoveText}>
                    Quitar
                  </CustomText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.photoPlaceholder}
              onPress={handleSelectProfilePhoto}
            >
              <Ionicons name="camera" size={24} color={colors.placeholder} />
              <CustomText type="small" style={styles.photoPlaceholderText}>
                Subí una foto o hacé click para tomarla desde la galería
              </CustomText>
            </TouchableOpacity>
          )}
        </View>

        {/* Género */}
        <View>
          <Controller
            control={control}
            name="genderId"
            rules={{ required: "Debés seleccionar tu género" }}
            render={({ field: { onChange, value } }) => (
              <CustomRadioInput
                label="Seleccioná tu género:"
                labelProps={{ bold: true }}
                options={genders.map((g) => ({ id: g.id, label: g.name }))}
                value={value}
                onSelect={onChange}
                loading={gendersLoading}
                error={errors.genderId?.message}
              />
            )}
          />
        </View>

        {/* Posición */}
        <View>
          <Controller
            control={control}
            name="positionId"
            rules={{ required: "Debés seleccionar tu posición" }}
            render={({ field: { onChange, value } }) => (
              <CustomRadioInput
                label="¿En qué lado de la cancha preferís jugar?"
                labelProps={{ bold: true }}
                options={positions.map((p) => ({
                  id: p.id,
                  label: p.description,
                }))}
                value={value}
                onSelect={onChange}
                loading={positionsLoading}
                error={errors.positionId?.message}
              />
            )}
          />
        </View>

        {/* Conoce categoría */}
        <View>
          <CustomText type="body" style={styles.label} bold>
            ¿Sabés en qué categoría jugás?
          </CustomText>
          <CustomText type="small" style={styles.subLabel}>
            Apelamos a la buena fe de todos los jugadores para la correcta
            elección de su categoría a fin de armar partidos parejos. Pronto
            ofreceremos opciones para validar la categoría.
          </CustomText>
          <Controller
            control={control}
            name="knowsCategory"
            rules={{
              validate: (value) =>
                value !== null || "Debés seleccionar una opción",
            }}
            render={({ field: { onChange, value } }) => (
              <ToggleGroup<boolean | null>
                options={[
                  { label: "Si, conozco mi categoría", value: true },
                  { label: "No, necesito ayuda", value: false },
                ]}
                selected={value}
                onSelect={onChange}
                disabled={!selectedGender || !selectedPosition}
              />
            )}
          />
          {errors.knowsCategory && (
            <CustomText
              type="small"
              style={{ color: colors.error, marginTop: 4 }}
            >
              {errors.knowsCategory.message}
            </CustomText>
          )}
        </View>

        <View>
          {knowsCategory && (
            // Categoría
            <>
              <View style={styles.separator} />
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    label="Seleccioná tu categoría"
                    data={categories}
                    keyExtractor={(c) => c.id.toString()}
                    labelExtractor={(c) => c.description}
                    value={value}
                    onSelect={onChange}
                    placeholder="Elegí una categoría"
                    error={errors.categoryId && REQUIRED_LABEL}
                  />
                )}
              />
            </>
          )}

          {knowsCategory === false && (
            // Cuestionario de nivel
            <>
              <View style={styles.separator} />
              <CustomQuestions
                questions={questions}
                control={control}
                errors={errors}
              />
            </>
          )}
        </View>
      </View>

      <FullButton style={styles.button} onPress={handleSubmit(onSubmit)}>
        <CustomText.ButtonText type="medium">Confirmar</CustomText.ButtonText>
      </FullButton>
    </ScrollView>
  );
};

export default Questonary;
