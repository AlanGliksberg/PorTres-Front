import { Match, Club } from "..";

export type GetMatchesResponse = {
  matches: Match[];
  totalMatches: number;
};

export type GetClubsResponse = {
  clubs: Club[];
};

export type CommonMatchResponse = {
  match: Match;
};

export type CreateMatchBody = {
  date: string;
  time: string;
  location: string;
  description?: string;
  categoryId: number;
  pointsDeviation?: number;
  genderId: number;
  duration: number;
  teams?: TeamCreate;
};

export type UpdateMatchBody = {
  location?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  genderId?: number;
  categoryId?: number;
  pointsDeviation?: number;
  teams?: TeamDTO;
};

export type TeamCreate = {
  team1: PlayerCreate[];
  team2: PlayerCreate[];
};

export type TeamDTO = {
  team1?: PlayerDTO[];
  team2?: PlayerDTO[];
};

export type PlayerCreate =
  | {
      id: number;
    }
  | {
      firstName: string;
      lastName: string;
      categoryId: number;
      genderId: number;
      phone?: string;
    };

export type PlayerDTO = {
  id: number;
};
