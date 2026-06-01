/**
 * Full-bleed ASCII-animation video for the I NEED… hero.
 *
 * React Native has no <video> primitive and the playground doesn't bundle
 * expo-av, so this renders a raw DOM <video> on web (the playground's only
 * target) via React.createElement. On native it's a no-op black fill.
 *
 * It fills its parent (position:absolute), so the caller controls placement
 * and any fade — the INeed screen wraps it in an animated layer that fades the
 * video in as part of the entrance choreography.
 */
import { createElement } from "react";
import { Platform, View } from "react-native";

export function VideoBackground({ source }: { source: string }) {
  if (Platform.OS !== "web") {
    return <View style={{ position: "absolute", inset: 0, backgroundColor: "#000" } as never} />;
  }
  return createElement(
    "video",
    {
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      preload: "auto",
      "aria-hidden": true,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "bottom",
        pointerEvents: "none",
      },
    },
    createElement("source", { src: source, type: "video/mp4" }),
  );
}
