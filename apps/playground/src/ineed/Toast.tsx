/**
 * I NEED… toast — RN port of components/field/Toast.tsx.
 *
 * The original used a global React context provider. Here each screen owns a
 * small stack via `useToastStack()` and renders `<ToastStack>` in an absolute
 * overlay — simpler than threading a provider through the navigation stack.
 */
import { useCallback, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";

import { c, ts } from "./tokens";

type Tone = "success" | "error" | "neutral";

export interface ToastItem {
  id: number;
  tone: Tone;
  title: string;
  description?: string;
}

export function useToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((i) => i.id !== id));
    }, 4200);
  }, []);

  return { toasts, push };
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  return (
    <View
      pointerEvents="none"
      // @ts-expect-error position: fixed is web-only
      style={{
        position: Platform.OS === "web" ? "fixed" : "absolute",
        bottom: 24,
        right: 24,
        gap: 10,
        maxWidth: 360,
        zIndex: 1000,
      }}
    >
      {toasts.map((it) => {
        const accent =
          it.tone === "success" ? c.success : it.tone === "error" ? c.error : c.action;
        return (
          <View
            key={it.id}
            style={{
              backgroundColor: c.surfaceInverted,
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderLeftWidth: 3,
              borderLeftColor: accent,
              ...(Platform.OS === "web"
                ? { boxShadow: "0 12px 32px rgba(16,22,40,0.24)" }
                : { elevation: 10 }),
            }}
          >
            <Text style={[ts("Body_B14_SemiBold"), { color: "#ffffff" }]}>{it.title}</Text>
            {it.description ? (
              <Text
                style={[
                  ts("Body_B12_Regular"),
                  { color: "rgba(255,255,255,0.7)", marginTop: 3 },
                ]}
              >
                {it.description}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
