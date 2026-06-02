import { useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  ActionBar,
  type ActionBarLayout,
  type ActionBarTone,
  Switch as FieldSwitch,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import {
  PreviewSurface,
  PropLabel,
  PropList,
  PropRow,
  Toggle,
} from "../components/playground-controls";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ActionBar">;

const LAYOUTS: ActionBarLayout[] = [
  "single",
  "stacked",
  "split",
  "leadingTrailing",
];

const LAYOUT_LABEL: Record<ActionBarLayout, string> = {
  single: "Single",
  stacked: "Stacked",
  split: "Split",
  leadingTrailing: "Leading + Trailing",
};

const TONES: ActionBarTone[] = ["action", "neutral"];
const TONE_LABEL: Record<ActionBarTone, string> = {
  action: "Action",
  neutral: "Neutral",
};

export function ActionBarScreen({ navigation }: Props) {
  const [layout, setLayout] = useState<ActionBarLayout>("single");
  const [tone, setTone] = useState<ActionBarTone>("action");
  const [showSlot, setShowSlot] = useState(true);

  const playgroundPreview = (
    <PreviewSurface>
      <View style={{ width: 375, maxWidth: "100%", alignSelf: "center" }}>
        <ActionBar
          layout={layout}
          tone={tone}
          showSlot={showSlot}
          primaryLabel="Continue"
          secondaryLabel="Cancel"
        />
      </View>
    </PreviewSurface>
  );

  const allVariantsPreview = (
    <View style={{ gap: space["20"] }}>
      {TONES.map((t) => (
        <PreviewSurface key={t}>
          <SectionCaption>{TONE_LABEL[t]}</SectionCaption>
          <View style={{ gap: space["16"] }}>
            {LAYOUTS.map((l) => (
              <View key={l} style={{ gap: space["6"] }}>
                <RowCaption>{LAYOUT_LABEL[l]}</RowCaption>
                <View style={{ width: 375, maxWidth: "100%" }}>
                  <ActionBar
                    layout={l}
                    tone={t}
                    primaryLabel="Continue"
                    secondaryLabel="Cancel"
                  />
                </View>
              </View>
            ))}
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="action bar"
      subtitle="Footer block that pairs a CTA (or two) with an optional content slot. Drops into BottomSheet and any other footer surface. Four layouts × two tones."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/ActionBar/ActionBar.tsx"
      sidebar={componentsSidebar("ActionBar")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Layout</PropLabel>
            <View style={{ minWidth: 320 }}>
              <FieldSwitch<ActionBarLayout>
                options={LAYOUTS.map((l) => ({
                  value: l,
                  label: LAYOUT_LABEL[l],
                }))}
                value={layout}
                onChange={setLayout}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Tone</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<ActionBarTone>
                options={TONES.map((t) => ({
                  value: t,
                  label: TONE_LABEL[t],
                }))}
                value={tone}
                onChange={setTone}
              />
            </View>
          </PropRow>
          <PropRow last>
            <PropLabel>Show slot</PropLabel>
            <Toggle value={showSlot} onValueChange={setShowSlot} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="All variants" preview={allVariantsPreview} />
    </PageScaffold>
  );
}

function SectionCaption({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.B11_SemiBold,
        {
          color: colour["text-n-icon"].tertiary,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: space["12"],
        },
      ]}
    >
      {children}
    </Text>
  );
}

function RowCaption({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.B11_Medium,
        {
          color: colour["text-n-icon"].tertiary,
          marginBottom: space["4"],
        },
      ]}
    >
      {children}
    </Text>
  );
}
