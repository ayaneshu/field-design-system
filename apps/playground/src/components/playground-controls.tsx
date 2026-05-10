import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Toggle as FieldToggle } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { useShell } from "../theme/ThemeContext";

/** Light-tinted island that hosts a live preview at the right of a
 *  DetailSection. Use `tall` for screens whose preview needs vertical
 *  breathing room (e.g. centred CTA on a bottom-sheet mockup). */
export function PreviewSurface({
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

/** Small uppercase caption used to title states / size buckets inside a
 *  PreviewSurface. PreviewSurface stays light-only (it hosts M-Components),
 *  so this label stays anchored to the light-mode tertiary token rather than
 *  flipping with the shell theme. */
export function SectionLabel({ children }: { children: ReactNode }) {
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

export function PropList({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export function PropRow({
  children,
  last,
}: {
  children: ReactNode;
  last?: boolean;
}) {
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

export function PropLabel({ children }: { children: ReactNode }) {
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

export function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return <FieldToggle on={value} onChange={onValueChange} size="H20" />;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  const shell = useShell();
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        backgroundColor: shell.sidebarBg,
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
                ? shell.sidebarRowActiveBg
                : "transparent",
            }}
          >
            <Text
              style={[
                textStyles.Body_B12_SemiBold,
                {
                  color: active ? shell.textPrimary : shell.textTertiary,
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
