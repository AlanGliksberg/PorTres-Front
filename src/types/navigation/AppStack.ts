import { NavigatorScreenParams } from "@react-navigation/native";
import { MeFaltaAlguienStackParamList } from "./MeFaltaAlguienStack";

export type AppStackParamList = {
  Home: undefined;
  QuieroJugar: undefined;
  MeFaltaAlguienStack: NavigatorScreenParams<MeFaltaAlguienStackParamList>;
  MiPerfil: undefined;
};
