"use client";

import { useEffect } from "react";

// Page zoom is locked; map controls and map-local gestures remain available.
export function AppZoomGuard() {
  useEffect(() => {
    const options: AddEventListenerOptions = { capture: true, passive: false };
    const inMap = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".leaflet-container"));
    const cancel = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };
    const gesture = (event: Event) => {
      if (!inMap(event.target)) cancel(event);
    };
    const touch = (event: TouchEvent) => {
      if (event.touches.length > 1 && !inMap(event.target)) cancel(event);
    };
    const wheel = (event: WheelEvent) => {
      // Trackpad pinch is also exposed as a Ctrl+wheel event in Chromium.
      if (event.ctrlKey || event.metaKey) cancel(event);
    };
    const key = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      if (
        ["+", "-", "=", "_"].includes(event.key) ||
        ["Equal", "Minus", "NumpadAdd", "NumpadSubtract"].includes(event.code)
      ) cancel(event);
      // Keep Ctrl/Cmd+0 available to recover any pre-existing browser zoom.
    };

    window.addEventListener("touchstart", touch, options);
    window.addEventListener("touchmove", touch, options);
    window.addEventListener("gesturestart", gesture, options);
    window.addEventListener("gesturechange", gesture, options);
    window.addEventListener("gestureend", gesture, options);
    window.addEventListener("wheel", wheel, options);
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("touchstart", touch, true);
      window.removeEventListener("touchmove", touch, true);
      window.removeEventListener("gesturestart", gesture, true);
      window.removeEventListener("gesturechange", gesture, true);
      window.removeEventListener("gestureend", gesture, true);
      window.removeEventListener("wheel", wheel, true);
      window.removeEventListener("keydown", key, true);
    };
  }, []);

  return null;
}
