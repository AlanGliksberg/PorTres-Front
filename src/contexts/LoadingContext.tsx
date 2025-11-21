import { BlurView } from "expo-blur";
import React, { createContext, ReactNode, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme";

interface LoadingContextData {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextData>({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {loading && (
        <BlurView
          intensity={65}
          tint="light"
          style={loadingStyles.loadingOverlay}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </BlurView>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

const loadingStyles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});
