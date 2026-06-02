import { useEffect, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

export type HeroPattern = "dots" | "grid" | "rings" | "waves" | "diagonals";

const HERO_HEIGHT = 320;

/**
 * Spacious page hero with a subtle, slowly animated background pattern.
 * Patterns are SVG-based and tinted from `colour["text-n-icon"].primary` so they
 * stay readable on `colour.surface.primary` without ever competing with content.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  pattern,
  onBack,
  rightSlot,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  pattern: HeroPattern;
  onBack?: () => void;
  rightSlot?: ReactNode;
}) {
  return (
    <View
      style={{
        position: "relative",
        height: HERO_HEIGHT,
        overflow: "hidden",
        backgroundColor: colour.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: colour.border.subtle,
      }}
    >
      {/* Animated pattern layer */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <PatternLayer pattern={pattern} />
      </View>

      {/* Soft gradient wash so text always wins over pattern */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="heroWash" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colour.surface.primary} stopOpacity="0.4" />
              <Stop offset="1" stopColor={colour.surface.primary} stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#heroWash)" />
        </Svg>
      </View>

      {/* Foreground content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: space["20"],
          paddingTop: space["20"],
          paddingBottom: space["28"],
          maxWidth: 1040,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {/* Top row — back nav + right slot */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: radius.rounded,
                backgroundColor: colour.surface.primary,
                borderWidth: 1,
                borderColor: colour.border.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Icon name="system-arrow-left" size={18} color={colour["text-n-icon"].primary} />
            </Pressable>
          ) : (
            <View style={{ width: 40, height: 40 }} />
          )}
          {rightSlot ?? <View />}
        </View>

        {/* Title block — bottom-aligned, generous lower-third */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["10"],
              marginBottom: space["12"],
            }}
          >
            <View
              style={{
                width: 24,
                height: 3,
                borderRadius: 2,
                backgroundColor: colour["text-n-icon"].primary,
              }}
            />
            <View
              style={{
                width: 12,
                height: 3,
                borderRadius: 2,
                backgroundColor: colour.surface["brand-primary"],
              }}
            />
            <Text
              style={[
                textStyles.B11_SemiBold,
                {
                  color: colour["text-n-icon"].tertiary,
                  textTransform: "uppercase",
                  letterSpacing: 1.6,
                  marginLeft: space["4"],
                },
              ]}
            >
              {eyebrow}
            </Text>
          </View>
          <Text
            style={[
              textStyles.H32_Bold,
              { color: colour["text-n-icon"].primary, fontSize: 44, lineHeight: 48 },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                textStyles.B16_Regular,
                {
                  color: colour["text-n-icon"].secondary,
                  marginTop: space["10"],
                  maxWidth: 560,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ─────────── Pattern layer ───────────

function PatternLayer({ pattern }: { pattern: HeroPattern }) {
  switch (pattern) {
    case "dots":
      return <DotsPattern />;
    case "grid":
      return <GridPattern />;
    case "rings":
      return <RingsPattern />;
    case "waves":
      return <WavesPattern />;
    case "diagonals":
      return <DiagonalsPattern />;
  }
}

const PATTERN_TINT = colour["text-n-icon"].primary;

/** Slow horizontal drift — used by every pattern for life without distraction. */
function useDrift(distance = 32, duration = 14000) {
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withRepeat(
      withTiming(distance, { duration, easing: Easing.linear }),
      -1,
      true,
    );
    return () => cancelAnimation(x);
  }, [distance, duration, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return style;
}

function DotsPattern() {
  const drift = useDrift(24, 16000);
  // Small indigo dots in a generous grid — Polestar-style negative space.
  const cols = 24;
  const rows = 8;
  const cell = 32;
  const w = cols * cell;
  const h = rows * cell;
  return (
    <Animated.View
      style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, drift]}
    >
      <Svg width={w + cell} height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        <G opacity={0.08}>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => (
              <Circle
                key={`${r}-${c}`}
                cx={c * cell + cell / 2}
                cy={r * cell + cell / 2}
                r={1.4}
                fill={PATTERN_TINT}
              />
            )),
          )}
        </G>
      </Svg>
    </Animated.View>
  );
}

function GridPattern() {
  const drift = useDrift(40, 20000);
  const size = 56;
  const w = size * 24;
  const h = size * 8;
  return (
    <Animated.View
      style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, drift]}
    >
      <Svg width={w + size} height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        <G opacity={0.06} stroke={PATTERN_TINT} strokeWidth={1}>
          {Array.from({ length: Math.ceil(w / size) + 1 }).map((_, i) => (
            <Line key={`v-${i}`} x1={i * size} y1={0} x2={i * size} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / size) + 1 }).map((_, i) => (
            <Line key={`h-${i}`} x1={0} y1={i * size} x2={w} y2={i * size} />
          ))}
        </G>
        {/* Accent crosses on every 3rd intersection */}
        <G opacity={0.18} stroke={PATTERN_TINT} strokeWidth={1.4}>
          {Array.from({ length: 9 }).map((_, ci) =>
            Array.from({ length: 4 }).map((_, ri) => {
              const cx = (ci * 3 + 1) * size;
              const cy = (ri * 2 + 1) * size;
              return (
                <G key={`x-${ci}-${ri}`}>
                  <Line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} />
                  <Line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} />
                </G>
              );
            }),
          )}
        </G>
      </Svg>
    </Animated.View>
  );
}

function RingsPattern() {
  const drift = useDrift(36, 22000);
  // Concentric rings — feels like Opal's ambient halo without the bling.
  return (
    <Animated.View
      style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, drift]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice">
        <G opacity={0.1} stroke={PATTERN_TINT} fill="none" strokeWidth={1}>
          {[60, 120, 180, 240, 300, 360, 420].map((r) => (
            <Circle key={`l-${r}`} cx={120} cy={400} r={r} />
          ))}
          {[60, 120, 180, 240, 300, 360, 420, 480].map((r) => (
            <Circle key={`r-${r}`} cx={1080} cy={-80} r={r} />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
}

function WavesPattern() {
  const drift = useDrift(60, 18000);
  // Soft layered waves — Tesla-quiet, signals "type & rhythm".
  const wavePath = (yOffset: number, amp: number) => {
    const points: string[] = [];
    const w = 1400;
    const steps = 56;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * w;
      const y = yOffset + Math.sin((i / steps) * Math.PI * 4) * amp;
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(" ");
  };
  return (
    <Animated.View
      style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, drift]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 1400 320" preserveAspectRatio="xMidYMid slice">
        <G opacity={0.12} stroke={PATTERN_TINT} fill="none" strokeWidth={1.2}>
          {[80, 140, 200, 260].map((y, i) => (
            <Path key={i} d={wavePath(y, 14 + i * 4)} />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
}

function DiagonalsPattern() {
  const drift = useDrift(48, 18000);
  // Diagonal hatch — Chime/Polestar-style understated motion.
  return (
    <Animated.View
      style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, drift]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 1400 320" preserveAspectRatio="xMidYMid slice">
        <G opacity={0.07} stroke={PATTERN_TINT} strokeWidth={1}>
          {Array.from({ length: 60 }).map((_, i) => (
            <Line
              key={i}
              x1={i * 28 - 320}
              y1={-40}
              x2={i * 28 + 80}
              y2={360}
            />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
}
