import { Pressable, Text, View } from "react-native";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { useShell } from "../theme/ThemeContext";

type SpaceKey = keyof typeof space;

// Stable, design-meaningful order for the positive scale. Negative tokens
// are surfaced in their own row at the bottom.
const POSITIVE_KEYS: SpaceKey[] = [
  "0",
  "1",
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
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
];

const NEGATIVE_KEYS: SpaceKey[] = ["-2", "-4", "-6", "-8", "-12"];

// Visualisation runs are capped at the largest positive value so the
// largest tokens still fit comfortably into the column.
const MAX_VISUAL_PX = 256;

export function SpacingContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const shell = useShell();

  return (
    <View>
      {/* Subtitle — typography mirrors the component-page subtitle on
          accordion / checkbox / bottom-nav: Body B16 Regular, tertiary
          ink, capped at ~640px so it doesn't run wide. */}
      <Text
        style={[
          textStyles.B16_Regular,
          {
            color: shell.textTertiary,
            maxWidth: 640,
            marginTop: space["16"],
          },
        ]}
      >
        A 4-pixel-aligned scale that drives layout, padding and gaps across
        every component. Tap any token to copy{" "}
        <Text
          style={[
            textStyles.B16_SemiBold,
            { color: shell.textSecondary },
          ]}
        >
          space.&lt;n&gt;
        </Text>
        .
      </Text>

      {/* Positive scale */}
      <Section heading="Scale">
        <ColumnHeaders />
        <View>
          {POSITIVE_KEYS.map((key, i) => (
            <SpaceRow
              key={key}
              tokenKey={key}
              isFirst={i === 0}
              onCopy={copy}
            />
          ))}
        </View>
      </Section>

      {/* Negative scale */}
      <Section heading="Negative tokens">
        <Text
          style={[
            textStyles.B14_Regular,
            {
              color: shell.textTertiary,
              marginBottom: space["20"],
              maxWidth: 640,
            },
          ]}
        >
          Used for inset shadows, optical alignment, and pulling adjacent
          elements together.
        </Text>
        <ColumnHeaders />
        <View>
          {NEGATIVE_KEYS.map((key, i) => (
            <SpaceRow
              key={key}
              tokenKey={key}
              isFirst={i === 0}
              onCopy={copy}
            />
          ))}
        </View>
      </Section>
    </View>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  const shell = useShell();
  return (
    <View style={{ marginTop: space["56"] }}>
      <Text
        style={[
          textStyles.H24_Bold,
          { color: shell.textPrimary, marginBottom: space["24"] },
        ]}
      >
        {heading}
      </Text>
      {children}
    </View>
  );
}

function ColumnHeaders() {
  const shell = useShell();
  const headerStyle = [
    textStyles.B11_SemiBold,
    {
      color: shell.textTertiary,
      textTransform: "uppercase" as const,
      letterSpacing: 1.4,
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
      <Text style={[...headerStyle, { width: 160 }]}>Token</Text>
      <Text style={[...headerStyle, { width: 120 }]}>Value</Text>
      <Text style={headerStyle}>Visualisation</Text>
    </View>
  );
}

function SpaceRow({
  tokenKey,
  isFirst,
  onCopy,
}: {
  tokenKey: SpaceKey;
  isFirst: boolean;
  onCopy: (text: string, label?: string) => void;
}) {
  const shell = useShell();
  const value = space[tokenKey];
  const visualPx = Math.min(MAX_VISUAL_PX, Math.abs(value));
  const tokenLiteral = `space["${tokenKey}"]`;

  return (
    <Pressable
      onPress={() => onCopy(tokenLiteral, `space.${tokenKey}`)}
      accessibilityRole="button"
      accessibilityLabel={`Copy ${tokenLiteral}`}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: space["20"],
        paddingHorizontal: space["8"],
        marginHorizontal: -space["8"],
        borderRadius: radius["8"],
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: shell.border,
        backgroundColor: hovered ? shell.sidebarRowHoverBg : "transparent",
        opacity: pressed ? 0.85 : 1,
        // @ts-expect-error rn-web passes CSS transition props through
        transitionProperty: "background-color",
        transitionDuration: "150ms",
        transitionTimingFunction: "ease-out",
      })}
    >
      <Text
        style={[
          textStyles.H16_Bold,
          {
            color: shell.textPrimary,
            width: 160,
            fontVariant: ["tabular-nums"],
          },
        ]}
      >
        {tokenKey}
      </Text>
      <Text
        style={[
          textStyles.B14_Regular,
          {
            color: shell.textSecondary,
            width: 120,
            fontVariant: ["tabular-nums"],
          },
        ]}
      >
        {value}px
      </Text>
      <View
        style={{
          flex: 1,
          height: 32,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: visualPx,
            height: 10,
            borderRadius: radius["2"],
            backgroundColor:
              value < 0
                ? colour["text-n-icon"].error
                : colour["text-n-icon"].action,
            opacity: value === 0 ? 0.18 : 1,
          }}
        />
      </View>
    </Pressable>
  );
}
