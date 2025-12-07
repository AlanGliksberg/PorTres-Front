import { PageParams } from "./Common";

export type GetPlayerParams = {
  name?: string | null;
  gender?: string[] | null;
  position?: string[] | null;
  category?: string[] | null;
} & PageParams;

export type CreatePlayerPayload = {
  genderId: number;
  positionId: number;
  phone?: string;
  knowsCategory: boolean;
  categoryId?: number;
  answers?: number[];
  profilePhoto?: ProfilePhotoPayload;
};

export type ProfilePhotoPayload = {
  uri: string;
  name: string;
  type: string;
};

export type UpdatePlayerPayload = {
  firstName: string;
  lastName: string;
  phone?: string;
  positionId: number;
  playerId?: number;
};

export type PlayerPushTokenPayload = {
  token: string;
  deviceType?: string;
};
