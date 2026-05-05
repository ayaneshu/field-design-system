import { useRef, useState } from "react";
import { Platform } from "react-native";

/**
 * Copy a string to the system clipboard and surface a transient toast label.
 * Web-first (uses navigator.clipboard); on native this still updates `toast`
 * for visual feedback — wire `expo-clipboard` here when shipping to native.
 */
export function useCopy() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async (text: string, label?: string) => {
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore — still show the toast so the user knows the tap registered
    }
    if (timer.current) clearTimeout(timer.current);
    setToast(label ?? text);
    timer.current = setTimeout(() => setToast(null), 1600);
  };

  return { toast, copy };
}
