import { useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Toggle, type ToggleSize } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Toggle">;

const SIZES: ToggleSize[] = ["H16", "H20", "H24"];

export function ToggleScreen({ navigation }: Props) {
  const [on, setOn] = useState(false);
  const [size, setSize] = useState<ToggleSize>("H20");
  const [disabled, setDisabled] = useState(false);

  const playgroundPreview = (
    <PreviewSurface tall>
      <Toggle
        on={on}
        onChange={setOn}
        size={size}
        disabled={disabled}
        accessibilityLabel="Playground toggle"
      />
    </PreviewSurface>
  );

  const sizesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <PreviewSurface key={s}>
          <Text
            style={[
              textStyles.Body_B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: space["12"],
              },
            ]}
          >
            {s}
          </Text>
          <View style={{ flexDirection: "row", gap: space["20"] }}>
            <Toggle size={s} defaultOn={false} accessibilityLabel={`${s} off`} />
            <Toggle size={s} defaultOn accessibilityLabel={`${s} on`} />
            <Toggle
              size={s}
              defaultOn={false}
              disabled
              accessibilityLabel={`${s} off disabled`}
            />
            <Toggle
              size={s}
              defaultOn
              disabled
              accessibilityLabel={`${s} on disabled`}
            />
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const statesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"] }}>
        <StateRow label="Default · Off">
          <Toggle defaultOn={false} accessibilityLabel="Default off" />
        </StateRow>
        <StateRow label="Default · On">
          <Toggle defaultOn accessibilityLabel="Default on" />
        </StateRow>
        <StateRow label="Disabled · Off">
          <Toggle defaultOn={false} disabled accessibilityLabel="Disabled off" />
        </StateRow>
        <StateRow label="Disabled · On">
          <Toggle defaultOn disabled accessibilityLabel="Disabled on" />
        </StateRow>
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="toggle"
      subtitle="Binary on/off control with a sliding thumb. Three sizes — H16 (compact), H20 (standard), H24 (prominent). The thumb crossfades the track from muted to inverted-secondary while it slides; reduced motion snaps."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Toggle/Toggle.tsx"
      sidebar={componentsSidebar("Toggle")}
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
            <SizeSelector value={size} onChange={setSize} />
          </PropRow>
          <PropRow>
            <PropLabel>On</PropLabel>
            <Toggle on={on} onChange={setOn} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle on={disabled} onChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Sizes" preview={sizesPreview} />
      <DetailSection heading="States" preview={statesPreview} />
    </PageScaffold>
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
        minHeight: tall ? 240 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function StateRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: space["16"],
      }}
    >
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
        {label}
      </Text>
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
        textStyles.Body_B16_Medium,
        { color: shell.textPrimary, minWidth: 96 },
      ]}
    >
      {children}
    </Text>
  );
}

function SizeSelector({
  value,
  onChange,
}: {
  value: ToggleSize;
  onChange: (next: ToggleSize) => void;
}) {
  const shell = useShell();
  return (
    <View style={{ flexDirection: "row", gap: space["8"] }}>
      {SIZES.map((s) => {
        const active = s === value;
        return (
          <Text
            key={s}
            onPress={() => onChange(s)}
            style={[
              textStyles.Body_B12_SemiBold,
              {
                paddingHorizontal: space["12"],
                paddingVertical: space["6"],
                borderRadius: radius["8"],
                backgroundColor: active
                  ? colour.surface["secondary-inverted"]
                  : colour.surface.tertiary,
                color: active
                  ? colour["text-n-icon"]["on-surface-bold"]
                  : shell.textPrimary,
                overflow: "hidden",
              },
            ]}
          >
            {s}
          </Text>
        );
      })}
    </View>
  );
}
