import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  SecondaryButton,
  type SecondaryButtonSize,
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

type Props = NativeStackScreenProps<RootStackParamList, "SecondaryButton">;

const SIZES: SecondaryButtonSize[] = ["H56", "H52", "H48", "H40", "H36"];

export function SecondaryButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<SecondaryButtonSize>("H56");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);

  const playgroundPreview = (
    <PreviewSurface tall>
      <SecondaryButton
        label="Cancel"
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
            <SecondaryButton label="Cancel" size={s} />
            <SecondaryButton label="Cancel" size={s} iconLeft="system-plus" />
            <SecondaryButton label="Cancel" size={s} loading />
            <SecondaryButton label="Cancel" size={s} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="secondary button"
      subtitle="Outline blue. Lower visual weight than PrimaryButton — pair as a supportive action (Cancel next to Save, Shop more next to Add to cart)."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/SecondaryButton.tsx"
      sidebar={componentsSidebar("SecondaryButton")}
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
