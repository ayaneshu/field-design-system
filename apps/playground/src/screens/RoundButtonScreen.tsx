import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RoundButton, type RoundButtonSize } from "@field-ds/components";
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

type Props = NativeStackScreenProps<RootStackParamList, "RoundButton">;

const SIZES: RoundButtonSize[] = ["H40", "H36"];

/**
 * Pill-shaped neutral Round Button. Maps to Figma `M-NeutralRoundButton`.
 * Same colour semantics as `Button variant="secondary-neutral"` but with
 * a fully rounded border. Use for compact toolbar / map-chip / sticky
 * header actions.
 */
export function RoundButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<RoundButtonSize>("H40");
  const [iconLeft, setIconLeft] = useState<IconName | null>("system-plus");
  const [iconRight, setIconRight] = useState<IconName | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const playgroundPreview = (
    <PreviewSurface tall>
      <RoundButton
        label="Filter"
        size={size}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
        loading={loading}
        disabled={disabled}
      />
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <PreviewSurface key={s}>
          <SectionLabel>Round · {s}</SectionLabel>
          <Row>
            <RoundButton label="Filter" size={s} />
            <RoundButton label="Filter" size={s} iconLeft="system-plus" />
            <RoundButton label="Filter" size={s} loading />
            <RoundButton label="Filter" size={s} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="round button"
      subtitle="Pill-shaped neutral CTA for compact toolbar / map-chip / sticky header actions where a pill reads better than a rectangular outline button. Two heights, four states."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/RoundButton.tsx"
      sidebar={componentsSidebar("RoundButton")}
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
