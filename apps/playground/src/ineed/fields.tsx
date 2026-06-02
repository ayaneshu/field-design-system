/**
 * I NEED… form controls — React Native port of components/field/Field.tsx.
 *
 * The original used native HTML <input>/<select>/<textarea>; here they're
 * rebuilt on RN primitives (TextInput, Pressable) so they live natively in the
 * playground. Visuals follow the Figma Field-Box: alpha-dark/4 fill, 1px
 * border, radius 12, h48, px16. A `dark` variant supports the requests view.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Icon } from "@field-ds/icons";

import { c, ts } from "./tokens";

function boxBorder(focused: boolean, invalid?: boolean, dark?: boolean): string {
  if (invalid) return c.error;
  if (focused) return c.action;
  return dark ? "rgba(255,255,255,0.14)" : c.borderPrimary;
}

/** Blue step number + label, then the control, then an optional hint. */
export function FieldGroup({
  index,
  label,
  children,
  hint,
  optional,
}: {
  index: string;
  label: string;
  children: ReactNode;
  hint?: ReactNode;
  optional?: boolean;
}) {
  return (
    <View style={{ gap: 12, width: "100%" }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "baseline" }}>
        <Text style={[ts("B16_Bold"), { color: c.action }]}>{index}</Text>
        <Text style={[ts("B16_SemiBold"), { color: c.textPrimary }]}>{label}</Text>
        {optional ? (
          <Text style={[ts("B12_Regular"), { color: c.textMuted }]}>(optional)</Text>
        ) : null}
      </View>
      {children}
      {hint}
    </View>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  keyboardType,
  invalid,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "url";
  invalid?: boolean;
  dark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={c.textMuted}
      keyboardType={keyboardType}
      autoCapitalize="none"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        ts("B14_Regular"),
        {
          height: 48,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: boxBorder(focused, invalid, dark),
          backgroundColor: dark ? "rgba(255,255,255,0.04)" : c.fieldFill,
          color: dark ? "#ffffff" : c.textPrimary,
          width: "100%",
          // @ts-expect-error web-only: kill the default focus ring
          outlineStyle: "none",
        },
      ]}
    />
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={c.textMuted}
      multiline
      textAlignVertical="top"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        ts("B14_Regular"),
        {
          minHeight: 132,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: boxBorder(focused, invalid),
          backgroundColor: c.fieldFill,
          color: c.textPrimary,
          width: "100%",
          // @ts-expect-error web-only
          outlineStyle: "none",
        },
      ]}
    />
  );
}

export interface Option {
  value: string;
  label: string;
}

type Rect = { top: number; left: number; width: number; height: number };

/**
 * Custom select — RN has no native <select>. A Pressable trigger toggles an
 * options panel. Because react-native-web makes every View `position:relative`,
 * an in-flow absolute panel gets trapped behind later form rows; so on web the
 * panel is portaled to <body> and fixed-positioned under the measured trigger
 * (the same trick the playground's own Dropdown uses). Native falls back to an
 * in-tree absolute panel.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  invalid,
  dark,
  searchable,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  invalid?: boolean;
  dark?: boolean;
  /** Show a filter input at the top of the panel — for long lists (icons). */
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<View | null>(null);
  const selected = options.find((o) => o.value === value);
  const empty = !value;
  const panelBg = dark ? "#1d2539" : "#ffffff";
  const panelBorder = dark ? "rgba(255,255,255,0.14)" : c.borderPrimary;
  const isWeb = Platform.OS === "web";

  const visibleOptions =
    searchable && query.trim()
      ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
      : options;

  // Measure the trigger on open so the portaled panel can anchor to it.
  useLayoutEffect(() => {
    if (!open || !isWeb) return;
    const node = triggerRef.current as unknown as HTMLElement | null;
    if (!node?.getBoundingClientRect) return;
    const r = node.getBoundingClientRect();
    setRect({ top: r.bottom, left: r.left, width: r.width, height: r.height });
  }, [open, isWeb]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const optionRows = (
    <>
      {searchable ? (
        <View style={{ paddingHorizontal: 8, paddingTop: 2, paddingBottom: 6 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Type to filter…"
            placeholderTextColor={c.textMuted}
            autoFocus
            style={[
              ts("B14_Regular"),
              {
                height: 38,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: dark ? "rgba(255,255,255,0.14)" : c.borderPrimary,
                backgroundColor: dark ? "rgba(255,255,255,0.04)" : c.surfaceSecondary,
                color: dark ? "#ffffff" : c.textPrimary,
                // @ts-expect-error web-only
                outlineStyle: "none",
              },
            ]}
          />
        </View>
      ) : null}
      <ScrollView style={{ maxHeight: 240 }} keyboardShouldPersistTaps="handled">
        {visibleOptions.length === 0 ? (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={[ts("B14_Regular"), { color: c.textMuted }]}>No matches</Text>
          </View>
        ) : null}
        {visibleOptions.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              onChange(o.value);
              close();
            }}
            style={({ hovered }: { hovered?: boolean }) => ({
              paddingHorizontal: 16,
              paddingVertical: 11,
              backgroundColor: hovered
                ? dark
                  ? "rgba(255,255,255,0.06)"
                  : c.surfaceTertiary
                : "transparent",
            })}
          >
            <Text
              style={[
                ts("B14_Regular"),
                {
                  color: dark ? "#ffffff" : c.textPrimary,
                  fontFamily: active ? "Noontree-SemiBold" : "Noontree-Regular",
                },
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
      </ScrollView>
    </>
  );

  const panelStyle = {
    backgroundColor: panelBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: panelBorder,
    paddingVertical: 6,
    ...(isWeb ? { boxShadow: "0 12px 32px rgba(16,22,40,0.18)" } : { elevation: 8 }),
  } as const;

  return (
    <View style={{ width: "100%" }}>
      <Pressable
        ref={triggerRef}
        onPress={() => setOpen((o) => !o)}
        style={{
          height: 48,
          paddingLeft: 16,
          paddingRight: 40,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: boxBorder(open, invalid, dark),
          backgroundColor: dark ? "rgba(255,255,255,0.04)" : c.fieldFill,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          numberOfLines={1}
          style={[
            ts("B14_Regular"),
            { color: empty ? c.textMuted : dark ? "#ffffff" : c.textPrimary, flex: 1 },
          ]}
        >
          {selected ? selected.label : placeholder ?? "Select"}
        </Text>
        <View style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}>
          <Icon
            name="system-chevron-down"
            size={20}
            color={dark ? "rgba(255,255,255,0.6)" : c.textTertiary}
          />
        </View>
      </Pressable>

      {/* Web: portal the panel to <body> so it escapes the form's stacking. */}
      {open && isWeb && rect
        ? createPortal(
            <>
              <Pressable
                onPress={close}
                // @ts-expect-error fixed full-screen backdrop (web-only)
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }}
              />
              <View
                // @ts-expect-error fixed positioning + zIndex (web-only)
                style={{
                  position: "fixed",
                  top: rect.top + 6,
                  left: rect.left,
                  width: rect.width,
                  zIndex: 9999,
                  ...panelStyle,
                }}
              >
                {optionRows}
              </View>
            </>,
            document.body,
          )
        : null}

      {/* Native fallback: in-tree absolute panel. */}
      {open && !isWeb ? (
        <View style={{ position: "absolute", top: 54, left: 0, right: 0, zIndex: 31, ...panelStyle }}>
          {optionRows}
        </View>
      ) : null}
    </View>
  );
}

/** Pill segmented control (Type: New / Improvement). */
export function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        backgroundColor: c.fieldFill,
        borderRadius: 9999,
        padding: 4,
      }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: active ? "#ffffff" : "transparent",
              backgroundColor: active ? "#ffffff" : "transparent",
              alignItems: "center",
              ...(active && Platform.OS === "web"
                ? { boxShadow: "0 1px 3px rgba(34,34,34,0.06)" }
                : null),
            }}
          >
            <Text
              style={[
                ts("B14_SemiBold"),
                { color: active ? c.textPrimary : c.textTertiary },
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
