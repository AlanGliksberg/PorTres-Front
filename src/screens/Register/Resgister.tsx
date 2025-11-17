import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";

import { CustomText, CustomTextInput, FullButton } from "@/src/components";
import { LoadingContext } from "@/src/contexts/LoadingContext";
import { ModalContext } from "@/src/contexts/ModalContext";
import { registerSchema } from "@/src/schemas/registerSchema";
import { login, register } from "@/src/services/auth";
import { colors } from "@/src/theme";
import {
  AuthStackParamList,
  RegisterFormValues,
  RegisterPayload,
} from "@/src/types";
import { registerDefaultValues } from "@/src/types/forms/RegisterForm";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { styles } from "./Register.styles";
import { SetPlayerStackParamList } from "@/src/types/navigation/SetPlayerStack";
import { AuthContext } from "@/src/contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tycAccepted, setTycAccepted] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
    defaultValues: registerDefaultValues,
  });
  const { hideLoading, showLoading } = useContext(LoadingContext);
  const { openErrorModal, openModal } = useContext(ModalContext);
  const { saveToken } = useContext(AuthContext);
  const navigation =
    useNavigation<
      NavigationProp<AuthStackParamList & SetPlayerStackParamList>
    >();
  const profilePhoto = watch("profilePhoto");
  const [mediaPermission, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const onSubmit = async (values: RegisterFormValues) => {
    if (!tycAccepted) {
      openErrorModal(
        "Registro",
        "Debés aceptar los Términos y Condiciones para continuar."
      );
      return;
    }
    const data: RegisterPayload = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      phone: values.phone,
      profilePhoto: values.profilePhoto || undefined,
    };
    showLoading();
    const res = await register(data);
    hideLoading();

    if (res.error)
      if (res.code === 18)
        openErrorModal(
          "Registro",
          "Ya existe un usuario registrado con el mail que ingresaste"
        );
      else
        openErrorModal(
          "Registro",
          "Hubo un error inesperado en el registro. Intentá nuevamente en unos momentos."
        );
    else {
      openModal({
        title: "Registro",
        message: "Se ha registrado correctamente",
        primaryAction: () => handleRegister(data),
      });
    }
  };

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      openErrorModal(
        "Registro",
        "No pudimos procesar tu foto. Intentá nuevamente."
      );
      return;
    }

    const mimeType = asset.mimeType || "image/jpeg";
    setValue("profilePhoto", `data:${mimeType};base64,${asset.base64}`, {
      shouldDirty: true,
    });
  };

  const handleRemoveProfilePhoto = () => {
    setValue("profilePhoto", "", { shouldDirty: true });
  };

  const handleRegister = async (data: RegisterPayload) => {
    const res = await login(data.email, data.password);
    if (res.error || !res.data) {
      navigation.navigate("Login");
      return;
    }
    saveToken(res.data?.token);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={styles.inner}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <CustomText type="small" style={styles.buttonText}>
                Volver
              </CustomText>
            </TouchableOpacity>
            <CustomText.Title style={styles.title}>Registro</CustomText.Title>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.photoContainer}>
                <CustomText bold type="small" style={styles.photoLabel}>
                  Foto de perfil (opcional)
                </CustomText>

                {profilePhoto ? (
                  <>
                    <Image
                      source={{ uri: profilePhoto }}
                      style={styles.photoPreview}
                    />
                    <View style={styles.photoActions}>
                      <TouchableOpacity
                        style={styles.photoActionButton}
                        onPress={handleSelectProfilePhoto}
                      >
                        <Ionicons
                          name="camera"
                          size={18}
                          color={colors.primary}
                        />
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
                    <Ionicons
                      name="camera"
                      size={24}
                      color={colors.placeholder}
                    />
                    <CustomText type="small" style={styles.photoPlaceholderText}>
                      Subí una foto o hacé click para tomarla desde la galería
                    </CustomText>
                  </TouchableOpacity>
                )}
              </View>

              {/* Campos del formulario */}
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Nombre"
                    value={value}
                    onChangeText={onChange}
                    error={errors.firstName?.message}
                    mandatory
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Apellido"
                    value={value}
                    onChangeText={onChange}
                    error={errors.lastName?.message}
                    mandatory
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    mandatory
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Teléfono (opcional)"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Contraseña"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    mandatory
                    rightSlot={
                      <TouchableOpacity
                        onPress={() => setShowPassword((p) => !p)}
                      >
                        <AntDesign
                          name={showPassword ? "eye" : "eyeo"}
                          size={24}
                          color={colors.placeholder}
                        />
                      </TouchableOpacity>
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <CustomTextInput
                    label="Confirmar contraseña"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    mandatory
                    rightSlot={
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((p) => !p)}
                      >
                        <AntDesign
                          name={showConfirmPassword ? "eye" : "eyeo"}
                          size={24}
                          color={colors.placeholder}
                        />
                      </TouchableOpacity>
                    }
              />
            )}
          />

          {/* <View style={styles.tycContainer}>
            <TouchableOpacity
              style={styles.tycCheckbox}
              onPress={() => setTycAccepted((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tycAccepted ? "checkbox" : "square-outline"}
                size={22}
                color={tycAccepted ? colors.primary : colors.placeholder}
              />
            </TouchableOpacity>
            <CustomText type="small" style={styles.tycText}>
              Acepto los{" "}
              <CustomText
                type="small"
                style={styles.tycLink}
                onPress={() => navigation.navigate("TermsAndConditions")}
              >
                Términos y Condiciones
              </CustomText>
            </CustomText>
          </View> */}

          <FullButton
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 20 }}
          >
            <CustomText.ButtonText type="medium">
              Registrarse
            </CustomText.ButtonText>
          </FullButton>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Register;

