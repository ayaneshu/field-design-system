import { useCallback, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  ActionBar,
  BottomSheet,
  PrimaryButton,
  Switch as FieldSwitch,
  type ActionBarLayout,
  type ActionBarTone,
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
import {
  BOTTOM_SHEET_AXIS_MS,
  bottomSheetEntryMotionTimeline,
} from "./motionTimelines/bottomSheetEntryMotionTimeline";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

const PHONE_W = 375;
const PHONE_H = 812;

const ACTION_BAR_LAYOUTS: ActionBarLayout[] = [
  "single",
  "stacked",
  "split",
  "leadingTrailing",
];
const ACTION_BAR_LAYOUT_LABEL: Record<ActionBarLayout, string> = {
  single: "Single",
  stacked: "Stacked",
  split: "Split",
  leadingTrailing: "Lead+Trail",
};

const ACTION_BAR_TONES: ActionBarTone[] = ["action", "neutral"];
const ACTION_BAR_TONE_LABEL: Record<ActionBarTone, string> = {
  action: "Action",
  neutral: "Neutral",
};

export function BottomSheetScreen({ navigation }: Props) {
  const [open, setOpen] = useState(true);

  const [showScrim, setShowScrim] = useState(true);
  const [showGrabber, setShowGrabber] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showHomeIndicator, setShowHomeIndicator] = useState(true);
  const [showFooterSlot, setShowFooterSlot] = useState(true);

  const [layout, setLayout] = useState<ActionBarLayout>("single");
  const [tone, setTone] = useState<ActionBarTone>("action");

  // Motion-spec preview state.
  const [motionPreviewOpen, setMotionPreviewOpen] = useState(false);
  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: BOTTOM_SHEET_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  const footerNode = (
    <ActionBar
      layout={layout}
      tone={tone}
      showSlot={showFooterSlot}
      primaryLabel="Apply"
      onPrimaryPress={() => setOpen(false)}
      secondaryLabel="Cancel"
      onSecondaryPress={() => setOpen(false)}
    />
  );

  const playgroundPreview = (
    <PreviewSurface tall>
      <PhoneFrame>
        {/* Always rendered, sits behind the sheet — the sheet's absolute
            fill covers it on open and reveals it again on close. */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: space["20"],
          }}
        >
          <PrimaryButton
            label="Open bottom sheet"
            size="H48"
            onPress={() => setOpen(true)}
            style={{ alignSelf: "center" }}
          />
        </View>

        <BottomSheet
          presentation="inline"
          open={open}
          onClose={() => setOpen(false)}
          showScrim={showScrim}
          showGrabber={showGrabber}
          showHeader={showHeader}
          showFooter={showFooter}
          showHomeIndicator={showHomeIndicator}
          headerSlot={<SampleHeader />}
          bodySlot={<SampleBody />}
          footer={footerNode}
        />
      </PhoneFrame>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="bottom sheet"
      subtitle="Bottom-anchored sheet that slides up over the current screen. Floats with a 12 px inset and rounded corners. Header, body, and footer slots — footer defaults to an ActionBar. Grabber is draggable: pull down to dismiss, pull up to expand the inner gap."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/BottomSheet/BottomSheet.tsx"
      sidebar={componentsSidebar("BottomSheet")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...bottomSheetEntryMotionTimeline,
        playhead,
        preview: (
          <EntryPreview
            open={motionPreviewOpen}
            onOpen={() => {
              setMotionPreviewOpen(true);
              triggerPlay();
            }}
            onClose={() => {
              setMotionPreviewOpen(false);
              triggerPlay();
            }}
          />
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
            <PropLabel>Sheet</PropLabel>
            <Toggle value={open} onValueChange={setOpen} />
          </PropRow>
          <PropRow>
            <PropLabel>Footer layout</PropLabel>
            <View style={{ minWidth: 320 }}>
              <FieldSwitch<ActionBarLayout>
                options={ACTION_BAR_LAYOUTS.map((l) => ({
                  value: l,
                  label: ACTION_BAR_LAYOUT_LABEL[l],
                }))}
                value={layout}
                onChange={setLayout}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Footer tone</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<ActionBarTone>
                options={ACTION_BAR_TONES.map((t) => ({
                  value: t,
                  label: ACTION_BAR_TONE_LABEL[t],
                }))}
                value={tone}
                onChange={setTone}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Show scrim</PropLabel>
            <Toggle value={showScrim} onValueChange={setShowScrim} />
          </PropRow>
          <PropRow>
            <PropLabel>Show grabber</PropLabel>
            <Toggle value={showGrabber} onValueChange={setShowGrabber} />
          </PropRow>
          <PropRow>
            <PropLabel>Show header</PropLabel>
            <Toggle value={showHeader} onValueChange={setShowHeader} />
          </PropRow>
          <PropRow>
            <PropLabel>Show footer</PropLabel>
            <Toggle value={showFooter} onValueChange={setShowFooter} />
          </PropRow>
          <PropRow>
            <PropLabel>Show footer slot</PropLabel>
            <Toggle value={showFooterSlot} onValueChange={setShowFooterSlot} />
          </PropRow>
          <PropRow last>
            <PropLabel>Show home indicator</PropLabel>
            <Toggle
              value={showHomeIndicator}
              onValueChange={setShowHomeIndicator}
            />
          </PropRow>
        </PropList>
      </DetailSection>
    </PageScaffold>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, "BottomSheet">;

/**
 * Live preview for the entry timesheet. Compact phone-frame containing an
 * inline BottomSheet — tapping the trigger opens it (sheet springs up,
 * scrim fades in); tapping the scrim or the CTA closes it. Both transitions
 * also trigger the timesheet playhead so the cursor sweeps in sync.
 */
function EntryPreview({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const shell = useShell();
  return (
    <View style={{ alignItems: "center", gap: space["12"] }}>
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          },
        ]}
      >
        Live preview
      </Text>
      <View
        style={{
          width: 200,
          height: 300,
          borderRadius: radius["16"],
          backgroundColor: colour.surface["secondary-inverted"],
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: space["12"],
          }}
        >
          <PrimaryButton
            label="Open"
            size="H36"
            onPress={onOpen}
            style={{ alignSelf: "center" }}
          />
        </View>
        <BottomSheet
          presentation="inline"
          open={open}
          onClose={onClose}
          showHomeIndicator={false}
          showHeader={false}
          bodySlot={
            <View style={{ padding: space["12"] }}>
              <Text
                style={[
                  textStyles.Body_B11_Regular,
                  { color: colour["text-n-icon"].secondary },
                ]}
              >
                Body content
              </Text>
            </View>
          }
          primaryLabel="Apply"
          onPrimaryPress={onClose}
        />
      </View>
      <Text
        style={[
          textStyles.Body_B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap to open · scrim to dismiss
      </Text>
    </View>
  );
}

// ─────────── Local building blocks ───────────

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        width: PHONE_W,
        maxWidth: "100%",
        height: PHONE_H,
        borderRadius: radius["20"],
        backgroundColor: colour.surface["secondary-inverted"],
        overflow: "hidden",
        alignSelf: "center",
      }}
    >
      {children}
    </View>
  );
}

function SampleHeader() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: space["16"],
      }}
    >
      <Text
        style={[
          textStyles.Heading_H16_Bold,
          { color: colour["text-n-icon"].primary },
        ]}
      >
        Filter
      </Text>
    </View>
  );
}

function SampleBody() {
  return (
    <View style={{ padding: space["20"], gap: space["12"] }}>
      <Text
        style={[
          textStyles.Body_B14_Regular,
          { color: colour["text-n-icon"].secondary },
        ]}
      >
        Drop any content into the body slot — list rows, forms, illustrations,
        a Lottie intro. The sheet caps at 680 px tall; taller content scrolls
        inside the body. Pull the grabber up to expand the gap between
        sections; pull it down to dismiss.
      </Text>
      <View
        style={{
          height: 180,
          backgroundColor: colour.surface.tertiary,
          borderRadius: radius["8"],
        }}
      />
    </View>
  );
}
