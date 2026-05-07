import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Button,
  IconButton,
  RoundButton,
  TextButton,
  type ButtonSize,
  type ButtonVariant,
  type IconButtonEmphasis,
  type IconButtonSize,
  type RoundButtonSize,
  type TextButtonSize,
  type TextButtonTone,
} from "@field-ds/components";
import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Button">;

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "secondary-neutral",
  "neutral",
];
const SIZES: ButtonSize[] = ["H56", "H52", "H48", "H40", "H36", "H32"];
const ROUND_SIZES: RoundButtonSize[] = ["H40", "H36"];
const TEXT_TONES: TextButtonTone[] = ["blue", "neutral"];
const TEXT_SIZES: TextButtonSize[] = ["A14", "A12"];
const ICON_SIZES: IconButtonSize[] = ["H40", "H36"];
const ICON_EMPHASIS: IconButtonEmphasis[] = ["default", "ghost", "action"];

// Curated system-icon set for the playground icon picker. Covers the
// common button-glyph cases (directional arrows, plus/close, search,
// share, edit) without overwhelming the dropdown.
const ICON_OPTIONS: IconName[] = [
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-arrow-up",
  "system-arrow-down",
  "system-chevron-right",
  "system-chevron-left",
  "system-search",
  "system-edit",
  "system-bag",
  "system-heart",
  "system-bin",
  "system-info-circle",
  "system-check-circle",
  "system-message",
];

export function ButtonScreen({ navigation }: Props) {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("H56");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // `null` means no icon for that slot. The picker offers an explicit "None"
  // entry that maps to null so the user can switch icons on/off and pick a
  // different glyph independently.
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);

  // Per-section playground state — every button family gets its own pair
  // of icon slots so designers can compose mid-flight without bouncing
  // between sections.
  const [roundSize, setRoundSize] = useState<RoundButtonSize>("H40");
  const [roundIconLeft, setRoundIconLeft] = useState<IconName | null>(
    "system-plus",
  );
  const [roundIconRight, setRoundIconRight] = useState<IconName | null>(null);
  const [roundLoading, setRoundLoading] = useState(false);
  const [roundDisabled, setRoundDisabled] = useState(false);

  const [textTone, setTextTone] = useState<TextButtonTone>("blue");
  const [textSize, setTextSize] = useState<TextButtonSize>("A14");
  const [textIconLeft, setTextIconLeft] = useState<IconName | null>(null);
  const [textIconRight, setTextIconRight] = useState<IconName | null>(
    "system-arrow-right",
  );
  const [textDisabled, setTextDisabled] = useState(false);

  const [iconBtnSize, setIconBtnSize] = useState<IconButtonSize>("H40");
  const [iconBtnEmphasis, setIconBtnEmphasis] =
    useState<IconButtonEmphasis>("default");
  const [iconBtnGlyph, setIconBtnGlyph] = useState<IconName>(
    "system-arrow-right",
  );
  const [iconBtnDisabled, setIconBtnDisabled] = useState(false);

  const playgroundPreview = (
    <PreviewSurface tall>
      <Button
        label="Continue"
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
      />
    </PreviewSurface>
  );

  const variantsPreview = (
    <View style={{ gap: space["20"] }}>
      {VARIANTS.map((v) => (
        <PreviewSurface key={v}>
          <SectionLabel>{v}</SectionLabel>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: space["12"],
              alignItems: "center",
            }}
          >
            <Button label="Default" variant={v} />
            <Button label="With icon" variant={v} iconLeft="system-plus" />
            <Button label="Loading" variant={v} loading />
            <Button label="Disabled" variant={v} disabled />
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const sizesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => {
        // H32 only ships on the neutral variant per Figma.
        const v: ButtonVariant = s === "H32" ? "neutral" : "primary";
        return (
          <PreviewSurface key={s}>
            <SectionLabel>{s}</SectionLabel>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: space["12"],
                alignItems: "center",
              }}
            >
              <Button label="Continue" variant={v} size={s} />
              <Button
                label="Continue"
                variant={v}
                size={s}
                iconLeft="system-plus"
              />
              <Button label="Continue" variant={v} size={s} loading />
              <Button label="Continue" variant={v} size={s} disabled />
            </View>
          </PreviewSurface>
        );
      })}
    </View>
  );

  const roundLivePreview = (
    <PreviewSurface tall>
      <RoundButton
        label="Filter"
        size={roundSize}
        iconLeft={roundIconLeft ?? undefined}
        iconRight={roundIconRight ?? undefined}
        loading={roundLoading}
        disabled={roundDisabled}
      />
    </PreviewSurface>
  );

  const roundStatesPreview = (
    <View style={{ gap: space["20"] }}>
      {ROUND_SIZES.map((s) => (
        <PreviewSurface key={s}>
          <SectionLabel>Round · {s}</SectionLabel>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: space["12"],
              alignItems: "center",
            }}
          >
            <RoundButton label="Filter" size={s} />
            <RoundButton label="Filter" size={s} iconLeft="system-plus" />
            <RoundButton label="Filter" size={s} loading />
            <RoundButton label="Filter" size={s} disabled />
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const textLivePreview = (
    <PreviewSurface tall>
      <TextButton
        label="View all"
        tone={textTone}
        size={textSize}
        iconLeft={textIconLeft ?? undefined}
        iconRight={textIconRight ?? undefined}
        disabled={textDisabled}
      />
    </PreviewSurface>
  );

  const textStatesPreview = (
    <View style={{ gap: space["20"] }}>
      {TEXT_TONES.map((tone) =>
        TEXT_SIZES.map((sz) => (
          <PreviewSurface key={`${tone}-${sz}`}>
            <SectionLabel>{`${tone} · ${sz}`}</SectionLabel>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: space["12"],
                alignItems: "center",
              }}
            >
              <TextButton label="View all" tone={tone} size={sz} />
              <TextButton
                label="View all"
                tone={tone}
                size={sz}
                iconRight="system-arrow-right"
              />
              <TextButton label="View all" tone={tone} size={sz} disabled />
            </View>
          </PreviewSurface>
        )),
      )}
    </View>
  );

  const iconLivePreview = (
    <PreviewSurface tall>
      <IconButton
        icon={iconBtnGlyph}
        accessibilityLabel={iconBtnGlyph}
        size={iconBtnSize}
        emphasis={iconBtnEmphasis}
        disabled={iconBtnDisabled}
      />
    </PreviewSurface>
  );

  const iconStatesPreview = (
    <View style={{ gap: space["20"] }}>
      {ICON_SIZES.map((sz) => (
        <PreviewSurface key={sz}>
          <SectionLabel>{sz}</SectionLabel>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: space["20"],
            }}
          >
            {ICON_EMPHASIS.map((em) => (
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
      title="button"
      subtitle="Action controls for primary, secondary, and supportive CTAs across noon flows. Four rectangular variants, a pill-shaped neutral, two text styles, and a circular icon-only variant — all with default, pressed, loader, and disabled states."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button"
      sidebar={componentsSidebar("Button")}
      onSidebarSelect={(key) => {
        if (key === "all") navigation.navigate("Components" as never);
        else navigation.navigate(key as never);
      }}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Variant</PropLabel>
            <SegmentedControl
              options={VARIANTS}
              value={variant}
              onChange={setVariant}
            />
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

      <DetailSection heading="Variants" preview={variantsPreview} />
      <DetailSection heading="Sizes" preview={sizesPreview} />

      <DetailSection
        heading="Round neutral · playground"
        preview={roundLivePreview}
      >
        <PropList>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl
              options={ROUND_SIZES}
              value={roundSize}
              onChange={setRoundSize}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Icon left</PropLabel>
            <IconPicker value={roundIconLeft} onChange={setRoundIconLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon right</PropLabel>
            <IconPicker value={roundIconRight} onChange={setRoundIconRight} />
          </PropRow>
          <PropRow>
            <PropLabel>Loading</PropLabel>
            <Toggle value={roundLoading} onValueChange={setRoundLoading} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={roundDisabled} onValueChange={setRoundDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>
      <DetailSection
        heading="Round neutral · states"
        preview={roundStatesPreview}
      />

      <DetailSection
        heading="Text buttons · playground"
        preview={textLivePreview}
      >
        <PropList>
          <PropRow>
            <PropLabel>Tone</PropLabel>
            <SegmentedControl
              options={TEXT_TONES}
              value={textTone}
              onChange={setTextTone}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl
              options={TEXT_SIZES}
              value={textSize}
              onChange={setTextSize}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Icon left</PropLabel>
            <IconPicker value={textIconLeft} onChange={setTextIconLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon right</PropLabel>
            <IconPicker value={textIconRight} onChange={setTextIconRight} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={textDisabled} onValueChange={setTextDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>
      <DetailSection
        heading="Text buttons · states"
        preview={textStatesPreview}
      />

      <DetailSection
        heading="Icon buttons · playground"
        preview={iconLivePreview}
      >
        <PropList>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl
              options={ICON_SIZES}
              value={iconBtnSize}
              onChange={setIconBtnSize}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Emphasis</PropLabel>
            <SegmentedControl
              options={ICON_EMPHASIS}
              value={iconBtnEmphasis}
              onChange={setIconBtnEmphasis}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Icon</PropLabel>
            {/* IconButton requires a glyph — picker without a "None" option */}
            <RequiredIconPicker
              value={iconBtnGlyph}
              onChange={setIconBtnGlyph}
            />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle
              value={iconBtnDisabled}
              onValueChange={setIconBtnDisabled}
            />
          </PropRow>
        </PropList>
      </DetailSection>
      <DetailSection
        heading="Icon buttons · states"
        preview={iconStatesPreview}
      />
    </PageScaffold>
  );
}

// ─────────── Local building blocks (mirrors CheckboxScreen) ───────────

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
        gap: space["12"],
        justifyContent: "center",
        alignItems: tall ? "center" : "flex-start",
        minHeight: tall ? 320 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.Body_B11_SemiBold,
        {
          color: colour["text-n-icon"].tertiary,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        },
      ]}
    >
      {children}
    </Text>
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
        textStyles.Body_B16_Medium,
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
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        paddingVertical: space["6"],
        paddingHorizontal: space["12"],
        borderRadius: radius.rounded,
        backgroundColor: value
          ? colour.surface["action-extrabold"]
          : colour.surface.muted,
      }}
    >
      <Text
        style={[
          textStyles.Body_B12_SemiBold,
          {
            color: value
              ? colour["text-n-icon"]["on-surface-bold"]
              : colour["text-n-icon"].secondary,
          },
        ]}
      >
        {value ? "On" : "Off"}
      </Text>
    </Pressable>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        backgroundColor: colour.surface.muted,
        borderRadius: radius.rounded,
        padding: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingVertical: space["6"],
              paddingHorizontal: space["12"],
              borderRadius: radius.rounded,
              backgroundColor: active
                ? colour.surface.primary
                : "transparent",
            }}
          >
            <Text
              style={[
                textStyles.Body_B12_SemiBold,
                {
                  color: active
                    ? colour["text-n-icon"].primary
                    : colour["text-n-icon"].tertiary,
                },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Icon dropdown — a select-style trigger that shows the current icon glyph +
 * its slug, opens an inline floating menu on press where each row pairs the
 * icon preview with its name. "None" sits at the top to clear the selection.
 *
 * Built with absolute positioning instead of RN's Modal — the Modal route
 * had close-on-select issues on RN-Web (the row's setOpen race with the
 * parent re-render kept the modal mounted). A fixed-position click-away
 * backdrop handles outside dismissal cleanly.
 */
function IconPicker({
  value,
  onChange,
}: {
  value: IconName | null;
  onChange: (next: IconName | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = value ?? "None";

  // Single handler for row taps so closing happens in the same React batch
  // as the value change. Avoids the "menu stays open after select" race.
  const select = (next: IconName | null) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <View style={{ position: "relative", minWidth: 220 }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Pick icon — current: ${label}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          paddingVertical: space["8"],
          paddingHorizontal: space["12"],
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: open ? colour.border.action : colour.border.primary,
          backgroundColor: colour.surface.primary,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space["8"],
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value ? (
              <Icon
                name={value}
                size={16}
                color={colour["text-n-icon"].primary}
              />
            ) : (
              <View
                style={{
                  width: 12,
                  height: 1,
                  backgroundColor: colour["text-n-icon"].tertiary,
                }}
              />
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              textStyles.Body_B12_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {label}
          </Text>
        </View>
        <Icon
          name="system-chevron-down"
          size={16}
          color={colour["text-n-icon"].tertiary}
        />
      </Pressable>

      {open ? (
        <>
          {/* Click-away backdrop. Fixed-positioned so taps anywhere on the
              page (outside the panel) close the menu. zIndex sits below the
              panel on the same stack. */}
          <Pressable
            onPress={() => setOpen(false)}
            accessibilityLabel="Close icon picker"
            // @ts-expect-error — `position: "fixed"` is web-only; RN ignores it.
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: space["6"],
              width: 280,
              maxHeight: 360,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["12"],
              borderWidth: 1,
              borderColor: colour.border.primary,
              paddingVertical: space["4"],
              zIndex: 51,
              // Soft elevation — same lift used by other floating surfaces.
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <ScrollView
              style={{ maxHeight: 352 }}
              showsVerticalScrollIndicator
            >
              <DropdownRow
                label="None"
                active={value === null}
                onPress={() => select(null)}
              />
              {ICON_OPTIONS.map((name) => (
                <DropdownRow
                  key={name}
                  iconName={name}
                  label={name}
                  active={value === name}
                  onPress={() => select(name)}
                />
              ))}
            </ScrollView>
          </View>
        </>
      ) : null}
    </View>
  );
}

function DropdownRow({
  iconName,
  label,
  active,
  onPress,
}: {
  iconName?: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["12"],
        paddingVertical: space["10"],
        paddingHorizontal: space["12"],
        backgroundColor: active
          ? colour.surface["action-subtle"]
          : pressed
            ? colour.surface.secondary
            : "transparent",
      })}
    >
      <View
        style={{
          width: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconName ? (
          <Icon
            name={iconName}
            size={20}
            color={
              active
                ? colour["text-n-icon"].action
                : colour["text-n-icon"].primary
            }
          />
        ) : (
          // "None" placeholder — a neutral dash glyph in the icon slot so the
          // text alignment matches every other row.
          <View
            style={{
              width: 12,
              height: 1.5,
              backgroundColor: colour["text-n-icon"].tertiary,
            }}
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          textStyles.Body_B14_Medium,
          {
            color: active
              ? colour["text-n-icon"].action
              : colour["text-n-icon"].primary,
            flex: 1,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Icon-only variant of {@link IconPicker} — no "None" row, since IconButton
 * always requires a glyph. Shares the same trigger + popup chrome as the
 * nullable picker so the controls UI stays consistent.
 */
function RequiredIconPicker({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (next: IconName) => void;
}) {
  const [open, setOpen] = useState(false);

  const select = (next: IconName) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <View style={{ position: "relative", minWidth: 220 }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Pick icon — current: ${value}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          paddingVertical: space["8"],
          paddingHorizontal: space["12"],
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: open ? colour.border.action : colour.border.primary,
          backgroundColor: colour.surface.primary,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space["8"],
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={value}
              size={16}
              color={colour["text-n-icon"].primary}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              textStyles.Body_B12_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {value}
          </Text>
        </View>
        <Icon
          name="system-chevron-down"
          size={16}
          color={colour["text-n-icon"].tertiary}
        />
      </Pressable>

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            accessibilityLabel="Close icon picker"
            // @ts-expect-error — `position: "fixed"` is web-only; RN ignores it.
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: space["6"],
              width: 280,
              maxHeight: 360,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["12"],
              borderWidth: 1,
              borderColor: colour.border.primary,
              paddingVertical: space["4"],
              zIndex: 51,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <ScrollView
              style={{ maxHeight: 352 }}
              showsVerticalScrollIndicator
            >
              {ICON_OPTIONS.map((name) => (
                <DropdownRow
                  key={name}
                  iconName={name}
                  label={name}
                  active={value === name}
                  onPress={() => select(name)}
                />
              ))}
            </ScrollView>
          </View>
        </>
      ) : null}
    </View>
  );
}
