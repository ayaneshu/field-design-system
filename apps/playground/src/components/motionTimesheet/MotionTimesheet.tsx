import { useState } from "react";
import { Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Line, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { useShell } from "../../theme/ThemeContext";
import type {
  MotionTimesheetProps,
  MotionTimesheetRowModel,
  MotionTimesheetTokenRow,
} from "./types";

const LABEL_W = 118;
/** Token column grows with layout but stays readable on narrow viewports. */
const TOKEN_COL_MIN_W = 200;
/** Timeline track minimum width before layout measures the flex slot. */
const TRACK_MIN_LAYOUT_W = 160;
/** Table column flex share vs timeline row (chart expands with remaining width). */
const TOKEN_COL_FLEX = 1;
const TIMELINE_ROW_FLEX = 2;
const ROW_H = 60;
const AXIS_H = 40;
const ROW_INSET_Y = 8;
/** Insets caption RN text from SVG bar edges + spine strip so glyphs are not clipped. */
const BAR_CAPTION_PAD_X = space["12"];

/** Stock explanation of **`u`** — used when `progressDriverNote` is omitted on `MotionTimesheet`. */
export const DEFAULT_PROGRESS_DRIVER_NOTE =
  "u is normalized progress for this interaction: 0 at the starting pose and 1 at the ending pose. In code it matches the animated value driven by withTiming (or equivalent)—often named progress and shared across interpolators. Duration and easing tokens control how u advances on the clock (milliseconds). Captions such as linear·u mean that property maps linearly to u while u runs; temporal easing shapes how quickly those changes read on screen, not necessarily the mapping curve in u-space.";

function MotionTimesheetTokenTable({ rows }: { rows: MotionTimesheetTokenRow[] }) {
  const shell = useShell();
  const cellPad = {
    paddingVertical: space["8"],
    paddingHorizontal: space["10"],
  };

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: shell.border,
        borderRadius: radius["8"],
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: shell.border,
          backgroundColor: shell.sidebarBg,
          ...cellPad,
        }}
      >
        <Text style={[textStyles.Body_B11_SemiBold, { flex: 1.15, color: shell.textSecondary }]}>
          Element · property
        </Text>
        <Text style={[textStyles.Body_B11_SemiBold, { flex: 1, color: shell.textSecondary }]}>
          Token
        </Text>
      </View>
      {rows.map((row, i) => (
        <View
          key={`${row.appliedTo}-${i}`}
          style={{
            flexDirection: "row",
            borderBottomWidth: i < rows.length - 1 ? 1 : 0,
            borderColor: shell.border,
            ...cellPad,
          }}
        >
          <Text style={[textStyles.Body_B11_Regular, { flex: 1.15, color: shell.textPrimary }]}>
            {row.appliedTo}
          </Text>
          <Text style={[textStyles.Body_B11_Regular, { flex: 1, color: shell.textTertiary }]}>
            {row.token}
          </Text>
        </View>
      ))}
    </View>
  );
}

function computeAxisCeil(
  rows: MotionTimesheetRowModel[],
  axisMaxMs: number,
  tickMs: number,
): number {
  const maxEnd = Math.max(axisMaxMs, ...rows.map((r) => r.endMs), tickMs);
  return Math.ceil(maxEnd / tickMs) * tickMs;
}

export function MotionTimesheet({
  heading,
  intro,
  tokenRows,
  tokenSummary,
  progressDriverNote,
  axisMaxMs,
  tickMs = 100,
  rows,
}: MotionTimesheetProps) {
  const shell = useShell();
  const axisCeil = computeAxisCeil(rows, axisMaxMs, tickMs);
  const [trackPx, setTrackPx] = useState(320);

  const gridH = rows.length * ROW_H;
  const totalH = gridH + AXIS_H;

  const msToX = (ms: number) =>
    Math.max(0, Math.min(trackPx, (ms / axisCeil) * trackPx));

  const tickPositions: number[] = [];
  for (let t = 0; t <= axisCeil; t += tickMs) tickPositions.push(t);

  const spine = colour.surface["supermall-bold"];
  const barBase = colour.surface["action-bold"];
  const rampTop = colour.surface["action-extrabold"];

  const hasTokenBlock =
    (tokenRows?.length ?? 0) > 0 || (tokenSummary !== undefined && tokenSummary.length > 0);

  const resolvedDriverNote =
    progressDriverNote === undefined
      ? DEFAULT_PROGRESS_DRIVER_NOTE
      : progressDriverNote.length > 0
        ? progressDriverNote
        : null;

  return (
    <View style={{ gap: space["16"], width: "100%", alignSelf: "stretch" }}>
      <Text style={[textStyles.Heading_H28_Bold, { color: shell.textPrimary }]}>
        {heading}
      </Text>
      {intro ? (
        <Text style={[textStyles.Body_B14_Regular, { color: shell.textTertiary }]}>
          {intro}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: space["16"],
          width: "100%",
        }}
      >
        {hasTokenBlock ? (
          <View
            style={{
              flex: TOKEN_COL_FLEX,
              minWidth: TOKEN_COL_MIN_W,
              flexShrink: 1,
              gap: space["12"],
            }}
          >
            {tokenRows?.length ? (
              <MotionTimesheetTokenTable rows={tokenRows} />
            ) : tokenSummary ? (
              <Text style={[textStyles.Body_B12_Regular, { color: shell.textTertiary, lineHeight: 18 }]}>
                <Text style={[textStyles.Body_B12_SemiBold, { color: shell.textSecondary }]}>
                  Tokens ·{" "}
                </Text>
                {tokenSummary}
              </Text>
            ) : null}
            {resolvedDriverNote ? (
              <View style={{ gap: space["6"] }}>
                <Text style={[textStyles.Body_B12_SemiBold, { color: shell.textSecondary }]}>
                  Motion driver · u
                </Text>
                <Text
                  style={[textStyles.Body_B12_Regular, { color: shell.textTertiary, lineHeight: 18 }]}
                >
                  {resolvedDriverNote}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View
          style={{
            flex: TIMELINE_ROW_FLEX,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: space["12"],
            minWidth: 0,
          }}
        >
        <View style={{ width: LABEL_W, paddingTop: 0 }}>
          {rows.map((row) => (
            <View
              key={`${row.label}-${row.startMs}`}
              style={{
                height: ROW_H,
                justifyContent: "center",
                paddingRight: space["12"],
              }}
            >
              <Text
                numberOfLines={2}
                style={[
                  textStyles.Body_B12_SemiBold,
                  {
                    color: shell.textSecondary,
                    textAlign: "right",
                    lineHeight: 16,
                  },
                ]}
              >
                {row.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, minWidth: TRACK_MIN_LAYOUT_W }}>
          <View
            style={{ alignSelf: "stretch", width: "100%" }}
            onLayout={(e: LayoutChangeEvent) => {
              const w = e.nativeEvent.layout.width;
              const next = Math.max(w, TRACK_MIN_LAYOUT_W);
              if (next > 0 && Math.abs(next - trackPx) > 0.5) setTrackPx(next);
            }}
          >
            <Svg width={trackPx} height={totalH}>
              {tickPositions.map((t) => {
                const x = msToX(t);
                return (
                  <Line
                    key={`g-${t}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={gridH}
                    stroke={shell.border}
                    strokeOpacity={t === 0 ? 0.75 : 0.45}
                    strokeWidth={1}
                  />
                );
              })}

              {rows.flatMap((row, i) => {
                const y0 = i * ROW_H + ROW_INSET_Y;
                const barH = ROW_H - ROW_INSET_Y * 2;
                const sx0 = msToX(row.startMs);
                const sx1 = msToX(row.endMs);
                const bw = Math.max(sx1 - sx0, 4);
                const k = `${row.label}-${i}`;
                const out = [
                  <Rect
                    key={`bg-${k}`}
                    x={sx0}
                    y={y0}
                    width={bw}
                    height={barH}
                    rx={6}
                    fill={barBase}
                    opacity={
                      row.barKind === "linearRamp" || row.barKind === "peakRamp" ? 0.22 : 0.38
                    }
                  />,
                ];
                if (row.barKind === "linearRamp") {
                  out.push(
                    <Polygon
                      key={`ram-${k}`}
                      points={`${sx0},${y0 + barH} ${sx1},${y0 + barH} ${sx1},${y0 + 4}`}
                      fill={rampTop}
                      fillOpacity={0.52}
                    />,
                  );
                }
                if (row.barKind === "peakRamp") {
                  const mid = sx0 + bw / 2;
                  out.push(
                    <Polygon
                      key={`pk-${k}`}
                      points={`${sx0},${y0 + barH} ${sx1},${y0 + barH} ${mid},${y0 + 4}`}
                      fill={rampTop}
                      fillOpacity={0.52}
                    />,
                  );
                }
                out.push(
                  <Line
                    key={`sp-${k}`}
                    x1={sx0 + 2}
                    y1={y0}
                    x2={sx0 + 2}
                    y2={y0 + barH}
                    stroke={spine}
                    strokeWidth={4}
                  />,
                );
                return out;
              })}

              <Line x1={0} y1={gridH} x2={trackPx} y2={gridH} stroke={shell.border} strokeWidth={1.2} />

              {tickPositions.map((t) => (
                <Line
                  key={`tk-${t}`}
                  x1={msToX(t)}
                  y1={gridH}
                  x2={msToX(t)}
                  y2={gridH + 7}
                  stroke={shell.border}
                  strokeWidth={1}
                />
              ))}

              {tickPositions.map((t) => (
                <SvgText
                  key={`lb-${t}`}
                  fill={shell.textSecondary}
                  fontFamily="system-ui , -apple-system, sans-serif"
                  fontSize={11}
                  x={Math.min(msToX(t), trackPx - 20)}
                  y={gridH + 24}
                  opacity={1}
                >
                  {`${t}`}
                </SvgText>
              ))}
              <SvgText
                fill={shell.textTertiary}
                fontFamily="system-ui , -apple-system, sans-serif"
                fontSize={10}
                x={Math.max(trackPx - 42, msToX(axisCeil) - 38)}
                y={gridH + AXIS_H - 8}
              >
                ms
              </SvgText>
            </Svg>

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                width: trackPx,
                height: gridH,
                top: 0,
              }}
            >
              {rows.map((row, i) => {
                const leftPct = (row.startMs / axisCeil) * 100;
                const widePct = ((row.endMs - row.startMs) / axisCeil) * 100;
                const top = i * ROW_H + ROW_INSET_Y + 6;
                return (
                  <View
                    key={`cap-${row.label}-${row.startMs}`}
                    style={{
                      position: "absolute",
                      left: `${leftPct}%` as `${number}%`,
                      width: `${Math.min(Math.max(widePct, 6), 100)}%` as `${number}%`,
                      top,
                      maxHeight: ROW_H - ROW_INSET_Y * 2 - 10,
                      paddingLeft: BAR_CAPTION_PAD_X,
                      paddingRight: space["8"],
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={[
                        textStyles.Body_B11_Regular,
                        {
                          color: spine,
                          fontWeight: "500",
                          lineHeight: 14,
                        },
                      ]}
                    >
                      {row.caption}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
  );
}
