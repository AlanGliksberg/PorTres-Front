import {
  APPLE_LOGIN_URI,
  CHANGE_PASSWORD_URI,
  GOOGLE_LOGIN_URI,
  LOGIN_URI,
  LOGOUT_URI,
  REFRESH_TOKEN_URI,
  REGISTER_URI,
} from "../constants/api";
import {
  AppleLoginPayload,
  ChangePasswordDTO,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types";
import { post } from "./api";

export const login = async (email: string, password: string) => {
  return await post<LoginResponse>(LOGIN_URI, { body: { email, password } });
};

export const googleLogin = async (idToken: string) => {
  return await post<LoginResponse>(GOOGLE_LOGIN_URI, {
    body: { idToken },
  });
};

export const appleLogin = async (payload: AppleLoginPayload) => {
  return await post<LoginResponse>(APPLE_LOGIN_URI, {
    body: payload,
  });
};

export const register = async (data: RegisterPayload) => {
  return await post<RegisterResponse>(REGISTER_URI, {
    body: data,
  });
};

export const refreshToken = async (token: string) => {
  return await post<LoginResponse>(REFRESH_TOKEN_URI, {
    body: { token },
  });
};

export const changePassword = async (data: ChangePasswordDTO) => {
  return await post<void>(CHANGE_PASSWORD_URI, {
    body: data,
  });
};

export const logout = async (expoPushToken: string | null) => {
  return await post<void>(LOGOUT_URI, {
    body: { expoPushToken },
  });
};
