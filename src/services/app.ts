import { GET_APP_CONFIG_URI } from "../constants/api";
import { AppConfig } from "@/src/types";
import { get } from "./api";

export const getAppConfig = async () => {
  return await get<AppConfig>(GET_APP_CONFIG_URI, { withCache: true });
};
