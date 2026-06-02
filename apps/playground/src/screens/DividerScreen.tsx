import { useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Divider,
  Switch as FieldSwitch,
  type DividerEmphasis,
  type DividerStyle,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Divider">;

const VARIANTS: DividerStyle[] = ["solid", "dashed"];
const EMPHASES: DividerEmphasis[] = ["low", "high"];

export function DividerScreen({ navigation }: Props) {
  const [variant, setVariant] = useState<DividerStyle>("solid");
  const [emphasis, setEmphasis] = useState<DividerEmphasis>("low");
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
  const [width, setWidth] = useState<"100%" | 240 | 160>("100%");

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ width: "100%", maxWidth: 360, alignItems: "center" }}>
        <Divider
          variant={variant}
          emphasis={emphasis}
          width={width}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        />
      </View>
    </PreviewSurface>
  );

  const variantsPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: "100%" }}>
        {VARIANTS.flatMap((v) =>
          EMPHASES.map((e) => (
            <View key={`${v}-${e}`} style={{ gap: space["8"] }}>
              <Text
                style={[
                  textStyles.B11_SemiBold,
                  {
                    color: colour["text-n-icon"].tertiary,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  },
                ]}
              >
                {v} · {e}
              </Text>
              <Divider variant={v} emphasis={e} />
            </View>
          )),
        )}
      </View>
    </PreviewSurface>
  );

  const paddingPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: "100%" }}>
        <View style={{ gap: space["8"] }}>
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              },
            ]}
          >
            paddingLeft 16, paddingRight 16
          </Text>
          <Divider paddingLeft={16} paddingRight={16} />
        </View>
        <View style={{ gap: space["8"] }}>
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              },
            ]}
          >
            paddingLeft 56 · aligned past leading icon
          </Text>
          <Divider paddingLeft={56} />
        </View>
      </View>
    </PreviewSurface>
  );

  const listRowPreview = (
    <PreviewSurface>
      <View style={{ width: "100%" }}>
        {["Same-day delivery", "Express delivery", "Standard delivery"].map(
          (label, i, arr) => (
            <View key={label}>
              <View style={{ paddingVertical: space["12"] }}>
                <Text
                  style={[
                    textStyles.B14_Medium,
                    { color: colour["text-n-icon"].primary },
                  ]}
                >
                  {label}
                </Text>
              </View>
              {i < arr.length - 1 && <Divider />}
            </View>
          ),
        )}
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="divider"
      subtitle="Horizontal hairline used to separate content into distinct sections. Two styles (solid / dashed) and two emphasis levels (low / high). Width and left/right padding are configurable so it can fill a page or sit inset within a list row."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Divider/Divider.tsx"
      sidebar={componentsSidebar("Divider")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Style</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<DividerStyle>
                options={VARIANTS.map((v) => ({ value: v, label: v }))}
                value={variant}
                onChange={setVariant}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Emphasis</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<DividerEmphasis>
                options={EMPHASES.map((e) => ({ value: e, label: e }))}
                value={emphasis}
                onChange={setEmphasis}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Width</PropLabel>
            <View style={{ minWidth: 260 }}>
              <FieldSwitch<"100%" | 240 | 160>
                options={[
                  { value: "100%", label: "100%" },
                  { value: 240, label: "240px" },
                  { value: 160, label: "160px" },
                ]}
                value={width}
                onChange={(v) => setWidth(v)}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Padding L</PropLabel>
            <View style={{ minWidth: 260 }}>
              <FieldSwitch<0 | 16 | 32 | 56>
                options={[
                  { value: 0, label: "0" },
                  { value: 16, label: "16" },
                  { value: 32, label: "32" },
                  { value: 56, label: "56" },
                ]}
                value={paddingLeft as 0 | 16 | 32 | 56}
                onChange={setPaddingLeft}
              />
            </View>
          </PropRow>
          <PropRow last>
            <PropLabel>Padding R</PropLabel>
            <View style={{ minWidth: 260 }}>
              <FieldSwitch<0 | 16 | 32 | 56>
                options={[
                  { value: 0, label: "0" },
                  { value: 16, label: "16" },
                  { value: 32, label: "32" },
                  { value: 56, label: "56" },
                ]}
                value={paddingRight as 0 | 16 | 32 | 56}
                onChange={setPaddingRight}
              />
            </View>
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="All variants" preview={variantsPreview} />

      <DetailSection heading="With padding" preview={paddingPreview} />

      <DetailSection heading="In a list row" preview={listRowPreview} />
    </PageScaffold>
  );
}

// ─────────── Local building blocks ───────────

function PreviewSurface({
  children,
  tall,
}: {
  children: ReactNode;
  tall?: boolean;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colour.border.primary,
        borderRadius: radius["12"],
        padding: space["20"],
        justifyContent: "center",
        alignItems: tall ? "center" : undefined,
        minHeight: tall ? 200 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function PropList({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

function PropRow({ children, last }: { children: ReactNode; last?: boolean }) {
  const shell = useShell();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: space["12"],
        paddingVertical: space["16"],
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: shell.border,
      }}
    >
      {children}
    </View>
  );
}

function PropLabel({ children }: { children: ReactNode }) {
  const shell = useShell();
  return (
    <Text
      style={[
        textStyles.B16_Medium,
        { color: shell.textPrimary, minWidth: 96 },
      ]}
    >
      {children}
    </Text>
  );
}

