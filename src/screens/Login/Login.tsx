import { LoadingContext } from "@/src/contexts/LoadingContext";
import { ModalContext } from "@/src/contexts/ModalContext";
import { appleLogin, googleLogin, login } from "@/src/services/auth";
import { colors } from "@/src/theme";
import { AppleLoginPayload, AuthStackParamList } from "@/src/types";
import { AntDesign } from "@expo/vector-icons";
import {
  GoogleSignin,
  isCancelledResponse,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { LinearGradient } from "expo-linear-gradient";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Platform,
} from "react-native";
import {
  CustomText,
  CustomTextInput,
  FullButton,
  SimpleButton,
} from "../../components";
import { AuthContext } from "../../contexts/AuthContext";
import { styles } from "./Login.styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const { hideLoading, showLoading, loading } = useContext(LoadingContext);
  const { openErrorModal } = useContext(ModalContext);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  useEffect(() => {
    let mounted = true;
    if (Platform.OS !== "ios") {
      setIsAppleAvailable(false);
      return;
    }
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (mounted) setIsAppleAvailable(available);
      })
      .catch(() => {
        if (mounted) setIsAppleAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      openErrorModal(
        "Error",
        "Completá el correo y la contraseña para continuar."
      );
      return;
    }
    showLoading();
    const res = await login(email, password);
    if (res.error || !res.data) {
      hideLoading();
      if (res.code === 1)
        openErrorModal("Error", "Las credenciales ingresadas son incorrectas");
      else
        openErrorModal(
          "Error",
          "Ocurrió un error inesperado. Intentá nuevamente en unos momentos."
        );
      return;
    }
    saveToken(res.data?.token);
    hideLoading();
  };

  const handleGoogle = async () => {
    showLoading();
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const result = await GoogleSignin.signIn();

      let res = null;
      if (isSuccessResponse(result)) {
        res = await googleLogin(result.data.idToken!);
      } else if (isCancelledResponse(result)) return;

      if (!res || res.error || !res.data) {
        console.log("Error:", res);
        hideLoading();
        openErrorModal(
          "Error",
          "No se pudo iniciar sesión con Google. Intentá nuevamente."
        );
        return;
      }

      saveToken(res.data.token);
    } catch (e) {
      console.log("Error:", e);
      openErrorModal(
        "Error",
        "No se pudo iniciar sesión con Google. Intentá nuevamente."
      );
    } finally {
      hideLoading();
    }
  };
  const handleRegister = () => {
    navigation.navigate("Register");
  };
  const handleForgot = () => {
    // TODO
  };
  const handleApple = async () => {
    if (!isAppleAvailable) return;
    showLoading();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No se pudo obtener el token de Apple");
      }

      const payload: AppleLoginPayload = {
        identityToken: credential.identityToken,
      };

      if (credential.email) payload.email = credential.email;
      const givenName = credential.fullName?.givenName?.trim();
      const familyName = credential.fullName?.familyName?.trim();
      if (givenName) payload.firstName = givenName;
      if (familyName) payload.lastName = familyName;

      const res = await appleLogin(payload);
      if (res.error || !res.data) {
        console.log("Error:", res);
        openErrorModal(
          "Error",
          "No se pudo iniciar sesión con Apple. Intentá nuevamente."
        );
        return;
      }

      saveToken(res.data.token);
    } catch (error) {
      if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED") {
        return;
      }
      console.log("Error Apple:", error);
      openErrorModal(
        "Error",
        "No se pudo iniciar sesión con Apple. Intentá nuevamente."
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[colors.primary, colors.primary, colors.white]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.card}>
            <CustomText.Title style={styles.title}>
              ¡Bienvenid@ a PorTres!
            </CustomText.Title>

            <View style={styles.inputsContainer}>
              <CustomTextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <CustomTextInput
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                rightSlot={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <AntDesign
                      name={showPassword ? "eye" : "eyeo"}
                      size={24}
                      color={colors.placeholder}
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.mainButtonsContainer}>
                <FullButton onPress={handleLogin} disabled={loading}>
                  <CustomText.ButtonText uppercase>
                    Iniciar sesión
                  </CustomText.ButtonText>
                </FullButton>

                <FullButton
                  style={styles.googleButton}
                  onPress={handleGoogle}
                  disabled={loading}
                >
                  <AntDesign name="google" size={20} color="#fff" />
                  <CustomText.ButtonText uppercase>
                    Continuar con Google
                  </CustomText.ButtonText>
                </FullButton>
                {isAppleAvailable && (
                  <FullButton
                    style={styles.appleButton}
                    onPress={handleApple}
                    disabled={loading}
                  >
                    <AntDesign name="apple1" size={20} color="#fff" />
                    <CustomText.ButtonText uppercase>
                      Continuar con Apple
                    </CustomText.ButtonText>
                  </FullButton>
                )}
              </View>

              <View style={styles.secondaryButtonsContainer}>
                <SimpleButton title="Registrarse" onPress={handleRegister} />
                {/* <SimpleButton
                  title="¿Olvidaste tu contraseña?"
                  onPress={handleForgot}
                /> */}
              </View>

              <View style={styles.termsContainer}>
                <CustomText type="small" style={styles.termsText}>
                  Al continuar aceptás los{" "}
                  <CustomText
                    type="small"
                    style={styles.termsLink}
                    onPress={() => navigation.navigate("TermsAndConditions")}
                  >
                    Términos y Condiciones
                  </CustomText>
                  {" "}y la{" "}
                  <CustomText
                    type="small"
                    style={styles.termsLink}
                    onPress={() =>
                      navigation.navigate("TermsAndConditions", {
                        tab: "privacy",
                      })
                    }
                  >
                    Política de Privacidad
                  </CustomText>
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
