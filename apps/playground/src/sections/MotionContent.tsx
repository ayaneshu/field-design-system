/**
 * Motion Foundations UI — data comes from `@field-ds/tokens` → `motion` (generated from
 * `packages/tokens/src/raw/semantic.json` under `"motion"`). Edit tokens there, then run
 * `pnpm --filter @field-ds/tokens build`; do not edit `packages/tokens/src/semantic.ts` by hand.
 * Spring presets use `$type: "springTF"` with `{ tension, friction }`; the build expands to
 * Reanimated stiffness/damping plus shared rest defaults.
 */
import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { approximateSpringSettleMs } from "@field-ds/components";
import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

import { useShell } from "../theme/ThemeContext";

// ─── column layout ───
/** Wide enough so `motion.duration.*` stays on one line (see Spacing foundations). */
const COL_TOKEN_W = 280;
const COL_VALUE_MIN = 216;
/** Space between token and value columns. */
const COL_INNER_GAP = space["16"];
/** Space before Preview column — keeps Value from collapsing into Preview. */
const COL_BEFORE_PREVIEW = space["16"];
const COL_VIZ_WIDTH = 152;
const COL_VIZ_HEIGHT = 52;
const ROW_PAD_V = space["18"];

const STANDARD_EASE = Easing.bezier(
  motion.easing.standard[0],
  motion.easing.standard[1],
  motion.easing.standard[2],
  motion.easing.standard[3],
);

/** Pause at the trail end before snap; motion time is exclusively the token's `ms`. */
const DURATION_PREVIEW_HOLD_AT_END_MS = 520;

function cssBezier(ctrl: readonly [number, number, number, number]) {
  return `cubic-bezier(${ctrl.join(", ")})`;
}

/** Cubic Bézier from (0,1) to (1,0) in normalized coords (y up = faster progress). */
function bezierEasePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  h: number,
  pad: number,
): string {
  const ax = pad;
  const ay = pad;
  const bx = w - pad;
  const by = h - pad;
  const innerW = bx - ax;
  const innerH = by - ay;
  const sx = (px: number) => ax + px * innerW;
  const sy = (py: number) => ay + (1 - py) * innerH;
  const p0 = `M ${sx(0)} ${sy(0)}`;
  const p1 = `C ${sx(x1)} ${sy(y1)} ${sx(x2)} ${sy(y2)} ${sx(1)} ${sy(1)}`;
  return `${p0} ${p1}`;
}

function BezierSparkline({
  ctrl,
}: {
  ctrl: readonly [number, number, number, number];
}) {
  const w = COL_VIZ_WIDTH;
  const h = COL_VIZ_HEIGHT;
  const pad = 6;
  const [x1, y1, x2, y2] = ctrl;
  const d = bezierEasePath(x1, y1, x2, y2, w, h, pad);
  return (
    <Svg width={w} height={h}>
      <Line
        x1={pad}
        y1={h - pad}
        x2={w - pad}
        y2={pad}
        stroke={colour["text-n-icon"].muted}
        strokeWidth={1}
        strokeDasharray="3 4"
        opacity={0.45}
      />
      <Path d={d} stroke={colour.surface["action-extrabold"]} strokeWidth={1.75} fill="none" />
      <Circle cx={pad} cy={h - pad} r={2.25} fill={colour["text-n-icon"].tertiary} />
      <Circle cx={w - pad} cy={pad} r={2.25} fill={colour["text-n-icon"].tertiary} />
    </Svg>
  );
}

/** Timeline strip + upright cap at left so previews read as starting at translateX 0 each cycle. */
function PreviewTrackAxis({ trackPad, accent }: { trackPad: number; accent: string }) {
  const lineH = 2;
  return (
    <View
      style={{
        marginHorizontal: trackPad,
        marginBottom: trackPad / 2,
        height: 14,
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          height: lineH,
          borderRadius: 1,
          backgroundColor: colour["text-n-icon"].muted,
          opacity: 0.4,
        }}
      />
      <View
        accessibilityLabel="Start at left"
        style={{
          position: "absolute",
          left: 0,
          bottom: lineH,
          width: 3,
          height: 12,
          borderRadius: 1.5,
          backgroundColor: accent,
        }}
      />
    </View>
  );
}

/**
 * Knob sweeps left→right in exactly the row's duration token (`ms`); easing is linear so spacing
 * in time matches spacing in pixels. Holds, snaps back left, repeats — each row is on its own loop.
 */
function DurationPreviewLoop({ ms }: { ms: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: ms, easing: Easing.linear }),
        withDelay(DURATION_PREVIEW_HOLD_AT_END_MS, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [ms, progress]);

  const trackPad = 8;
  const knob = 11;
  const travel = Math.max(0, COL_VIZ_WIDTH - 2 * trackPad - knob);

  const knobStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: progress.value * travel }],
    }),
    [travel],
  );

  return (
    <View
      style={{
        width: COL_VIZ_WIDTH,
        height: COL_VIZ_HEIGHT,
      }}
      accessibilityLabel={`Animated preview, linear motion ${ms} ms`}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: trackPad,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "flex-start",
              bottom: 8,
              left: trackPad,
              width: knob,
              height: knob,
              borderRadius: knob / 2,
              backgroundColor: colour.surface["action-extrabold"],
              shadowColor: "#00000020",
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 3,
              shadowOpacity: 1,
              elevation: 2,
            },
            knobStyle,
          ]}
        />
      </View>
      <PreviewTrackAxis trackPad={trackPad} accent={colour.surface["action-extrabold"]} />
    </View>
  );
}

/** Fixed wall‑clock travel; easing follows the token’s Bézier (shape comparison across rows). */
const EASING_MOVE_MS = 640;
const EASING_CYCLE_MS = 940;
/** Pause at the settled end of the simulated spring curve before snapping the bead back to the start. */
const SPRING_HOLD_AT_END_MS = 220;

function EasingTravelLoop({
  ctrl,
}: {
  ctrl: readonly [number, number, number, number];
}) {
  const progress = useSharedValue(0);
  const easeFn = useMemo(
    () => Easing.bezier(ctrl[0], ctrl[1], ctrl[2], ctrl[3]),
    [ctrl],
  );

  useEffect(() => {
    const holdAtEndMs = Math.max(120, EASING_CYCLE_MS - EASING_MOVE_MS);
    progress.value = 0;
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: EASING_MOVE_MS, easing: easeFn }),
        withDelay(holdAtEndMs, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [easeFn, progress]);

  const trackPad = 8;
  const knob = 11;
  const travel = Math.max(0, COL_VIZ_WIDTH - 2 * trackPad - knob);
  const knobStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: progress.value * travel }] }),
    [travel],
  );

  return (
    <View style={{ width: COL_VIZ_WIDTH, height: COL_VIZ_HEIGHT }}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: trackPad,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "flex-start",
              bottom: 8,
              left: trackPad,
              width: knob,
              height: knob,
              borderRadius: knob / 2,
              backgroundColor: colour.surface["supermall-bold"],
              shadowColor: "#00000018",
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 3,
              shadowOpacity: 1,
              elevation: 2,
            },
            knobStyle,
          ]}
        />
      </View>
      <PreviewTrackAxis trackPad={trackPad} accent={colour.surface["supermall-bold"]} />
    </View>
  );
}

function sampleSpringDisplacement(
  stiffness: number,
  damping: number,
  mass: number,
): { t: number; x: number }[] {
  const dt = 1 / 90;
  let x = 0;
  let v = 0;
  const pts: { t: number; x: number }[] = [{ t: 0, x: 0 }];
  for (let i = 1; i <= 160; i++) {
    const t = i * dt;
    const a = (stiffness * (1 - x) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    pts.push({ t, x: Math.min(1.15, Math.max(0, x)) });
    if (t > 0.25 && x >= 0.998 && Math.abs(v) < 0.04) break;
  }
  return pts;
}

const SPRING_PLAYBACK_SAMPLES = 48;

function SpringSparkline({
  stiffness,
  damping,
  mass,
}: {
  stiffness: number;
  damping: number;
  mass: number;
}) {
  const w = COL_VIZ_WIDTH;
  const h = COL_VIZ_HEIGHT;
  const pad = 6;
  const knob = 9;

  const { pathD, playInput, px, py, moveMs } = useMemo(() => {
    const pts = sampleSpringDisplacement(stiffness, damping, mass);
    const tMax = Math.max(pts[pts.length - 1]?.t ?? 0.001, 0.001);
    const xMax = Math.max(...pts.map((p) => p.x), 1);
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;

    const pathD = pts
      .map((p, i) => {
        const sx = pad + (p.t / tMax) * innerW;
        const sy = pad + innerH - (p.x / xMax) * innerH;
        return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
      })
      .join(" ");

    const n = pts.length;
    const playInput: number[] = [];
    const px: number[] = [];
    const py: number[] = [];
    for (let s = 0; s < SPRING_PLAYBACK_SAMPLES; s++) {
      const u = s / (SPRING_PLAYBACK_SAMPLES - 1);
      playInput.push(u);
      const fi = u * (n - 1);
      const i0 = Math.floor(fi);
      const i1 = Math.min(n - 1, i0 + 1);
      const tt = fi - i0;
      const p0 = pts[i0];
      const p1 = pts[i1];
      const t = p0.t + (p1.t - p0.t) * tt;
      const x = p0.x + (p1.x - p0.x) * tt;
      px.push(pad + (t / tMax) * innerW);
      py.push(pad + innerH - (x / xMax) * innerH);
    }

    const moveMs = Math.min(2080, Math.max(620, Math.round(480 + tMax * 1480)));

    return { pathD, playInput, px, py, moveMs };
  }, [stiffness, damping, mass, h, pad, w]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: moveMs, easing: Easing.linear }),
        withDelay(SPRING_HOLD_AT_END_MS, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [moveMs, progress]);

  const knobAccent = colour.surface["action-extrabold"];

  const knobStyle = useAnimatedStyle(() => {
    const cx = interpolate(
      progress.value,
      playInput,
      px,
      Extrapolation.CLAMP,
    );
    const cy = interpolate(progress.value, playInput, py, Extrapolation.CLAMP);
    return {
      position: "absolute" as const,
      left: cx - knob / 2,
      top: cy - knob / 2,
      width: knob,
      height: knob,
      borderRadius: knob / 2,
    };
  }, [knob, playInput, px, py]);

  const knobShell = useMemo(
    () => ({
      backgroundColor: knobAccent,
      shadowColor: "#00000024",
      shadowOffset: { width: 0, height: 1 } as const,
      shadowRadius: 3,
      shadowOpacity: 1 as const,
      elevation: 2,
    }),
    [knobAccent],
  );

  return (
    <View
      style={{ width: w, height: h }}
      accessibilityLabel={`Spring curve preview — playback ${moveMs} ms`}
    >
      <Svg width={w} height={h}>
        <Line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke={colour["text-n-icon"].muted}
          strokeWidth={1}
          opacity={0.45}
        />
        <Path
          d={pathD}
          stroke={colour.surface["action-extrabold"]}
          strokeWidth={1.75}
          fill="none"
        />
      </Svg>
      <Animated.View style={[knobShell, knobStyle]} pointerEvents="none" />
    </View>
  );
}

function TableHeaderRow() {
  const shell = useShell();
  const headerStyle = [
    textStyles.B11_SemiBold,
    {
      color: shell.textTertiary,
      textTransform: "uppercase" as const,
      letterSpacing: 1.2,
    },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: space["12"],
        borderBottomWidth: 1,
        borderBottomColor: shell.border,
      }}
    >
      <Text style={[...headerStyle, { width: COL_TOKEN_W }]}>Token</Text>
      <Text style={[...headerStyle, { flex: 1, minWidth: COL_VALUE_MIN, paddingLeft: COL_INNER_GAP }]}>
        Value
      </Text>
      <Text style={[...headerStyle, { width: COL_VIZ_WIDTH, marginLeft: COL_BEFORE_PREVIEW }]}>
        Preview
      </Text>
    </View>
  );
}

function MotionDataRow({
  tokenLabel,
  valueNode,
  visual,
  onCopy,
  isFirst,
  narrow,
}: {
  tokenLabel: string;
  valueNode: ReactNode;
  visual: ReactNode;
  onCopy: () => void;
  isFirst: boolean;
  narrow: boolean;
}) {
  const shell = useShell();
  const content = (
    <>
      {!narrow ? (
        <Text
          style={[
            textStyles.H16_Bold,
            { color: shell.textPrimary, width: COL_TOKEN_W, flexShrink: 0, fontVariant: ["tabular-nums"] },
          ]}
          numberOfLines={1}
        >
          {tokenLabel}
        </Text>
      ) : null}
      <View
        style={{
          flex: 1,
          minWidth: COL_VALUE_MIN,
          paddingLeft: COL_INNER_GAP,
          paddingRight: space["8"],
          gap: narrow ? space["8"] : 0,
        }}
      >
        {narrow ? (
          <Text
            style={[textStyles.H16_Bold, { color: shell.textPrimary }]}
            numberOfLines={2}
          >
            {tokenLabel}
          </Text>
        ) : null}
        <View>{valueNode}</View>
      </View>
      <View
        style={{
          width: narrow ? undefined : COL_VIZ_WIDTH,
          marginLeft: narrow ? 0 : COL_BEFORE_PREVIEW,
          alignItems: narrow ? "flex-start" : "flex-end",
          marginTop: narrow ? space["8"] : 0,
        }}
      >
        {narrow ? (
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: shell.textTertiary,
                marginBottom: space["4"],
                letterSpacing: 0.8,
                textTransform: "uppercase",
              },
            ]}
          >
            Preview
          </Text>
        ) : null}
        {visual}
      </View>
    </>
  );

  return (
    <Pressable
      onPress={onCopy}
      accessibilityRole="button"
      accessibilityLabel={`Copy ${tokenLabel}`}
      style={({ pressed }) => ({
        flexDirection: narrow ? "column" : "row",
        alignItems: narrow ? "stretch" : "center",
        paddingVertical: ROW_PAD_V,
        paddingHorizontal: space["8"],
        marginHorizontal: -space["8"],
        borderRadius: radius["8"],
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: shell.border,
        backgroundColor: "transparent",
        opacity: pressed ? 0.82 : 1,
      })}
    >
      {content}
    </Pressable>
  );
}

function Section({
  heading,
  children,
  intro,
}: {
  heading: string;
  children: ReactNode;
  intro?: ReactNode;
}) {
  const shell = useShell();
  return (
    <View style={{ marginTop: space["48"] }}>
      <Text style={[textStyles.H24_Bold, { color: shell.textPrimary }]}>{heading}</Text>
      {intro}
      {children}
    </View>
  );
}


function LiveMotionDemo() {
  const shell = useShell();
  const x = useSharedValue(0);
  const bounce = useSharedValue(1);

  const boxStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }), [x]);
  const springBoxStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }), [bounce]);

  const triggerTiming = useCallback(() => {
    x.value = 0;
    x.value = withTiming(
      96,
      { duration: motion.duration.emphasized, easing: STANDARD_EASE },
      (finished) => {
        if (finished) x.value = withTiming(0, { duration: motion.duration.emphasized, easing: STANDARD_EASE });
      },
    );
  }, [x]);

  const triggerSpring = useCallback(() => {
    bounce.value = withSpring(0.88, motion.spring.snappy, (finished) => {
      if (finished) bounce.value = withSpring(1, motion.spring.interaction);
    });
  }, [bounce]);

  return (
    <View
      style={{
        marginTop: space["28"],
        padding: space["20"],
        borderRadius: radius["16"],
        backgroundColor: colour.surface.secondary,
        overflow: "hidden",
      }}
    >
      <Text style={[textStyles.B14_SemiBold, { color: shell.textPrimary }]}>
        Try the tokens
      </Text>
      <Text style={[textStyles.B12_Regular, { color: shell.textTertiary, marginTop: space["4"] }]}>
        Eased slide: motion.duration.emphasized × motion.easing.standard. Pop: motion.spring presets.
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: space["24"],
          marginTop: space["20"],
        }}
      >
        <View style={{ minWidth: 160 }}>
          <Pressable
            onPress={triggerTiming}
            accessibilityRole="button"
            accessibilityLabel="Run eased slide"
            style={{
              alignSelf: "flex-start",
              paddingVertical: space["10"],
              paddingHorizontal: space["16"],
              borderRadius: radius["rounded"],
              backgroundColor: colour.surface["action-bold"],
            }}
          >
            <Text style={[textStyles.B14_SemiBold, { color: colour.surface.primary }]}>
              Eased slide
            </Text>
          </Pressable>
          <View style={{ height: 48, justifyContent: "center", marginTop: space["12"] }}>
            <Animated.View
              style={[
                {
                  width: 28,
                  height: 28,
                  borderRadius: radius["8"],
                  backgroundColor: colour.surface["action-extrabold"],
                },
                boxStyle,
              ]}
            />
          </View>
        </View>
        <View style={{ minWidth: 120 }}>
          <Pressable
            onPress={triggerSpring}
            accessibilityRole="button"
            accessibilityLabel="Run spring pop"
            style={{
              alignSelf: "flex-start",
              paddingVertical: space["10"],
              paddingHorizontal: space["16"],
              borderRadius: radius["rounded"],
              backgroundColor: colour["text-n-icon"].secondary,
            }}
          >
            <Text style={[textStyles.B14_SemiBold, { color: colour.surface.primary }]}>
              Spring pop
            </Text>
          </Pressable>
          <View
            style={{
              alignItems: "center",
              marginTop: space["12"],
              height: 48,
              justifyContent: "center",
            }}
          >
            <Animated.View
              style={[
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colour.surface["yellow-bold"],
                },
                springBoxStyle,
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export function MotionContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const shell = useShell();
  const { width } = useWindowDimensions();
  const narrow = width < 720;

  const durationEntries = (
    Object.entries(motion.duration) as [keyof typeof motion.duration, number][]
  ).sort(([a], [b]) => String(a).localeCompare(String(b)));

  const delayEntries = (
    Object.entries(motion.delay) as [keyof typeof motion.delay, number][]
  ).sort(([a], [b]) => String(a).localeCompare(String(b)));

  const easingEntries = (
    Object.entries(motion.easing) as [
      keyof typeof motion.easing,
      readonly number[],
    ][]
  ).sort(([a], [b]) => String(a).localeCompare(String(b)));

  const springEntries = (
    Object.entries(motion.spring) as [keyof typeof motion.spring, (typeof motion.spring)["interaction"]][]
  ).sort(([a], [b]) => String(a).localeCompare(String(b)));

  const intro = (
    <Text
      style={[
        textStyles.B16_Regular,
        {
          color: shell.textTertiary,
          maxWidth: 640,
          marginTop: space["12"],
          marginBottom: space["24"],
        },
      ]}
    >
      In the <Text style={textStyles.B16_SemiBold}>Duration</Text> table, each preview runs for exactly
      that row&apos;s milliseconds: the knob crosses the track left→right in{" "}
      <Text style={textStyles.B16_SemiBold}>linear</Text> motion (constant speed), pauses (rest ~
      {(DURATION_PREVIEW_HOLD_AT_END_MS / 1000).toFixed(2)}s before each snap), then snaps back left and
      repeats. There is no shared wall clock tying rows together.
      {" "}
      Bézier presets map to CSS and{" "}
      <Text style={textStyles.B16_SemiBold}>Easing.bezier</Text>; springs map to{" "}
      <Text style={textStyles.B16_SemiBold}>withSpring</Text>. Tap a row to copy the token path.
      {narrow ? (
        <>
          {" "}
          Narrow view stacks token, value, then preview graph.
        </>
      ) : null}
    </Text>
  );

  const valueMuted = colour["text-n-icon"].secondary;

  return (
    <View>
      {intro}
      <LiveMotionDemo />

      <Section heading="Duration">
        {!narrow ? <TableHeaderRow /> : null}
        <View>
          {durationEntries.map(([k, ms], i) => (
            <MotionDataRow
              key={k}
              narrow={narrow}
              isFirst={i === 0}
              tokenLabel={`motion.duration.${String(k)}`}
              valueNode={
                <Text style={[textStyles.B14_Medium, { color: shell.textPrimary }]}>
                  {ms} ms
                </Text>
              }
              visual={
                <DurationPreviewLoop ms={ms} />
              }
              onCopy={() => copy(`motion.duration.${String(k)}`, `duration.${String(k)}`)}
            />
          ))}
        </View>
      </Section>

      <Section heading="Delay">
        {!narrow ? <TableHeaderRow /> : null}
        <View>
          {delayEntries.map(([k, ms], i) => (
            <MotionDataRow
              key={k}
              narrow={narrow}
              isFirst={i === 0}
              tokenLabel={`motion.delay.${String(k)}`}
              valueNode={
                <Text style={[textStyles.B14_Medium, { color: shell.textPrimary }]}>
                  {ms} ms
                </Text>
              }
              visual={<DurationPreviewLoop ms={ms} />}
              onCopy={() =>
                copy(`motion.delay.${String(k)}`, `delay.${String(k)}`)
              }
            />
          ))}
        </View>
      </Section>

      <Section heading="Cubic Bézier easing">
        {!narrow ? <TableHeaderRow /> : null}
        <View>
          {easingEntries.map(([name, ctrl], i) => {
            const tup = ctrl as readonly [number, number, number, number];
            return (
              <MotionDataRow
                key={name}
                narrow={narrow}
                isFirst={i === 0}
                tokenLabel={`motion.easing.${String(name)}`}
                valueNode={
                  <View style={{ gap: space["6"] }}>
                    <Text selectable style={[textStyles.B12_Regular, { color: valueMuted }]}>
                      {cssBezier(tup)}
                    </Text>
                    <Text selectable style={[textStyles.B12_Regular, { color: shell.textMuted }]}>
                      [{tup.join(", ")}]
                    </Text>
                  </View>
                }
                visual={
                  <View style={{ gap: space["6"], alignItems: "flex-end" }}>
                    <EasingTravelLoop ctrl={tup} />
                    <BezierSparkline ctrl={tup} />
                  </View>
                }
                onCopy={() => copy(`motion.easing.${String(name)}`, `easing.${String(name)}`)}
              />
            );
          })}
        </View>
      </Section>

      <Section heading="Spring">
        {!narrow ? <TableHeaderRow /> : null}
        <View>
          {springEntries.map(([name, cfg], i) => (
            <MotionDataRow
              key={name}
              narrow={narrow}
              isFirst={i === 0}
              tokenLabel={`motion.spring.${String(name)}`}
              valueNode={
                <View style={{ gap: space["6"] }}>
                  <Text
                    selectable
                    style={[textStyles.B12_Regular, { color: valueMuted }]}
                  >
                    {JSON.stringify(cfg)}
                  </Text>
                  <Text
                    selectable
                    style={[textStyles.B12_Regular, { color: shell.textMuted }]}
                  >
                    ~
                    {approximateSpringSettleMs({
                      stiffness: cfg.stiffness,
                      damping: cfg.damping,
                      mass: cfg.mass ?? 1,
                    })}{" "}
                    ms envelope settle (approx., ε = 1%)
                  </Text>
                </View>
              }
              visual={
                <SpringSparkline
                  stiffness={cfg.stiffness}
                  damping={cfg.damping}
                  mass={cfg.mass ?? 1}
                />
              }
              onCopy={() => copy(`motion.spring.${String(name)}`, `spring.${String(name)}`)}
            />
          ))}
        </View>
      </Section>

      <View style={{ marginTop: space["40"], paddingBottom: space["8"] }}>
        <Text style={[textStyles.H20_Bold, { color: shell.textPrimary, marginBottom: space["12"] }]}>
          Legend
        </Text>
        <Text style={[textStyles.B12_Regular, { color: shell.textMuted, maxWidth: 640 }]}>
          <Text style={textStyles.B12_SemiBold}>Duration</Text>: knobs align with the left cap;
          each sweep lasts exactly that token&apos;s milliseconds with{" "}
          <Text style={textStyles.B12_SemiBold}>linear</Text> timing, then rests ~
          {(DURATION_PREVIEW_HOLD_AT_END_MS / 1000).toFixed(2)}s and snaps left. Rows aren&apos;t phase-locked —
          timing differences are intentional.
          {"\n\n"}
          <Text style={textStyles.B12_SemiBold}>Easing</Text>: looping travel matches the same rhythm:
          fixed {EASING_MOVE_MS} ms left→right move with each row&apos;s cubic, hold, instant snap left
          (sparkline shows the easing curve shape).{" "}
          <Text style={textStyles.B12_SemiBold}>Spring</Text>: line follows a numerical damped path
          from the JSON (illustrative vs the Reanimated spring solver); a bead traces it over time, pauses
          ~{(SPRING_HOLD_AT_END_MS / 1000).toFixed(2)}s, then snaps back to the start. The{" "}
          <Text style={textStyles.B12_SemiBold}>~N ms envelope settle</Text> line uses a continuous
          mass–spring–damper estimate (amplitude → 1% of the step);{" "}
          <Text style={textStyles.B12_SemiBold}>withSpring</Text> itself stops on velocity/displacement
          thresholds, so treat it as documentation—not an exact runtime duration.
        </Text>
      </View>
    </View>
  );
}
