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
  RatingInput,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type RatingInputSize,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import {
  RATING_INPUT_AXIS_MS,
  ratingInputFillMotionTimeline,
} from "./motionTimelines/ratingInputFillMotionTimeline";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RatingInput">;

const SIZES: RatingInputSize[] = [20, 28, 32];

const FEEDBACK_LABELS = [
  "Tap a star to rate",
  "Hated it",
  "Didn't like it",
  "It was OK",
  "Liked it",
  "Loved it",
];

export function RatingInputScreen({ navigation }: Props) {
  const [rating, setRating] = useState(0);
  const [size, setSize] = useState<RatingInputSize>(28);
  const [emojis, setEmojis] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Motion-spec preview state.
  const [previewRating, setPreviewRating] = useState(0);
  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: RATING_INPUT_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ alignItems: "center", gap: space["12"] }}>
        <RatingInput
          value={rating}
          onChange={setRating}
          size={size}
          emojis={emojis}
          disabled={disabled}
        />
        <Text
          style={[
            textStyles.B14_Medium,
            { color: colour["text-n-icon"].secondary },
          ]}
        >
          {FEEDBACK_LABELS[rating]}
        </Text>
      </View>
    </PreviewSurface>
  );

  const sizesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <PreviewSurface key={s}>
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
            {s}px
          </Text>
          <View style={{ gap: space["12"] }}>
            <RatingInput size={s} />
            <RatingInput size={s} defaultValue={3} />
            <RatingInput size={s} defaultValue={5} />
            <RatingInput size={s} defaultValue={3} emojis={false} />
            <RatingInput size={s} defaultValue={3} disabled />
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const statesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["16"] }}>
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <View
            key={v}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["16"],
            }}
          >
            <Text
              style={[
                textStyles.B11_Medium,
                {
                  color: colour["text-n-icon"].tertiary,
                  minWidth: 72,
                },
              ]}
            >
              {v === 0 ? "Unfilled" : v === 1 ? "1 star" : `${v} stars`}
            </Text>
            <RatingInput defaultValue={v} />
          </View>
        ))}
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="rating input"
      subtitle="Interactive 5-star rating input with optional emoji feedback at the selected star. Three sizes (20 / 28 / 32). Tap the current star to clear back to zero."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/RatingInput/RatingInput.tsx"
      sidebar={componentsSidebar("RatingInput")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...ratingInputFillMotionTimeline,
        playhead,
        preview: (
          <FillPreview
            rating={previewRating}
            onRate={(next) => {
              setPreviewRating(next);
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
            <PropLabel>Size</PropLabel>
            <View style={{ minWidth: 240 }}>
              <FieldSwitch<RatingInputSize>
                options={SIZES.map((s) => ({ value: s, label: `${s}px` }))}
                value={size}
                onChange={setSize}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Emojis</PropLabel>
            <Toggle value={emojis} onValueChange={setEmojis} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Sizes" preview={sizesPreview} />

      <DetailSection heading="States" preview={statesPreview} />
    </PageScaffold>
  );
}

/**
 * Live preview for the RatingInput fill-sweep timesheet. Tapping a star
 * commits the rating + triggers the playhead so the cursor sweeps in sync
 * with the per-star fade + bounce.
 */
function FillPreview({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (next: number) => void;
}) {
  const shell = useShell();
  return (
    <View style={{ alignItems: "center", gap: space["12"] }}>
      <Text
        style={[
          textStyles.B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          },
        ]}
      >
        Live preview
      </Text>
      <RatingInput value={rating} onChange={onRate} size={32} />
      <Text
        style={[
          textStyles.B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap a star to play
      </Text>
    </View>
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
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius["12"],
        padding: space["20"],
        justifyContent: "center",
        alignItems: tall ? "center" : undefined,
        minHeight: tall ? 320 : undefined,
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

function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return <FieldToggle on={value} onChange={onValueChange} size="H20" />;
}

