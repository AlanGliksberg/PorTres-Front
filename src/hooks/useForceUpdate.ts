import Constants from "expo-constants";
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { getAppConfig } from "../services/app";
import { PlatformMinVersion } from "@/src/types";
import { STORE_URL } from "@/src/constants/config";

type ForceUpdateState = {
  loading: boolean;
  requiresUpdate: boolean;
  minVersion?: PlatformMinVersion;
  storeUrl?: string;
  currentVersion: string;
};

const compareVersions = (current?: string, minimum?: string) => {
  if (!current || !minimum) return 0;
  const currentParts = current.split(".").map((n) => Number(n));
  const minParts = minimum.split(".").map((n) => Number(n));
  const maxLength = Math.max(currentParts.length, minParts.length);

  for (let i = 0; i < maxLength; i++) {
    const currentValue = currentParts[i] || 0;
    const minValue = minParts[i] || 0;
    if (currentValue > minValue) return 1;
    if (currentValue < minValue) return -1;
  }
  return 0;
};

export const useForceUpdate = () => {
  const [state, setState] = useState<ForceUpdateState>({
    loading: true,
    requiresUpdate: false,
    currentVersion: Constants.expoConfig?.version || "0.0.0",
  });

  const currentVersion = useMemo(
    () => Constants.expoConfig?.version || "0.0.0",
    []
  );

  useEffect(() => {
    const fetchConfig = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await getAppConfig();

      const config = response.error ? undefined : response.data;
      const minVersion: PlatformMinVersion | undefined = config
        ? {
            ios: config.iosMinVersion,
            android: config.androidMinVersion,
          }
        : undefined;
      const platformMin =
        Platform.OS === "ios" ? minVersion?.ios : minVersion?.android;
      const requiresUpdate =
        compareVersions(currentVersion, platformMin) === -1;

      setState({
        loading: false,
        requiresUpdate,
        minVersion: minVersion,
        storeUrl: STORE_URL,
        currentVersion,
      });
    };

    fetchConfig();
  }, [currentVersion]);

  return state;
};
