import { useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  IconButton,
  type IconButtonEmphasis,
  type IconButtonSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { RequiredIconPicker } from "../components/IconPicker";
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

type Props = NativeStackScreenProps<RootStackParamList, "IconButton">;

const SIZES: IconButtonSize[] = ["H40", "H36"];
const EMPHASES: IconButtonEmphasis[] = ["default", "ghost", "action"];

/**
 * Square circular icon-only button. Maps to Figma `M-IconButton`. Three
 * emphasis levels (default / ghost / action) × two heights × default /
 * pressed / disabled states. Always supply an `accessibilityLabel`.
 */
export function IconButtonScreen({ navigation }: Props) {
  const [size, setSize] = useState<IconButtonSize>("H40");
  const [emphasis, setEmphasis] = useState<IconButtonEmphasis>("default");
  const [icon, setIcon] = useState<IconName>("system-arrow-right");
  const [disabled, setDisabled] = useState(false);

  const press = useButtonPressMotion();

  const playgroundPreview = (
    <PreviewSurface tall>
      <IconButton
        icon={icon}
        accessibilityLabel={icon}
        size={size}
        emphasis={emphasis}
        disabled={disabled}
      />
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((sz) => (
        <PreviewSurface key={sz}>
          <SectionLabel>{sz}</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space["20"] }}>
            {EMPHASES.map((em) => (
              <View key={em} style={{ alignItems: "center", gap: space["8"] }}>
                <View style={{ flexDirection: "row", gap: space["8"] }}>
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                  />
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                    disabled
                  />
                </View>
                <Text
                  style={[
                    textStyles.Body_B11_Medium,
                    { color: colour["text-n-icon"].tertiary },
                  ]}
                >
                  {em}
                </Text>
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
      title="icon button"
      subtitle="Square circular icon-only button — back chevrons, close, overflow, inline controls in headers and cards. Three emphasis levels (default, ghost, action) × two heights × default / pressed / disabled."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/IconButton.tsx"
      sidebar={componentsSidebar("IconButton")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...buttonPressMotionTimeline,
        playhead: press.playhead,
        preview: (
          <ButtonPressPreview playhead={press.playhead} onPlay={press.triggerPlay}>
            <IconButton
              icon="system-arrow-right"
              accessibilityLabel="Press preview"
              size="H40"
              emphasis="action"
            />
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
            <PropLabel>Emphasis</PropLabel>
            <SegmentedControl
              options={EMPHASES}
              value={emphasis}
              onChange={setEmphasis}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Icon</PropLabel>
            <RequiredIconPicker value={icon} onChange={setIcon} />
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

// Local Row helper retained for parity with sibling button screens.
export function Row({ children }: { children: ReactNode }) {
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
