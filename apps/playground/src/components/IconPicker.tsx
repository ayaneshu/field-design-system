import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { useDropdownRegistry } from "./dropdown-registry";
import { useShell } from "../theme/ThemeContext";

/**
 * Curated system-icon set for every button playground picker. Covers the
 * common button-glyph cases (directional arrows, plus, search, edit, etc.)
 * without overwhelming the dropdown.
 */
export const ICON_OPTIONS: IconName[] = [
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

type Rect = { top: number; left: number; width: number; height: number };

function useTriggerRect(triggerRef: React.MutableRefObject<View | null>, isOpen: boolean) {
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || Platform.OS !== "web") {
      setRect(null);
      return;
    }
    let cancelled = false;
    let frame = 0;
    let last: Rect | null = null;
    const tick = () => {
      if (cancelled) return;
      const node = triggerRef.current as unknown as HTMLElement | null;
      if (node && typeof node.getBoundingClientRect === "function") {
        const r = node.getBoundingClientRect();
        const next: Rect = {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        };
        if (
          !last ||
          last.top !== next.top ||
          last.left !== next.left ||
          last.width !== next.width ||
          last.height !== next.height
        ) {
          last = next;
          setRect(next);
        }
      }
      frame = window.requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isOpen, triggerRef]);

  return rect;
}

function PickerTrigger({
  value,
  open,
  triggerRef,
  onPress,
  ariaLabel,
}: {
  value: IconName | null;
  open: boolean;
  triggerRef: React.MutableRefObject<View | null>;
  onPress: () => void;
  ariaLabel: string;
}) {
  const shell = useShell();
  const label = value ?? "None";
  return (
    <Pressable
      ref={triggerRef as never}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={ariaLabel}
      // @ts-expect-error hovered is web-only
      style={({ hovered }: { hovered?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["8"],
        paddingVertical: space["8"],
        paddingHorizontal: space["12"],
        borderRadius: radius["8"],
        borderWidth: 1,
        borderColor: open
          ? colour.border.action
          : hovered
            ? colour.border.medium
            : shell.border,
        backgroundColor: colour.surface.primary,
        justifyContent: "space-between",
      })}
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
            <Icon name={value} size={16} color={shell.textPrimary} />
          ) : (
            <View
              style={{
                width: 12,
                height: 1,
                backgroundColor: shell.textTertiary,
              }}
            />
          )}
        </View>
        <Text
          numberOfLines={1}
          style={[
            textStyles.B12_SemiBold,
            { color: shell.textPrimary, flex: 1 },
          ]}
        >
          {label}
        </Text>
      </View>
      <Icon
        name="system-chevron-down"
        size={16}
        color={shell.textTertiary}
      />
    </Pressable>
  );
}

function FloatingMenu({
  rect,
  open,
  onClose,
  children,
}: {
  rect: Rect | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const shell = useShell();
  if (!open || Platform.OS !== "web" || !rect) return null;
  if (typeof document === "undefined") return null;

  const MENU_WIDTH = 280;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const left =
    rect.left + MENU_WIDTH <= viewportW - 8
      ? rect.left
      : Math.max(8, viewportW - MENU_WIDTH - 8);
  const spaceBelow = viewportH - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const flipUp = spaceBelow < 220 && spaceAbove > spaceBelow;
  const top = flipUp ? Math.max(8, rect.top - 6) : rect.top + rect.height + 6;
  const transform = flipUp ? "translateY(-100%)" : undefined;
  const transformOrigin = flipUp ? "bottom left" : "top left";
  const maxHeight = Math.min(
    360,
    flipUp ? spaceAbove - 16 : spaceBelow - 16,
  );

  return createPortal(
    <>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close icon picker"
        // @ts-expect-error — `position: "fixed"` is web-only; RN ignores it.
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
        }}
      />
      <View
        // @ts-expect-error — fixed positioning + transform are web-only.
        style={{
          position: "fixed",
          top,
          left,
          width: MENU_WIDTH,
          maxHeight,
          backgroundColor: colour.surface.primary,
          borderRadius: radius["12"],
          borderWidth: 1,
          borderColor: shell.border,
          paddingVertical: space["4"],
          zIndex: 2147483647,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          transform,
          transformOrigin,
        }}
      >
        <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator>
          {children}
        </ScrollView>
      </View>
    </>,
    document.body,
  );
}

/**
 * Icon dropdown — a select-style trigger that shows the current icon glyph +
 * its slug, opens a portaled floating menu where each row pairs the icon
 * preview with its name. "None" sits at the top to clear the selection.
 */
export function IconPicker({
  value,
  onChange,
}: {
  value: IconName | null;
  onChange: (next: IconName | null) => void;
}) {
  const id = useId();
  const { isOpen, toggle, close } = useDropdownRegistry(id);
  const triggerRef = useRef<View | null>(null);
  const rect = useTriggerRect(triggerRef, isOpen);
  const label = value ?? "None";

  const select = (next: IconName | null) => {
    close();
    onChange(next);
  };

  return (
    <View style={{ minWidth: 220 }}>
      <PickerTrigger
        value={value}
        open={isOpen}
        triggerRef={triggerRef}
        onPress={toggle}
        ariaLabel={`Pick icon — current: ${label}`}
      />
      <FloatingMenu rect={rect} open={isOpen} onClose={close}>
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
      </FloatingMenu>
    </View>
  );
}

/**
 * Icon-only variant of {@link IconPicker} — no "None" row, since IconButton
 * always requires a glyph. Shares the same trigger + popup chrome as the
 * nullable picker so the controls UI stays consistent.
 */
export function RequiredIconPicker({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (next: IconName) => void;
}) {
  const id = useId();
  const { isOpen, toggle, close } = useDropdownRegistry(id);
  const triggerRef = useRef<View | null>(null);
  const rect = useTriggerRect(triggerRef, isOpen);

  const select = (next: IconName) => {
    close();
    onChange(next);
  };

  return (
    <View style={{ minWidth: 220 }}>
      <PickerTrigger
        value={value}
        open={isOpen}
        triggerRef={triggerRef}
        onPress={toggle}
        ariaLabel={`Pick icon — current: ${value}`}
      />
      <FloatingMenu rect={rect} open={isOpen} onClose={close}>
        {ICON_OPTIONS.map((name) => (
          <DropdownRow
            key={name}
            iconName={name}
            label={name}
            active={value === name}
            onPress={() => select(name)}
          />
        ))}
      </FloatingMenu>
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
  const shell = useShell();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: active }}
      // @ts-expect-error hovered is web-only and provided by RN-Web Pressable
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["12"],
        paddingVertical: space["10"],
        paddingHorizontal: space["12"],
        backgroundColor: active
          ? colour.surface["action-subtle"]
          : pressed
            ? colour.surface.muted
            : hovered
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
              active ? colour["text-n-icon"].action : shell.textPrimary
            }
          />
        ) : (
          <View
            style={{
              width: 12,
              height: 1.5,
              backgroundColor: shell.textTertiary,
            }}
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          textStyles.B14_Medium,
          {
            color: active ? colour["text-n-icon"].action : shell.textPrimary,
            flex: 1,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
