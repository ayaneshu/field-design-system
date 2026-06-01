import { useCallback } from "react";
import { Linking, Platform, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";

import { Reveal } from "../components/Reveal";
import { TopHeader } from "../components/TopHeader";
import { Button } from "../ineed/Button";
import { RequestForm } from "../ineed/RequestForm";
import { ToastStack, useToastStack } from "../ineed/Toast";
import { VideoBackground } from "../ineed/VideoBackground";
import { c } from "../ineed/tokens";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "INeed">;

const SEMIBOLD = "Noontree-SemiBold";

export function INeedScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const { toasts, push } = useToastStack();
  const singleColumn = width < 900;
  const heroTitleSize = Math.max(singleColumn ? 64 : 56, Math.min(150, width * 0.09));
  const pad = width >= 720 ? 40 : 20;
  // Form card height — keep the whole form within one viewfold (fields scroll
  // inside, submit stays pinned). Leaves room for the header + page margins.
  const cardHeight = Math.max(520, Math.min(height - 150, 780));

  // Open the author's X profile (new tab on web).
  const openX = useCallback(() => {
    const url = "https://x.com/ayaneshu_";
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(url).catch(() => {});
    }
  }, []);

  // ── Entrance choreography ──────────────────────────────────────────────
  // 1) a light base settles in over the previous page, 2) the hero + form
  // blocks reveal in a stagger (each <Reveal index> below), and 3) the sky
  // video fades in behind. Replays on every focus.
  const reducedMotion = useReducedMotion();
  const base = useSharedValue(0); // light page base wash
  const video = useSharedValue(0); // background video fade

  useFocusEffect(
    useCallback(() => {
      if (reducedMotion) {
        base.value = 1;
        video.value = 1;
        return;
      }
      base.value = 0;
      video.value = 0;
      base.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
      video.value = withDelay(
        820,
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      );
    }, [reducedMotion, base, video]),
  );

  const baseStyle = useAnimatedStyle(() => ({ opacity: base.value }));
  const videoStyle = useAnimatedStyle(() => ({ opacity: video.value }));

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      {/* 1) Light base — fades in over the previous page. */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: c.surfacePrimary,
          },
          // @ts-expect-error zIndex passthrough on web
          { zIndex: 0 },
          baseStyle,
        ]}
      />

      {/* 3) Background: sky video + legibility wash — fades in last. The wash
          whitens the left where the hero text sits so the navy stays readable. */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
          // @ts-expect-error zIndex passthrough on web
          { zIndex: 1 },
          videoStyle,
        ]}
      >
        <VideoBackground source="/ineed/Sky.mp4" />
        {Platform.OS === "web" ? (
          <View
            pointerEvents="none"
            // @ts-expect-error gradient is web-only
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.62) 42%, rgba(255,255,255,0.32) 100%)",
            }}
          />
        ) : null}
      </Animated.View>

      <ScrollView
        // @ts-expect-error zIndex passthrough on web keeps content above the bg
        style={{ flex: 1, zIndex: 2 }}
        contentContainerStyle={{ minHeight: "100%" as never }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2) Content — header + staggered hero/form blocks (each <Reveal>). */}
        <View style={{ flex: 1 }}>
          <TopHeader transparent active="I need" />

          <View
            style={{
              flexDirection: singleColumn ? "column" : "row",
              gap: 20,
              paddingHorizontal: pad,
              paddingBottom: 40,
              alignItems: "stretch",
              flex: 1,
            }}
          >
            {/* Left: hero */}
            <View
              style={{
                flex: singleColumn ? undefined : 1,
                justifyContent: "space-between",
                paddingHorizontal: singleColumn ? 0 : 40,
                paddingTop: singleColumn ? 32 : 64,
                paddingBottom: 48,
                gap: 48,
              }}
            >
              <View style={{ gap: 48 }}>
                <Reveal index={0} style={{ gap: 10 }}>
                  <Text
                    style={{
                      fontFamily: SEMIBOLD,
                      fontSize: 48,
                      letterSpacing: -1.92,
                      color: c.textTertiary,
                      lineHeight: 48 * 0.9,
                    }}
                  >
                    from field
                  </Text>
                  <Text
                    style={{
                      fontFamily: SEMIBOLD,
                      fontSize: heroTitleSize,
                      letterSpacing: -heroTitleSize * 0.04,
                      color: c.textPrimary,
                      lineHeight: heroTitleSize * 0.9,
                    }}
                  >
                    i need...
                  </Text>
                </Reveal>

                <Reveal index={1} style={{ maxWidth: 528, gap: 20 }}>
                  <Text
                    style={{
                      fontFamily: "Noontree-Regular",
                      fontSize: 20,
                      lineHeight: 28,
                      letterSpacing: -0.15,
                      color: c.textSecondary,
                    }}
                  >
                    a missing icon, a color that feels off, or some text that could use a little
                    polish?
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Noontree-Regular",
                      fontSize: 20,
                      lineHeight: 28,
                      letterSpacing: -0.15,
                      color: c.textSecondary,
                    }}
                  >
                    Reach out to our design systems team! Every request, whether it's a new idea or
                    an enhancement, goes into one shared document, ensuring nothing slips through the
                    cracks.
                  </Text>
                </Reveal>

                <Reveal index={2} style={{ alignSelf: "flex-start" }}>
                  <Button
                    variant="white"
                    onPress={() => navigation.navigate("INeedRequests")}
                    style={{ paddingVertical: 20, paddingHorizontal: 28, borderRadius: 16 }}
                    textStyle={{ fontFamily: "Noontree-SemiBold", fontSize: 20, letterSpacing: -0.15 }}
                    iconRight={<Icon name="system-arrow-right" size={28} color={c.textPrimary} />}
                  >
                    Active Requests
                  </Button>
                </Reveal>
              </View>

              <Reveal index={3}>
                <Text
                  style={{
                    fontFamily: "Noontree-Regular",
                    fontSize: 20,
                    lineHeight: 28,
                    letterSpacing: -0.15,
                    color: c.textTertiary,
                  }}
                >
                  Built by{" "}
                  <Text
                    accessibilityRole="link"
                    onPress={openX}
                    style={{
                      color: c.textPrimary,
                      textDecorationLine: "underline",
                      // @ts-expect-error cursor is web-only
                      cursor: "pointer",
                    }}
                  >
                    @ayaneshu
                  </Text>
                </Text>
              </Reveal>
            </View>

            {/* Right: form card */}
            <View
              style={{
                flex: singleColumn ? undefined : 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: singleColumn ? 8 : 40,
              }}
            >
              <Reveal index={1} style={{ width: "100%", alignItems: "center" }}>
                <View
                  style={{
                    width: "100%",
                    maxWidth: 620,
                    height: cardHeight,
                    backgroundColor: c.surfacePrimary,
                    borderWidth: 1,
                    borderColor: c.borderSubtle,
                    borderRadius: 40,
                    overflow: "hidden",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 24px 60px rgba(16,22,40,0.12)" }
                      : null),
                  }}
                >
                  <RequestForm
                    onToast={push}
                    onSubmitted={() => navigation.navigate("INeedRequests")}
                  />
                </View>
              </Reveal>
            </View>
          </View>
        </View>
      </ScrollView>

      <ToastStack toasts={toasts} />
    </View>
  );
}
