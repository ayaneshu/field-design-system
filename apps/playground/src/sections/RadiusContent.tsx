import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { useShell } from "../theme/ThemeContext";

type RadiusKey = keyof typeof radius;

const ORDER: RadiusKey[] = [
  "0",
  "2",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "rounded",
];

const TILE_SIZE = 200;

export function RadiusContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const shell = useShell();
  const { width } = useWindowDimensions();
  // 4-up at desktop, scales down on narrower viewports.
  const cols = width >= 1280 ? 4 : width >= 960 ? 3 : width >= 640 ? 2 : 1;

  return (
    <View>
      {/* Subtitle — typography mirrors the component-page subtitle on
          accordion / checkbox / bottom-nav: Body B16 Regular, tertiary
          ink, capped at ~640px so it doesn't run wide. */}
      <Text
        style={[
          textStyles.Body_B16_Regular,
          {
            color: shell.textTertiary,
            maxWidth: 640,
            marginTop: space["16"],
          },
        ]}
      >
        Corner radii from sharp (0) to fully{" "}
        <Text
          style={[
            textStyles.Body_B16_SemiBold,
            { color: shell.textSecondary },
          ]}
        >
          rounded
        </Text>
        . The{" "}
        <Text
          style={[
            textStyles.Body_B16_SemiBold,
            { color: shell.textSecondary },
          ]}
        >
          rounded
        </Text>{" "}
        token resolves to a generous 9999px so any container ends up
        perfectly pill-shaped. Tap a tile to copy{" "}
        <Text
          style={[
            textStyles.Body_B16_SemiBold,
            { color: shell.textSecondary },
          ]}
        >
          radius.&lt;n&gt;
        </Text>
        .
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: space["32"],
          marginTop: space["48"],
        }}
      >
        {ORDER.map((key) => (
          <RadiusTile key={key} tokenKey={key} cols={cols} onCopy={copy} />
        ))}
      </View>
    </View>
  );
}

function RadiusTile({
  tokenKey,
  cols,
  onCopy,
}: {
  tokenKey: RadiusKey;
  cols: number;
  onCopy: (text: string, label?: string) => void;
}) {
  const shell = useShell();
  const value = radius[tokenKey];
  const tokenLiteral =
    tokenKey === "rounded" ? "radius.rounded" : `radius["${tokenKey}"]`;
  const valueLabel =
    tokenKey === "rounded" ? "rounded" : `${value}px`;

  // Cap the visual radius to half the tile so any value above that still
  // reads as "fully pill-shaped" — which is the correct visual result.
  const visualRadius = Math.min(value, TILE_SIZE / 2);

  return (
    <Pressable
      onPress={() => onCopy(tokenLiteral, `radius.${tokenKey}`)}
      accessibilityRole="button"
      accessibilityLabel={`Copy ${tokenLiteral}`}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexBasis: `calc((100% - ${(cols - 1) * 32}px) / ${cols})` as never,
        flexGrow: 0,
        flexShrink: 0,
        alignItems: "center",
        gap: space["16"],
        opacity: pressed ? 0.88 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      <View
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          // Outlined shape — heavier 2px stroke in the brand action ink so
          // the corner radius reads cleanly across the scale, even at the
          // sharp end.
          borderWidth: 2,
          borderColor: colour["text-n-icon"].action,
          borderRadius: visualRadius,
          backgroundColor: "transparent",
        }}
      />
      <View style={{ alignItems: "center" }}>
        <Text
          style={[
            textStyles.Heading_H16_Bold,
            {
              color: shell.textPrimary,
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {tokenKey}
        </Text>
        <Text
          style={[
            textStyles.Body_B12_Regular,
            {
              color: shell.textTertiary,
              fontVariant: ["tabular-nums"],
              marginTop: space["4"],
            },
          ]}
        >
          {valueLabel}
        </Text>
      </View>
    </Pressable>
  );
}
