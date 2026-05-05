import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import { colour, radius, space } from "@field-ds/tokens";

import { TopHeader } from "../components/TopHeader";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Entry = {
  key: keyof RootStackParamList;
  title: string;
  blurb: string;
};

const ENTRIES: Entry[] = [
  {
    key: "Foundations",
    title: "Foundations",
    blurb: "The Building Blocks of Design Systems",
  },
  {
    key: "Components",
    title: "Components",
    blurb: "Key Components in Design System Architecture",
  },
  {
    key: "Patterns",
    title: "Patterns",
    blurb: "Essential Elements for Effective Design",
  },
];

const SPLIT_BREAKPOINT = 960;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const splitLayout = width >= SPLIT_BREAKPOINT;
  // Responsive paddings — desktop / iPad / mobile.
  const horizontalPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const verticalPad = width >= 1100 ? 60 : width >= 720 ? 40 : 28;
  const stackGap = width >= 1100 ? 60 : width >= 720 ? 40 : 32;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000000" }}
      contentContainerStyle={{
        minHeight: "100%" as never,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TopHeader variant="dark" active={null} />

        {/* Main split panel */}
        <View
          pointerEvents="box-none"
          style={{
            flexDirection: splitLayout ? "row" : "column",
            paddingHorizontal: horizontalPad,
            paddingVertical: verticalPad,
            gap: stackGap,
            alignItems: splitLayout ? "center" : "stretch",
            minHeight: splitLayout ? 822 : undefined,
            // @ts-expect-error zIndex on web
            zIndex: 2,
            position: "relative",
          }}
        >
          {/* Left — title + version */}
          <View
            pointerEvents="box-none"
            style={{
              flex: 1,
              minWidth: 0,
              justifyContent: "center",
              gap: space["48"],
            }}
          >
            <View pointerEvents="none">
              <BigTitle line="field" tone="solid" width={width} />
              <BigTitle line="design" tone="muted" width={width} />
              <BigTitle line="system" tone="muted" width={width} />
            </View>

            {/* Version + horizontal rule */}
            <View
              pointerEvents="none"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 13,
                paddingLeft: 6,
                maxWidth: 459,
              }}
            >
              <Text
                style={{
                  fontFamily: "Noontree-Medium",
                  fontSize: 16,
                  lineHeight: 20,
                  letterSpacing: -0.15,
                  color: "rgba(232,236,245,0.85)",
                }}
              >
                V 0.1
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(232,236,245,0.18)",
                }}
              />
            </View>
          </View>

          {/* Right — white rounded menu card */}
          <View
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: colour.surface.primary,
              borderRadius: width >= 720 ? 40 : 28,
              paddingVertical: width >= 720 ? space["24"] : space["12"],
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            {ENTRIES.map((entry, i) => (
              <View key={entry.key}>
                <EntryRow
                  entry={entry}
                  width={width}
                  onPress={() => navigation.navigate(entry.key as never)}
                />
                {i < ENTRIES.length - 1 ? (
                  <View
                    style={{
                      marginHorizontal: width >= 720 ? 48 : 24,
                      height: 1,
                      backgroundColor: colour.border.subtle,
                    }}
                  />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View
          pointerEvents="none"
          style={{
            flexDirection: width >= 720 ? "row" : "column",
            justifyContent: "space-between",
            alignItems: width >= 720 ? "center" : "flex-start",
            gap: width >= 720 ? 0 : 4,
            paddingHorizontal: horizontalPad,
            paddingBottom: width >= 1100 ? 48 : 28,
            paddingTop: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Noontree-Medium",
              fontSize: width >= 720 ? 16 : 13,
              lineHeight: width >= 720 ? 20 : 18,
              letterSpacing: -0.15,
              color: "rgba(232,236,245,0.55)",
            }}
          >
            One source of truth from Figma to React Native
          </Text>
          <Text
            style={{
              fontFamily: "Noontree-Medium",
              fontSize: width >= 720 ? 16 : 13,
              lineHeight: width >= 720 ? 20 : 18,
              letterSpacing: -0.15,
              color: "rgba(232,236,245,0.55)",
            }}
          >
            curated by noon
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}


function BigTitle({
  line,
  tone,
  width,
}: {
  line: string;
  tone: "solid" | "muted";
  width: number;
}) {
  // Scale the 140px Figma title down for narrower viewports.
  const fontSize =
    width >= 1280 ? 140 : width >= 960 ? 120 : width >= 640 ? 96 : 64;
  const tracking =
    width >= 1280 ? -5.6 : width >= 960 ? -4.8 : width >= 640 ? -3.6 : -2.4;
  return (
    <Text
      style={{
        fontFamily: "Noontree-SemiBold",
        fontSize,
        lineHeight: fontSize * 0.9,
        letterSpacing: tracking,
        color: tone === "solid" ? "#f4f6fb" : "rgba(232,236,245,0.32)",
      }}
    >
      {line}
    </Text>
  );
}

function EntryRow({
  entry,
  width,
  onPress,
}: {
  entry: Entry;
  width: number;
  onPress: () => void;
}) {
  const desktop = width >= 1100;
  const tablet = width >= 720 && width < 1100;
  const padBlock = desktop ? 48 : tablet ? 32 : 22;
  const padInline = desktop ? 48 : tablet ? 28 : 22;
  const titleSize = desktop ? 40 : tablet ? 32 : 26;
  const titleLine = desktop ? 48 : tablet ? 38 : 32;
  const blurbSize = desktop ? 16 : 14;
  const blurbLine = desktop ? 20 : 18;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={entry.title}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: desktop ? space["24"] : space["12"],
        paddingVertical: padBlock,
        paddingHorizontal: padInline,
        marginHorizontal: desktop ? 12 : 6,
        backgroundColor: hovered ? colour.surface.secondary : "transparent",
        borderRadius: radius["24"],
        opacity: pressed ? 0.85 : 1,
        transform: [{ translateX: hovered ? 6 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "background-color, transform",
        transitionDuration: "260ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      <View style={{ flex: 1, gap: desktop ? 16 : 8, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            fontSize: titleSize,
            lineHeight: titleLine,
            letterSpacing: -0.25,
            color: colour["text-n-icon"].primary,
          }}
        >
          {entry.title}
        </Text>
        <Text
          style={{
            fontFamily: "Noontree-Medium",
            fontSize: blurbSize,
            lineHeight: blurbLine,
            letterSpacing: -0.15,
            color: "rgba(0,0,0,0.5)",
          }}
        >
          {entry.blurb}
        </Text>
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name="system-arrow-right"
          size={24}
          color={colour["text-n-icon"].primary}
        />
      </View>
    </Pressable>
  );
}
