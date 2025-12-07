import {
  CREATE_PLAYER_URI,
  DELETE_PLAYER_URI,
  GET_CATEGORIES_URI,
  GET_PLAYER_DETAILS_URI,
  GET_GENDERS_URI,
  GET_PLAYERS_URI,
  GET_POSITIONS_URI,
  GET_QUESTIONS_URI,
  SAVE_PLAYER_PUSH_TOKEN_URI,
  UPDATE_PLAYER_PICTURE_URI,
  UPDATE_PLAYER_URI,
  DELETE_PLAYER_PICTURE_URI,
} from "../constants/api";
import {
  Category,
  Gender,
  GetPlayerParams,
  Player,
  PlayerPushTokenPayload,
  Position,
} from "../types";
import {
  CreatePlayerPayload,
  ProfilePhotoPayload,
  UpdatePlayerPayload,
} from "../types/api/Player";
import { Question } from "../types/player/Question";
import { deleteApi, get, post, put } from "./api";
import { EXTENDED_CACHE_TTL, removeGetCurrentPlayerCache } from "./cache";

export const getAllPlayers = async () => {
  return await get<{ players: Player[] }>(GET_PLAYERS_URI, {
    withCache: true,
  });
};

export const getPlayers = async (params: GetPlayerParams) => {
  if (
    !params.name &&
    !params.category?.some(Boolean) &&
    !params.gender?.some(Boolean) &&
    !params.position?.some(Boolean)
  )
    return { error: false, data: { players: [] } };

  return await get<{ players: Player[] }>(GET_PLAYERS_URI, {
    queryParams: params,
    withCache: true,
  });
};

export const getGenders = async (filterBoth: boolean = false) => {
  const res = await get<{ genders: Gender[] }>(GET_GENDERS_URI, {
    withCache: true,
    cacheTtl: EXTENDED_CACHE_TTL,
    queryParams: { filterBoth },
  });

  if (res.error || !res.data) throw new Error(res.message);

  return res;
};

export const getPositions = async () => {
  return await get<{ positions: Position[] }>(GET_POSITIONS_URI, {
    withCache: true,
    cacheTtl: EXTENDED_CACHE_TTL,
  });
};

export const getCategories = async (filterBoth: boolean) => {
  return await get<{ categories: Category[] }>(GET_CATEGORIES_URI, {
    withCache: true,
    cacheTtl: EXTENDED_CACHE_TTL,
    queryParams: { filterBoth },
  });
};

export const getQuestions = async () => {
  return await get<{ questions: Question[] }>(GET_QUESTIONS_URI, {
    withCache: true,
    cacheTtl: EXTENDED_CACHE_TTL,
  });
};

export const createPlayer = async (data: CreatePlayerPayload) => {
  const formData = new FormData();
  formData.append("genderId", data.genderId.toString());
  formData.append("positionId", data.positionId.toString());
  formData.append("knowsCategory", JSON.stringify(data.knowsCategory));

  if (data.phone) formData.append("phone", data.phone);
  if (data.categoryId)
    formData.append("categoryId", data.categoryId.toString());
  if (data.answers && data.answers.length > 0) {
    formData.append("answers", JSON.stringify(data.answers));
  }
  if (data.profilePhoto) {
    formData.append("profilePhoto", {
      uri: data.profilePhoto.uri,
      name: data.profilePhoto.name,
      type: data.profilePhoto.type,
    } as any);
  }

  return await post<{ player: Player }>(CREATE_PLAYER_URI, {
    body: formData,
    customHeaders: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePlayer = async (data: UpdatePlayerPayload) => {
  const { playerId, ...payload } = data;

  const res = await put<{ player: Player }>(UPDATE_PLAYER_URI, {
    body: payload,
  });

  if (!res.error) {
    removeGetCurrentPlayerCache(playerId);
  }

  return res;
};

export const updatePlayerPicture = async (photo: ProfilePhotoPayload) => {
  const formData = new FormData();
  formData.append("profilePhoto", {
    uri: photo.uri,
    name: photo.name,
    type: photo.type,
  } as any);

  return await post<{ player: Player }>(UPDATE_PLAYER_PICTURE_URI, {
    body: formData,
    customHeaders: { "Content-Type": "multipart/form-data" },
  });
};

export const getPlayerDetails = async (playerId: number, withCache = true) => {
  return await get<{ player: Player }>(
    `${GET_PLAYER_DETAILS_URI}/${playerId}`,
    {
      withCache,
    }
  );
};

export const savePlayerPushToken = async (data: PlayerPushTokenPayload) => {
  return await post<void>(SAVE_PLAYER_PUSH_TOKEN_URI, {
    body: data,
  });
};

export const deletePlayer = async () => {
  return await deleteApi<{ deleted: boolean }>(DELETE_PLAYER_URI);
};

export const deletePlayerPicture = async () => {
  return await deleteApi<{ deleted: boolean }>(DELETE_PLAYER_PICTURE_URI);
};
