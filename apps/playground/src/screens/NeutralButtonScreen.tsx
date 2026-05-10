import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { NeutralButton, type NeutralButtonSize } from "@field-ds/components";
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

type Props = NativeStackScreenProps<RootStackParamList, "NeutralButton">;

// NeutralButton is the only rectangular family that ships H32 per Figma.
const SIZES: NeutralButtonSize[] = [
  "H56",
  "H52",
  "H48",
  "H40",
  "H36",
  "H32",
];

export function NeutralButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<NeutralButtonSize>("H56");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);

  const playgroundPreview = (
    <PreviewSurface tall>
      <NeutralButton
        label="Schedule"
        size={size}
        loading={loading}
        disabled={disabled}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
      />
    </PreviewSurface>
  );

  const sizesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <PreviewSurface key={s}>
          <SectionLabel>{s}</SectionLabel>
          <Row>
            <NeutralButton label="Schedule" size={s} />
            <NeutralButton label="Schedule" size={s} iconLeft="system-plus" />
            <NeutralButton label="Schedule" size={s} loading />
            <NeutralButton label="Schedule" size={s} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="neutral button"
      subtitle="Filled near-black. Visually quieter than PrimaryButton — use when multiple actions coexist on light surfaces or when the page already has a primary CTA elsewhere. Six heights including the toolbar-only H32."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/NeutralButton.tsx"
      sidebar={componentsSidebar("NeutralButton")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
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
          <PropRow>
            <PropLabel>Loading</PropLabel>
            <Toggle value={loading} onValueChange={setLoading} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Sizes" preview={sizesPreview} />
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
