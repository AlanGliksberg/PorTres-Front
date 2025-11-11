import * as SplashScreen from "expo-splash-screen";
import {
  StatusChangeEventPayload,
  useVideoPlayer,
  VideoView,
} from "expo-video";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type AnimatedSplashProps = {
  onFinish: () => void;
  fallbackDurationMs?: number;
};

const videoSource = require("../../../assets/animations/animacion_entrada.mp4");

export default function AnimatedSplash({
  onFinish,
  fallbackDurationMs = 4500,
}: AnimatedSplashProps) {
  const hasFinishedRef = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const player = useVideoPlayer(videoSource, (createdPlayer) => {
    createdPlayer.loop = false;
    createdPlayer.play();
  });

  const completeAnimation = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      opacity.setValue(0);
      onFinish();
    });
  }, [onFinish, opacity]);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);

    const timeout = setTimeout(completeAnimation, fallbackDurationMs);
    return () => clearTimeout(timeout);
  }, [completeAnimation, fallbackDurationMs]);

  useEffect(() => {
    const endSub = player.addListener("playToEnd", completeAnimation);
    const statusSub = player.addListener(
      "statusChange",
      ({ status, error }: StatusChangeEventPayload) => {
        if (status === "error" || error) completeAnimation();
      }
    );

    return () => {
      endSub.remove();
      statusSub.remove();
    };
  }, [player, completeAnimation]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 999,
  },
});
