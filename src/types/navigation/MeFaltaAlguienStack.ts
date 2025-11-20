import { Match } from "../match/Match";

export type MeFaltaAlguienStackParamList = {
  MeFaltaAlguien: { pendingEditMatch?: Match } | undefined;
  CrearPartido: undefined;
  EditarPartido: { match: Match };
};
