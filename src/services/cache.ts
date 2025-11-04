import {
  GET_CURRENT_PLAYER_URI,
  GET_PLAYED_MATCHES_COUNT_URI,
  GET_PLAYED_MATCHES_URI,
  GET_CREATED_MATCHES_URI,
  GET_APPLIED_MATCHES_URI,
  GET_MY_MATCHES_URI,
  GET_MY_PENDING_RESULTS_URI,
} from "../constants/api";
import { ApiResponse } from "../types";

interface CacheEntry {
  timestamp: number;
  data: ApiResponse<any>;
}

export const cache = new Map<string, Map<string, CacheEntry>>();
export const CACHE_TTL = 5 * 60 * 1000;
export const EXTENDED_CACHE_TTL = 60 * 60 * 1000;

const removeCache = (uri: string) => {
  cache.delete(uri);
};

export const clearCache = () => {
  cache.clear();
};

export const getCachedCall = (uri: string, url: string) => {
  const cachedUri = cache.get(uri);
  if (!cachedUri) return null;
  const cached = cachedUri.get(url);
  return cached;
};

export const cacheGetCall = (
  uri: string,
  url: string,
  result: ApiResponse<any>
) => {
  const cachedUri = cache.get(uri);
  if (cachedUri) {
    cachedUri.set(url, { timestamp: Date.now(), data: result });
    return;
  }
  const valueDictionary = new Map<string, CacheEntry>();
  valueDictionary.set(url, { timestamp: Date.now(), data: result });
  cache.set(uri, valueDictionary);
};

export const removeGetCreatedMatchesCache = () => {
  removeCache(GET_CREATED_MATCHES_URI);
};

export const removeGetPlayedMatchesCache = () => {
  removeCache(GET_PLAYED_MATCHES_URI);
};

export const removeGetCurrentPlayerCache = () => {
  removeCache(GET_CURRENT_PLAYER_URI);
};

export const removePlayedCountCache = () => {
  removeCache(GET_PLAYED_MATCHES_COUNT_URI);
};

export const removeMyMatchesCache = () => {
  removeCache(GET_MY_MATCHES_URI);
};

export const removeMyApplicationsCache = () => {
  removeCache(GET_APPLIED_MATCHES_URI);
};

export const removeMyResultsCache = () => {
  removeCache(GET_MY_PENDING_RESULTS_URI);
};
