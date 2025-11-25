import { Team } from "../player/Team";

export interface MatchFormValues {
  clubId: number | null;
  name: string;
  description: string | undefined;
  date: Date | null;
  time: Date | null;
  duration: 60 | 90 | 120 | null;
  genderId: number | null;
  categoryId: number | null;
  teams: Team[];
}

export const matchFormDefaultValues: MatchFormValues = {
  clubId: null,
  name: "",
  description: "",
  date: null,
  time: null,
  duration: null,
  genderId: null,
  categoryId: null,
  teams: [],
};
