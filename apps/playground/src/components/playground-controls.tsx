import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

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
 *  PreviewSurface. */
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

export function SegmentedControl<T extends string>({
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
