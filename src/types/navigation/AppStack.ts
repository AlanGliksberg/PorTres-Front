import { NavigatorScreenParams } from "@react-navigation/native";
import { MeFaltaAlguienStackParamList } from "./MeFaltaAlguienStack";

export type AppStackParamList = {
  Home: undefined;
  QuieroJugar: undefined;
  MeFaltaAlguienStack: NavigatorScreenParams<MeFaltaAlguienStackParamList>;
  MiPerfil:
    | {
        playerId?: number;
        readOnly?: boolean;
        returnToTab?: keyof AppStackParamList;
        returnToParams?: unknown;
      }
    | undefined;
};
