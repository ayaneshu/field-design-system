import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SearchBar } from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Reveal } from "../components/Reveal";
import { TopHeader, headerHeightFor } from "../components/TopHeader";
import { listRequests } from "../ineed/api";
import { RequestsTable } from "../ineed/RequestsTable";
import { STATUSES, type DesignRequest } from "../ineed/types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "INeedRequests">;

const TEXT = colour["text-n-icon"];

export function INeedRequestsScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const hPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const titleSize =
    width >= 1440 ? 100 : width >= 1280 ? 88 : width >= 960 ? 72 : width >= 720 ? 56 : 40;
  const bandHeight = width >= 1100 ? 780 : width >= 720 ? 620 : 520;
  const headerHeight = headerHeightFor(width);

  const [rows, setRows] = useState<DesignRequest[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await listRequests();
      setRows(data);
      setState("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const s of STATUSES) acc[s] = 0;
    for (const r of rows) if (r.status in acc) acc[r.status] += 1;
    return acc;
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.description?.toLowerCase().includes(q) &&
          !r.category?.toLowerCase().includes(q) &&
          !r.type?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rows, status, query]);

  const cards = [
    { key: "", label: "All requests", value: rows.length },
    ...STATUSES.map((s) => ({ key: s, label: s, value: counts[s] ?? 0 })),
  ];

  // Sky backdrop fades in on focus, then parallaxes (scrolls slower than the
  // content) as the page scrolls.
  const reducedMotion = useReducedMotion();
  const bg = useSharedValue(0);
  const scrollY = useSharedValue(0);
  useFocusEffect(
    useCallback(() => {
      if (reducedMotion) {
        bg.value = 1;
        return;
      }
      bg.value = 0;
      bg.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    }, [reducedMotion, bg]),
  );
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  // Layered parallax: the sky drifts at ~45% of the scroll speed, the title
  // band at ~82%, and the rest of the content at 100% — so depth separates as
  // you scroll.
  const bgStyle = useAnimatedStyle(() => ({
    opacity: bg.value,
    transform: [{ translateY: reducedMotion ? 0 : scrollY.value * 0.55 }],
  }));
  const titleParallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : scrollY.value * 0.18 }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colour.surface.primary }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ minHeight: "100%" as never }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Sky backdrop — parallaxes: scrolls slower than the content. */}
        {Platform.OS === "web" ? (
          <Animated.View
            pointerEvents="none"
            style={[
              // @ts-expect-error web-only background props
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: bandHeight,
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.62) 28%, #ffffff 60%), url(/ineed/requests-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
              },
              bgStyle,
            ]}
          />
        ) : null}

        {/* @ts-expect-error zIndex keeps content above the backdrop */}
        <View style={{ zIndex: 1 }}>
        <View
          style={{
            width: "100%",
            maxWidth: 1512,
            alignSelf: "center",
            paddingHorizontal: hPad,
            paddingTop: headerHeight + space["24"],
            paddingBottom: 96,
            gap: space["40"],
          }}
        >
          {/* Back */}
          <Reveal index={0} style={{ alignSelf: "flex-start" }}>
            <BackButton onPress={() => navigation.navigate("INeed")} />
          </Reveal>

          {/* Title — drifts slower than the cards/table (parallax layer). */}
          <Animated.View style={titleParallaxStyle}>
            <Reveal index={1} style={{ gap: 11 }}>
              <Text
                style={{
                  fontFamily: "Noontree-SemiBold",
                  fontSize: titleSize,
                  lineHeight: titleSize,
                  letterSpacing: -titleSize * 0.04,
                  color: TEXT.primary,
                }}
              >
                Active requests
              </Text>
              <Text
                style={{
                  fontFamily: "Noontree-Medium",
                  fontSize: 20,
                  lineHeight: 28,
                  letterSpacing: -0.15,
                  color: TEXT.muted,
                }}
              >
                Track status of every request
              </Text>
            </Reveal>
          </Animated.View>

          {/* Status count cards */}
          <Reveal index={2} style={{ width: "100%" }}>
            <View
              style={{
                flexDirection: width >= 720 ? "row" : "column",
                gap: space["20"],
                width: "100%",
              }}
            >
              {cards.map((card) => (
                <CountCard
                  key={card.key || "all"}
                  value={card.value}
                  label={card.label}
                  active={status === card.key}
                  onPress={() => setStatus(card.key)}
                />
              ))}
            </View>
          </Reveal>

          {state === "loading" ? (
            <View style={{ paddingVertical: 64, alignItems: "center", gap: 14 }}>
              <ActivityIndicator color={TEXT.action} />
              <Text style={[textStyles.Body_B14_Regular, { color: TEXT.tertiary }]}>
                Loading requests…
              </Text>
            </View>
          ) : state === "error" ? (
            <Notice title="Couldn't load requests from the sheet" onRetry={load}>
              {errorMessage || "Something went wrong reaching the Apps Script endpoint."}
            </Notice>
          ) : (
            <View style={{ gap: space["24"], width: "100%" }}>
              <Reveal index={3} style={{ maxWidth: 454, width: "100%" }}>
                <SearchBar
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search requests…"
                  size="H48"
                  showClearButton
                  accessibilityLabel="Search requests"
                />
              </Reveal>

              <Reveal index={4} style={{ width: "100%" }}>
                <RequestsTable rows={filtered} />
              </Reveal>

              <Text style={[textStyles.Body_B12_Regular, { color: TEXT.muted }]}>
                Showing {filtered.length} of {rows.length} · Status & assignee are managed in the
                Google Sheet
              </Text>
            </View>
          )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating header — transparent over the sky, white bar on scroll. */}
      <View
        pointerEvents="box-none"
        // @ts-expect-error zIndex on web
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}
      >
        <TopHeader active="I need" scrollY={scrollY} />
      </View>
    </View>
  );
}

/** Pill-shaped white outline Back button (Figma M-NeutralRoundButton). */
function BackButton({ onPress }: { onPress: () => void }) {
  const isWeb = Platform.OS === "web";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      // @ts-expect-error rn-web passes hovered to the style callback
      style={({ hovered, pressed }: { hovered?: boolean; pressed?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["6"],
        height: 40,
        paddingHorizontal: space["16"],
        borderRadius: radius.rounded,
        borderWidth: 1,
        borderColor: colour.border.primary,
        backgroundColor: colour.surface.primary,
        opacity: pressed ? 0.9 : 1,
        ...(isWeb
          ? {
              // @ts-expect-error web-only — subtle lift on hover only
              boxShadow: hovered ? "0 4px 12px rgba(16,22,40,0.06)" : "0 0 0 rgba(0,0,0,0)",
              transitionProperty: "box-shadow, background-color",
              transitionDuration: "180ms",
              cursor: "pointer",
            }
          : null),
      })}
    >
      <Icon name="system-arrow-left" size={20} color={TEXT.primary} />
      <Text style={[textStyles.Action_A14_SemiBold, { color: TEXT.primary }]}>Back</Text>
    </Pressable>
  );
}

/** Status summary card — number + label. Doubles as a status filter. */
function CountCard({
  value,
  label,
  active,
  onPress,
}: {
  value: number;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const isWeb = Platform.OS === "web";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // @ts-expect-error rn-web passes hovered
      style={({ hovered }: { hovered?: boolean }) => ({
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "baseline",
        gap: space["8"],
        minHeight: 80,
        paddingTop: 26,
        paddingBottom: 24,
        paddingHorizontal: space["24"],
        borderRadius: radius["12"],
        // Selected = light-blue action border (Figma 4017:753); others have no
        // visible border. Width stays 1 (transparent) so toggling never shifts.
        borderWidth: 1,
        borderColor: active ? colour.border.action : "transparent",
        backgroundColor: colour.surface.primary,
        ...(isWeb
          ? {
              // @ts-expect-error web-only — subtle lift on hover only
              boxShadow: hovered ? "0 4px 12px rgba(16,22,40,0.06)" : "0 0 0 rgba(0,0,0,0)",
              transitionProperty: "box-shadow, border-color, background-color",
              transitionDuration: "180ms",
              cursor: "pointer",
            }
          : null),
      })}
    >
      <Text style={[textStyles.Heading_H24_Bold, { color: TEXT.primary }]}>{value}</Text>
      <Text style={[textStyles.Body_B16_Regular, { color: TEXT.muted, flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

function Notice({
  title,
  children,
  onRetry,
}: {
  title: string;
  children: React.ReactNode;
  onRetry: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff0f0",
        borderWidth: 1,
        borderColor: "#fdb5b5",
        borderRadius: 14,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ gap: 4 }}>
        <Text style={[textStyles.Body_B16_SemiBold, { color: TEXT.error }]}>{title}</Text>
        <Text style={[textStyles.Body_B14_Regular, { color: TEXT.secondary }]}>{children}</Text>
      </View>
      <Pressable onPress={onRetry} style={{ alignSelf: "flex-start" }}>
        <Text
          style={[
            textStyles.Body_B14_SemiBold,
            { color: TEXT.action, textDecorationLine: Platform.OS === "web" ? "underline" : "none" },
          ]}
        >
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
