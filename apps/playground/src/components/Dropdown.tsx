import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

export type DropdownOption<T> = {
  value: T;
  label: string;
  /** Optional left-slot icon glyph for the option row + trigger preview. */
  icon?: IconName;
  /** Optional 16×16 colour swatch shown in place of an icon. */
  swatch?: string;
};

// ─────────── Trigger-anchored rect tracking ───────────

type Rect = { top: number; left: number; width: number; height: number };

/**
 * Continuously track the trigger's bounding rect while open. Re-measures via
 * requestAnimationFrame so the menu glides smoothly with scroll/resize on
 * RN-Web (which scrolls inside an inner div, not the document). The loop
 * stops the moment the dropdown closes, so this is cheap.
 */
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
        // Skip the state update if nothing meaningful changed — avoids a
        // re-render every frame when the page is idle.
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

/**
 * Generic select-style dropdown. The trigger sits inline; the menu is
 * portaled to document.body so it always paints above sibling content
 * regardless of any parent stacking context. Only one dropdown can be
 * open per page — opening a new one closes the previous.
 */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select…",
  minWidth = 220,
  menuWidth = 240,
  ariaLabel,
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (next: T) => void;
  placeholder?: string;
  minWidth?: number;
  menuWidth?: number;
  ariaLabel?: string;
}) {
  const id = useId();
  const { isOpen, toggle, close } = useDropdownRegistry(id);
  const shell = useShell();
  const triggerRef = useRef<View | null>(null);
  const rect = useTriggerRect(triggerRef, isOpen);

  const current = options.find((o) => o.value === value);

  const select = (next: T) => {
    close();
    onChange(next);
  };

  return (
    <View style={{ minWidth }}>
      <Pressable
        ref={triggerRef as never}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={
          ariaLabel ?? `Pick option — current: ${current?.label ?? placeholder}`
        }
        // @ts-expect-error hovered is web-only
        style={({ hovered }: { hovered?: boolean }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          paddingVertical: space["8"],
          paddingHorizontal: space["12"],
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: isOpen
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
          <PreviewSlot icon={current?.icon} swatch={current?.swatch} />
          <Text
            numberOfLines={1}
            style={[
              textStyles.B12_SemiBold,
              { color: shell.textPrimary, flex: 1 },
            ]}
          >
            {current?.label ?? placeholder}
          </Text>
        </View>
        <Icon
          name="system-chevron-down"
          size={16}
          color={shell.textTertiary}
        />
      </Pressable>

      <FloatingMenu
        rect={rect}
        width={menuWidth}
        open={isOpen}
        onClose={close}
      >
        {options.map((opt) => (
          <DropdownRow
            key={String(opt.value)}
            option={opt}
            active={opt.value === value}
            onPress={() => select(opt.value)}
          />
        ))}
      </FloatingMenu>
    </View>
  );
}

function PreviewSlot({ icon, swatch }: { icon?: IconName; swatch?: string }) {
  const shell = useShell();
  return (
    <View
      style={{
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon ? (
        <Icon name={icon} size={16} color={shell.textPrimary} />
      ) : swatch ? (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: swatch,
            borderWidth: 1,
            borderColor: shell.border,
          }}
        />
      ) : null}
    </View>
  );
}

function FloatingMenu({
  rect,
  width,
  open,
  onClose,
  children,
}: {
  rect: Rect | null;
  width: number;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const shell = useShell();
  if (!open || Platform.OS !== "web" || !rect) return null;
  if (typeof document === "undefined") return null;

  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  // Anchor under the trigger's left edge by default, flip to the right
  // edge if the menu would overflow.
  const left =
    rect.left + width <= viewportW - 8
      ? rect.left
      : Math.max(8, viewportW - width - 8);
  // Prefer dropping below; flip above when there isn't room.
  const spaceBelow = viewportH - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const flipUp = spaceBelow < 220 && spaceAbove > spaceBelow;
  const top = flipUp ? Math.max(8, rect.top - 6) : rect.top + rect.height + 6;
  const transformOrigin = flipUp ? "bottom left" : "top left";
  const transform = flipUp ? "translateY(-100%)" : undefined;

  // Maximum height so the menu always fits the viewport — never bleeds off
  // screen, always offers internal scroll if needed.
  const maxHeight = Math.min(
    360,
    flipUp ? spaceAbove - 16 : spaceBelow - 16,
  );

  // Portal to document.body — guarantees the menu paints above every parent
  // stacking context regardless of transforms or filters in the tree.
  return createPortal(
    <>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close menu"
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
          width,
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
        <ScrollView
          style={{ maxHeight }}
          showsVerticalScrollIndicator
        >
          {children}
        </ScrollView>
      </View>
    </>,
    document.body,
  );
}

function DropdownRow<T>({
  option,
  active,
  onPress,
}: {
  option: DropdownOption<T>;
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
        {option.icon ? (
          <Icon
            name={option.icon}
            size={20}
            color={
              active ? colour["text-n-icon"].action : shell.textPrimary
            }
          />
        ) : option.swatch ? (
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              backgroundColor: option.swatch,
              borderWidth: 1,
              borderColor: shell.border,
            }}
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
        {option.label}
      </Text>
    </Pressable>
  );
}
