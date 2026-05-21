import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  NeutralTextButton,
  type NeutralTextButtonSize,
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
import { buttonPressMotionTimeline } from "./motionTimelines/buttonPressMotionTimeline";
import {
  ButtonPressPreview,
  useButtonPressMotion,
} from "./motionTimelines/useButtonPressMotion";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NeutralTextButton">;

const SIZES: NeutralTextButtonSize[] = ["A14", "A12"];

/**
 * Low-emphasis text-only CTA in the neutral text tone. Maps to Figma
 * `M-TextButtonNeutral`. Use on coloured / inverted surfaces or when a blue
 * link would compete with surrounding content. For the default blue text
 * link, see `TextButton`.
 */
export function NeutralTextButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<NeutralTextButtonSize>("A14");
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);
  const [disabled, setDisabled] = useState(false);

  const press = useButtonPressMotion();

  const playgroundPreview = (
    <PreviewSurface tall>
      <NeutralTextButton
        label="Dismiss"
        size={size}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
        disabled={disabled}
      />
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((sz) => (
        <PreviewSurface key={sz}>
          <SectionLabel>{sz}</SectionLabel>
          <Row>
            <NeutralTextButton label="Dismiss" size={sz} />
            <NeutralTextButton
              label="Edit"
              size={sz}
              iconLeft="system-edit"
            />
            <NeutralTextButton label="Dismiss" size={sz} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="text neutral"
      subtitle="Low-emphasis neutral-tone CTA — transparent surface with a near-black label. Two sizes (A14, A12). Use on coloured / inverted surfaces or when a blue link would compete. For the default blue text link, see Text."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/NeutralTextButton.tsx"
      sidebar={componentsSidebar("NeutralTextButton")}
      motionTimeline={{
        ...buttonPressMotionTimeline,
        playhead: press.playhead,
        preview: (
          <ButtonPressPreview playhead={press.playhead} onPlay={press.triggerPlay}>
            <NeutralTextButton label="Dismiss" />
          </ButtonPressPreview>
        ),
      }}
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
