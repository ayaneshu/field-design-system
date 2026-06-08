import { useState, type ComponentProps, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Toast,
  PrimaryButton,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type ToastAction,
  type ToastType,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Dropdown, type DropdownOption } from "../components/Dropdown";
import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Toast">;

const TYPES: ToastType[] = ["dark", "light", "error", "success"];

// Curated leading glyphs for the asset slot.
const ICONS: IconName[] = [
  "system-info-circle-filled",
  "system-check-circle-filled",
  "system-warning-circle-filled",
  "system-bag",
  "system-heart",
];

// Swatch = the toast's surface colour, so the dropdown row previews the type.
const TYPE_SWATCH: Record<ToastType, string> = {
  dark: colour.surface["secondary-inverted"],
  light: colour.surface.primary,
  error: colour.surface["error-bold"],
  success: colour.surface["success-bold"],
};

const TYPE_LABEL: Record<ToastType, string> = {
  dark: "Dark · neutral",
  light: "Light · neutral",
  error: "Error",
  success: "Success",
};

const ACTIONS: ToastAction[] = ["button", "close", "none"];
const ACTION_LABEL: Record<ToastAction, string> = {
  button: "Button",
  close: "Close ✕",
  none: "None",
};

const ICON_LABEL: Record<IconName, string> = {
  "system-info-circle-filled": "Info",
  "system-check-circle-filled": "Check",
  "system-warning-circle-filled": "Warning",
  "system-bag": "Bag",
  "system-heart": "Heart",
} as Record<IconName, string>;

const DEFAULT_COPY: Record<ToastType, { title: string; subtitle: string; icon: IconName }> = {
  dark: { title: "Link copied", subtitle: "Paste it anywhere", icon: "system-info-circle-filled" },
  light: { title: "Draft saved", subtitle: "Last edited just now", icon: "system-info-circle-filled" },
  error: { title: "Upload failed", subtitle: "Tap to try again", icon: "system-warning-circle-filled" },
  success: { title: "Order placed", subtitle: "Arrives Tuesday", icon: "system-check-circle-filled" },
};

/**
 * A Toast that restores itself in the playground previews. Toasts are transient
 * by nature — swipe-to-dismiss / auto-dismiss / close make them disappear — but
 * a documentation preview should stay populated, so we remount the toast a beat
 * after it dismisses (it re-plays its enter animation on the way back in).
 */
function PreviewToast(props: ComponentProps<typeof Toast>) {
  const [gen, setGen] = useState(0);
  return (
    <Toast
      {...props}
      key={gen}
      onDismiss={() => {
        props.onDismiss?.();
        setTimeout(() => setGen((g) => g + 1), 700);
      }}
    />
  );
}

export function ToastScreen({ navigation }: Props) {
  const [type, setType] = useState<ToastType>("dark");
  const [title, setTitle] = useState("Title goes here");
  const [subtitle, setSubtitle] = useState("Subtitle goes here");
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showAsset, setShowAsset] = useState(true);
  const [icon, setIcon] = useState<IconName>("system-info-circle-filled");
  const [showChevron, setShowChevron] = useState(true);
  const [action, setAction] = useState<ToastAction>("button");
  const [actionLabel, setActionLabel] = useState("Button");
  const [stacked, setStacked] = useState(false);

  // ── Interaction state ──
  // `replayKey` remounts the toast so the enter animation replays. `shown`
  // drives the controlled visible/auto-dismiss demo.
  const [replayKey, setReplayKey] = useState(0);
  const [shown, setShown] = useState(true);
  // Dedicated stacked-interaction toggle (animates the back card in/out).
  const [demoStacked, setDemoStacked] = useState(false);

  const playgroundPreview = (
    <PreviewSurface tall>
      <PreviewToast
        type={type}
        title={title || "Title goes here"}
        subtitle={subtitle || "Subtitle goes here"}
        showSubtitle={showSubtitle}
        showAsset={showAsset}
        icon={icon}
        showChevron={showChevron}
        action={action}
        actionLabel={actionLabel || "Button"}
        stacked={stacked}
        // Persist while configuring; auto-dismiss is demoed in Trigger & dismiss.
        // Swipe it away and it springs back so the preview stays populated.
        autoDismissMs={null}
      />
    </PreviewSurface>
  );

  const triggerPreview = (
    <PreviewSurface tall>
      <View style={{ gap: space["16"], alignItems: "center" }}>
        <View style={{ minHeight: 88, justifyContent: "center" }}>
          {shown ? (
            <Toast
              key={`trigger-${replayKey}`}
              type={type}
              title={DEFAULT_COPY[type].title}
              subtitle={DEFAULT_COPY[type].subtitle}
              icon={DEFAULT_COPY[type].icon}
              actionLabel="Undo"
              onDismiss={() => setShown(false)}
              onActionPress={() => setShown(false)}
            />
          ) : (
            <Text
              style={[
                textStyles.B12_Regular,
                { color: colour["text-n-icon"].tertiary, textAlign: "center" },
              ]}
            >
              Toast dismissed — swipe down, auto-dismiss (3s), or Undo. Press to replay.
            </Text>
          )}
        </View>
        <PrimaryButton
          label="Show toast"
          size="H48"
          onPress={() => {
            setShown(true);
            setReplayKey((k) => k + 1);
          }}
        />
      </View>
    </PreviewSurface>
  );

  const stackedPreview = (
    <PreviewSurface tall>
      <View style={{ gap: space["20"], alignItems: "center", width: "100%" }}>
        <PreviewToast
          type={type}
          title={demoStacked ? "3 notifications" : "1 notification"}
          subtitle="Tap to review"
          icon={DEFAULT_COPY[type].icon}
          stacked={demoStacked}
          autoDismissMs={null}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: space["12"] }}>
          <Text style={[textStyles.B14_Medium, { color: colour["text-n-icon"].secondary }]}>
            {demoStacked ? "Stacked (2+)" : "Single"}
          </Text>
          <FieldToggle on={demoStacked} onChange={setDemoStacked} size="H24" />
        </View>
      </View>
    </PreviewSurface>
  );

  const typesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: "100%" }}>
        {TYPES.map((t) => (
          <View key={t} style={{ gap: space["8"] }}>
            <SectionLabel>{t}</SectionLabel>
            <PreviewToast
              type={t}
              title={DEFAULT_COPY[t].title}
              subtitle={DEFAULT_COPY[t].subtitle}
              icon={DEFAULT_COPY[t].icon}
              autoDismissMs={null}
            />
          </View>
        ))}
      </View>
    </PreviewSurface>
  );

  const anatomyPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: "100%" }}>
        <View style={{ gap: space["8"] }}>
          <SectionLabel>Close action</SectionLabel>
          <PreviewToast type="dark" title="Link copied" subtitle="Paste it anywhere" action="close" autoDismissMs={null} />
        </View>
        <View style={{ gap: space["8"] }}>
          <SectionLabel>No action</SectionLabel>
          <PreviewToast type="dark" title="Link copied" subtitle="Paste it anywhere" action="none" autoDismissMs={null} />
        </View>
        <View style={{ gap: space["8"] }}>
          <SectionLabel>Title only</SectionLabel>
          <PreviewToast type="dark" title="Saved to favourites" showSubtitle={false} autoDismissMs={null} />
        </View>
        <View style={{ gap: space["8"] }}>
          <SectionLabel>No asset</SectionLabel>
          <PreviewToast type="light" title="Draft saved" subtitle="Last edited just now" showAsset={false} autoDismissMs={null} />
        </View>
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="toast"
      subtitle="Transient, non-blocking notification (snackbar). Leading asset, one-line title, one-line subtitle with an optional chevron, and a trailing button or close (✕). Four types. Slides up + fades on enter, auto-dismisses after 3s, swipe DOWN to dismiss, and shows a second card peeking behind when stacked (2+ queued)."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Toast/Toast.tsx"
      sidebar={componentsSidebar("Toast")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection heading="Playground" preview={playgroundPreview} spacingTop={0}>
        <PropList>
          <PropRow>
            <PropLabel>Type</PropLabel>
            <Dropdown<ToastType>
              value={type}
              onChange={setType}
              menuWidth={240}
              options={TYPES.map<DropdownOption<ToastType>>((t) => ({
                value: t,
                label: TYPE_LABEL[t],
                swatch: TYPE_SWATCH[t],
              }))}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Title</PropLabel>
            <DSTextInput value={title} onChangeText={setTitle} placeholder="Title goes here" />
          </PropRow>
          <PropRow>
            <PropLabel>Subtitle</PropLabel>
            <DSTextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="Subtitle goes here"
            />
          </PropRow>
          <PropRow>
            <PropLabel>Show subtitle</PropLabel>
            <Toggle value={showSubtitle} onValueChange={setShowSubtitle} />
          </PropRow>
          <PropRow>
            <PropLabel>Show asset</PropLabel>
            <Toggle value={showAsset} onValueChange={setShowAsset} />
          </PropRow>
          <PropRow>
            <PropLabel>Glyph</PropLabel>
            <Dropdown<IconName>
              value={icon}
              onChange={setIcon}
              menuWidth={240}
              options={ICONS.map<DropdownOption<IconName>>((g) => ({
                value: g,
                label: ICON_LABEL[g] ?? g,
                icon: g,
              }))}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Subtitle icon</PropLabel>
            <Toggle value={showChevron} onValueChange={setShowChevron} />
          </PropRow>
          <PropRow>
            <PropLabel>Action</PropLabel>
            <View style={{ minWidth: 240 }}>
              <FieldSwitch<ToastAction>
                options={ACTIONS.map((a) => ({ value: a, label: ACTION_LABEL[a] }))}
                value={action}
                onChange={setAction}
              />
            </View>
          </PropRow>
          {action === "button" ? (
            <PropRow>
              <PropLabel>Action label</PropLabel>
              <DSTextInput value={actionLabel} onChangeText={setActionLabel} placeholder="Button" />
            </PropRow>
          ) : null}
          <PropRow last>
            <PropLabel>Stacked</PropLabel>
            <Toggle value={stacked} onValueChange={setStacked} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Trigger & dismiss" preview={triggerPreview}>
        <Caption>
          Enter animation, swipe-down-to-dismiss, 3s auto-dismiss (fades while
          dropping down), and an Undo action — the full transient lifecycle.
        </Caption>
      </DetailSection>

      <DetailSection heading="Stacked interaction" preview={stackedPreview}>
        <Caption>
          Toggle the queue: the second card fades in and rises to peek behind
          the front toast (M-Stacked Toast).
        </Caption>
      </DetailSection>

      <DetailSection heading="Types" preview={typesPreview} />

      <DetailSection heading="Anatomy" preview={anatomyPreview} />
    </PageScaffold>
  );
}

// ─────────── Local building blocks (shared shape with InfoBannerScreen) ───────────

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
        alignItems: "center",
        minHeight: tall ? 320 : undefined,
      }}
    >
      <View style={{ width: "100%", maxWidth: 360 }}>{children}</View>
    </View>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.B11_SemiBold,
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

function Caption({ children }: { children: ReactNode }) {
  const shell = useShell();
  return (
    <Text style={[textStyles.B14_Regular, { color: shell.textSecondary }]}>
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
    <Text style={[textStyles.B16_Medium, { color: shell.textPrimary, minWidth: 96 }]}>
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

function DSTextInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View
      style={{
        minWidth: 220,
        backgroundColor: colour.surface.primary,
        borderWidth: 1,
        borderColor: colour.border.primary,
        borderRadius: radius["10"],
        paddingHorizontal: space["12"],
        paddingVertical: space["8"],
        justifyContent: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colour["text-n-icon"].muted}
        style={[
          textStyles.B14_SemiBold,
          {
            color: colour["text-n-icon"].primary,
            paddingTop: 0,
            paddingBottom: 0,
            // @ts-expect-error — outlineStyle is web-only (RN-Web)
            outlineStyle: "none",
          },
        ]}
      />
    </View>
  );
}
