const AUTH_BASE_URI = "/auth";
const MATCH_BASE_URI = "/matches";
const PLAYER_BASE_URI = "/player";
const APPLICATIONS_BASE_URI = "/application";

export const LOGIN_URI = `${AUTH_BASE_URI}/login`;
export const GOOGLE_LOGIN_URI = `${AUTH_BASE_URI}/google`;
export const REGISTER_URI = `${AUTH_BASE_URI}/register`;
export const REFRESH_TOKEN_URI = `${AUTH_BASE_URI}/refresh`;
export const CHANGE_PASSWORD_URI = `${AUTH_BASE_URI}/change-password`;
export const LOGOUT_URI = `${AUTH_BASE_URI}/logout`;

export const GET_MATCHES_URI = `${MATCH_BASE_URI}`;
export const GET_CREATED_MATCHES_URI = `${MATCH_BASE_URI}/created`;
export const GET_PLAYED_MATCHES_URI = `${MATCH_BASE_URI}/played`;
export const GET_APPLIED_MATCHES_URI = `${MATCH_BASE_URI}/applied`;
export const GET_MY_MATCHES_URI = `${MATCH_BASE_URI}/mine`;
export const GET_MY_PENDING_RESULTS_URI = `${MATCH_BASE_URI}/results`;
export const GET_PLAYED_MATCHES_COUNT_URI = `${MATCH_BASE_URI}/count`;
export const DELETE_MATCH_URI = MATCH_BASE_URI;
export const CREATE_MATCH_URI = MATCH_BASE_URI;
export const UPDATE_MATCH_URI = MATCH_BASE_URI;
export const ADD_PLAYER_TO_MATCH_URI = `${MATCH_BASE_URI}/player`;
export const REMOVE_PLAYER_FROM_MATCH_URI = `${MATCH_BASE_URI}/player`;
export const UPDATE_MATCH_RESULT_URI = `${MATCH_BASE_URI}/results`;
export const ACCEPT_MATCH_RESULT_URI = `${MATCH_BASE_URI}/results`;
export const CREATE_MATCH_RESULT_URI = `${MATCH_BASE_URI}/matchwithresult`;

export const GET_PLAYERS_URI = PLAYER_BASE_URI;
export const CREATE_PLAYER_URI = PLAYER_BASE_URI;
export const UPDATE_PLAYER_URI = PLAYER_BASE_URI;
export const DELETE_PLAYER_URI = PLAYER_BASE_URI;
export const GET_CURRENT_PLAYER_URI = `${PLAYER_BASE_URI}/me`;
export const SAVE_PLAYER_PUSH_TOKEN_URI = `${PLAYER_BASE_URI}/push-token`;
export const GET_GENDERS_URI = `${PLAYER_BASE_URI}/gender`;
export const GET_POSITIONS_URI = `${PLAYER_BASE_URI}/position`;
export const GET_CATEGORIES_URI = `${PLAYER_BASE_URI}/category`;
export const GET_QUESTIONS_URI = `${PLAYER_BASE_URI}/question`;

export const ACCEPT_APPLICATION_URI = `${APPLICATIONS_BASE_URI}/accept`;
export const REJECT_APPLICATION_URI = `${APPLICATIONS_BASE_URI}/reject`;
export const APPLY_TO_MATCH_URI = `${APPLICATIONS_BASE_URI}`;
export const DELETE_APPLICATION_URI = `${APPLICATIONS_BASE_URI}`;
export const GET_APPLICATION_STATUS_URI = `${APPLICATIONS_BASE_URI}/status`;
