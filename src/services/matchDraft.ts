import { MatchFormValues } from "@/src/types/forms/MatchForm";

let draft: MatchFormValues | null = null;

export const setMatchDraft = (values: MatchFormValues) => {
  draft = values;
};

export const getMatchDraft = () => draft;

export const clearMatchDraft = () => {
  draft = null;
};
