import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  TextButton,
  type TextButtonSize,
  type TextButtonTone,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { space } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { IconPicker } from "../components/IconPicker";
import {
  PreviewSurface,
  PropLabel,
  PropList,
  PropRow,
  SectionLabel,
  SegmentedControl,
  Toggle,
} from "../components/playground-controls";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "TextButton">;

const TONES: TextButtonTone[] = ["blue", "neutral"];
const SIZES: TextButtonSize[] = ["A14", "A12"];

/**
 * Low-emphasis text-only CTA. Maps to Figma `M-TextButtonBlue` and
 * `M-TextButtonNeutral`. Use for inline supportive actions ("View all",
 * row-level "Edit", toolbar links) — never as the only action on a screen.
 */
export function TextButtonScreen({ navigation }: Props) {
  const [tone, setTone] = useState<TextButtonTone>("blue");
  const [size, setSize] = useState<TextButtonSize>("A14");
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(
    "system-arrow-right",
  );
  const [disabled, setDisabled] = useState(false);

  const playgroundPreview = (
    <PreviewSurface tall>
      <TextButton
        label="View all"
        tone={tone}
        size={size}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
        disabled={disabled}
      />
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      {TONES.map((t) =>
        SIZES.map((sz) => (
          <PreviewSurface key={`${t}-${sz}`}>
            <SectionLabel>{`${t} · ${sz}`}</SectionLabel>
            <Row>
              <TextButton label="View all" tone={t} size={sz} />
              <TextButton
                label="View all"
                tone={t}
                size={sz}
                iconRight="system-arrow-right"
              />
              <TextButton label="View all" tone={t} size={sz} disabled />
            </Row>
          </PreviewSurface>
        )),
      )}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="text button"
      subtitle="Low-emphasis CTA — transparent surface with a coloured label. Two tones (blue, neutral) × two sizes (A14, A12). Subtle pressed-state tint; disabled colour mutes the label."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/TextButton.tsx"
      sidebar={componentsSidebar("TextButton")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Tone</PropLabel>
            <SegmentedControl options={TONES} value={tone} onChange={setTone} />
          </PropRow>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl options={SIZES} value={size} onChange={setSize} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon left</PropLabel>
            <IconPicker value={iconLeft} onChange={setIconLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon right</PropLabel>
            <IconPicker value={iconRight} onChange={setIconRight} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="States" preview={statesPreview} />
    </PageScaffold>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: space["12"],
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
