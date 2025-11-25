import {
  ADD_PLAYER_TO_MATCH_URI,
  CREATE_MATCH_URI,
  DELETE_MATCH_URI,
  GET_PLAYED_MATCHES_COUNT_URI,
  UPDATE_MATCH_URI,
  GET_CREATED_MATCHES_URI,
  GET_PLAYED_MATCHES_URI,
  GET_APPLIED_MATCHES_URI,
  GET_MATCHES_URI,
  GET_MY_MATCHES_URI,
  GET_MY_PENDING_RESULTS_URI,
  UPDATE_MATCH_RESULT_URI,
  ACCEPT_MATCH_RESULT_URI,
  CREATE_MATCH_RESULT_URI,
  REMOVE_PLAYER_FROM_MATCH_URI,
  DELETE_APPLICATION_URI,
  GET_CLUBS_URI,
} from "../constants/api";
import {
  Club,
  CreateMatchBody,
  GetClubsResponse,
  GetMatchesResponse,
  MatchFilters,
  MatchResult,
  Player,
} from "../types";
import { CommonMatchResponse, UpdateMatchBody } from "../types/api/Match";
import { deleteApi, get, post, put } from "./api";
import { EXTENDED_CACHE_TTL } from "./cache";

export const getCreatedMatches = async (
  page: number,
  pageSize: number,
  withCache = true
) => {
  if (typeof page !== "number" || isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_CREATED_MATCHES_URI, {
    queryParams: { page, pageSize },
    withCache,
  });
};

export const deleteMatchApi = async (matchId: number) => {
  return await deleteApi<CommonMatchResponse>(
    `${DELETE_MATCH_URI}/${matchId.toString()}`
  );
};

export const addPlayerToMatch = async (
  matchId: number,
  teamNumber: number,
  player: Player
) => {
  return await post<CommonMatchResponse>(ADD_PLAYER_TO_MATCH_URI, {
    body: {
      matchId,
      teamNumber,
      playerId: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      genderId: player.genderId,
      categoryId: player.categoryId,
      phone: player.phone,
    },
  });
};

export const createMatch = async (data: CreateMatchBody) => {
  return await post<CommonMatchResponse>(CREATE_MATCH_URI, {
    body: data,
  });
};

export const updateMatch = async (matchId: number, data: UpdateMatchBody) => {
  return await put<CommonMatchResponse>(
    `${UPDATE_MATCH_URI}/${matchId.toString()}`,
    {
      body: data,
    }
  );
};

export const deletePlayerFromMatch = async (
  matchId: number,
  playerId: number
) => {
  return await deleteApi<CommonMatchResponse>(REMOVE_PLAYER_FROM_MATCH_URI, {
    body: { matchId, playerId },
  });
};

export const deleteApplicationFromMatch = async (matchId: number) => {
  return await deleteApi<CommonMatchResponse>(DELETE_APPLICATION_URI, {
    body: { matchId },
  });
};

export const getPlayedMatchesCount = async () => {
  return await get<{ count: number }>(GET_PLAYED_MATCHES_COUNT_URI, {
    withCache: true,
  });
};

export const getPlayedMatches = async (
  page: number,
  pageSize: number,
  withCache = true
) => {
  if (isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_PLAYED_MATCHES_URI, {
    queryParams: { page, pageSize },
    withCache,
  });
};

export const getAppliedMatches = async (
  page: number,
  pageSize: number,
  withCache = true
) => {
  if (isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_APPLIED_MATCHES_URI, {
    queryParams: { page, pageSize },
    withCache,
  });
};

export const getMatchesWithFilters = async (
  page: number,
  pageSize: number,
  filters: MatchFilters,
  withCache = true
) => {
  if (isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_MATCHES_URI, {
    queryParams: { page, pageSize, ...filters },
    withCache,
  });
};

export const getMyMatches = async (
  page: number,
  pageSize: number,
  withCache = true
) => {
  if (isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_MY_MATCHES_URI, {
    queryParams: { page, pageSize },
    withCache,
  });
};

export const getMyPendingResults = async (
  page: number,
  pageSize: number,
  withCache = true
) => {
  if (isNaN(page)) {
    page = 1;
  }
  return await get<GetMatchesResponse>(GET_MY_PENDING_RESULTS_URI, {
    queryParams: { page, pageSize },
    withCache,
  });
};

export const updateMatchResult = async (
  matchId: number,
  result: MatchResult
) => {
  // Creamos un array de sets con el formato [number, number][]
  const sets: [number, number][] = [];
  sets.push([Number(result.team1Set1), Number(result.team2Set1)]);

  if (result.team1Set2 && result.team2Set2) {
    sets.push([Number(result.team1Set2), Number(result.team2Set2)]);
  }
  if (result.team1Set3 && result.team2Set3) {
    sets.push([Number(result.team1Set3), Number(result.team2Set3)]);
  }

  return await put(UPDATE_MATCH_RESULT_URI, {
    body: {
      matchId,
      sets,
    },
  });
};

export const acceptMatchResult = async (matchId: number) => {
  return await post(ACCEPT_MATCH_RESULT_URI, { body: { matchId } });
};

export const createMatchWithResult = async (
  location: string,
  date: string,
  time: string,
  gender: number,
  category: number,
  team1: Player[],
  team2: Player[],
  result: MatchResult
) => {
  const sets: [number, number][] = [];
  sets.push([Number(result.team1Set1), Number(result.team2Set1)]);

  if (result.team1Set2 && result.team2Set2) {
    sets.push([Number(result.team1Set2), Number(result.team2Set2)]);
  }
  if (result.team1Set3 && result.team2Set3) {
    sets.push([Number(result.team1Set3), Number(result.team2Set3)]);
  }
  return await post(CREATE_MATCH_RESULT_URI, {
    body: {
      location,
      date,
      time,
      gender,
      category,
      teams: { team1, team2 },
      sets,
    },
  });
};

export const getClubs = async () => {
  return await get<GetClubsResponse>(GET_CLUBS_URI, {
    withCache: true,
    cacheTtl: EXTENDED_CACHE_TTL,
  });
};
