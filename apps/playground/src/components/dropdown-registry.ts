/**
 * Page-level singleton tracking the currently open dropdown / icon picker.
 *
 * Whichever popover opens last becomes the only open one — every subscribed
 * instance closes itself when the active id changes. Shared across the
 * Dropdown component and the IconPicker (and any future popover) so they
 * coordinate, regardless of which file declares the consumer.
 */

import { useCallback, useEffect, useState } from "react";

type Subscriber = () => void;

type Registry = {
  id: string | null;
  subs: Set<Subscriber>;
};

function getRegistry(): Registry {
  if (typeof window === "undefined") {
    // Native fallback — no portal lookup happens but the hook still has to
    // be callable. A throwaway registry per call is fine on native; the UI
    // doesn't open popovers there.
    return { id: null, subs: new Set() };
  }
  const w = window as unknown as { __fdsDropdownRegistry?: Registry };
  if (!w.__fdsDropdownRegistry) {
    w.__fdsDropdownRegistry = { id: null, subs: new Set() };
  }
  return w.__fdsDropdownRegistry;
}

function notify(reg: Registry) {
  reg.subs.forEach((cb) => cb());
}

export function useDropdownRegistry(id: string) {
  const [, force] = useState(0);

  useEffect(() => {
    const reg = getRegistry();
    const cb = () => force((c) => c + 1);
    reg.subs.add(cb);
    return () => {
      reg.subs.delete(cb);
      // If this instance was the active one, clear the registry on unmount
      // so a stale id doesn't prevent the next dropdown from opening.
      if (reg.id === id) {
        reg.id = null;
        notify(reg);
      }
    };
  }, [id]);

  const isOpen = getRegistry().id === id;

  const close = useCallback(() => {
    const reg = getRegistry();
    if (reg.id !== id) return;
    reg.id = null;
    notify(reg);
  }, [id]);

  const toggle = useCallback(() => {
    const reg = getRegistry();
    reg.id = reg.id === id ? null : id;
    notify(reg);
  }, [id]);

  return { isOpen, close, toggle };
}
