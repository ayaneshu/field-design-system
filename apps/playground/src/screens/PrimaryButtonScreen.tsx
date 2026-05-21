import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PrimaryButton, type PrimaryButtonSize } from "@field-ds/components";
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
import { buttonPressMotionTimeline } from "./motionTimelines/buttonPressMotionTimeline";
import {
  ButtonPressPreview,
  useButtonPressMotion,
} from "./motionTimelines/useButtonPressMotion";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PrimaryButton">;

const SIZES: PrimaryButtonSize[] = ["H56", "H52", "H48", "H40", "H36"];

export function PrimaryButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<PrimaryButtonSize>("H56");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);

  const press = useButtonPressMotion();

  const playgroundPreview = (
    <PreviewSurface tall>
      <PrimaryButton
        label="Continue"
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
            <PrimaryButton label="Continue" size={s} />
            <PrimaryButton label="Continue" size={s} iconLeft="system-plus" />
            <PrimaryButton label="Continue" size={s} loading />
            <PrimaryButton label="Continue" size={s} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="primary button"
      subtitle="Filled blue, highest emphasis. Use for the single most important action on a screen — Save, Continue, Checkout. Only one PrimaryButton per context."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/PrimaryButton.tsx"
      sidebar={componentsSidebar("PrimaryButton")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...buttonPressMotionTimeline,
        playhead: press.playhead,
        preview: (
          <ButtonPressPreview playhead={press.playhead} onPlay={press.triggerPlay}>
            <PrimaryButton label="Continue" size="H48" />
          </ButtonPressPreview>
        ),
      }}
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
