"use client";
import { useEffect, useRef, useState } from "react";
import { api, openSocket, type AssistanceRequest, type Tracking } from "./api";
import { useSessionState } from "./session";

export function useAuthenticatedUser() {
  return useSessionState().user;
}

export function useLiveRequest(id: string, initialRequest?: AssistanceRequest) {
  const initial = useRef(initialRequest);
  useEffect(() => { initial.current = initialRequest; }, [initialRequest]);
  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [tracking, setTracking] = useState<Tracking>({ driver: null });
  useEffect(() => {
    const controller = new AbortController();
    let running = false;
    let confirmed = initial.current?.id === id ? initial.current : null;
    async function refresh() {
      if (running) return;
      running = true;
      const trackingController = new AbortController();
      const trackingSignal = AbortSignal.any([controller.signal, trackingController.signal]);
      const readTracking = () => api<Tracking>(`/requests/${encodeURIComponent(id)}/tracking`, { signal: trackingSignal }).catch(() => null);
      // The existing screen already has an authenticated request snapshot.
      // Read in parallel, but publish GPS only after fresh request authorization.
      const pendingTracking = confirmed && !["COMPLETED", "CANCELLED", "EXPIRED"].includes(confirmed.status) ? readTracking() : null;
      try {
        const current = await api<AssistanceRequest>(`/requests/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        confirmed = current;
        setRequest(current);
        if (current.status === "COMPLETED" || current.status === "CANCELLED" || current.status === "EXPIRED") { setTracking({ driver: null }); return; }
        const next = await (pendingTracking || readTracking());
        if (next && !controller.signal.aborted) setTracking(next);
      } catch { /* Keep the last confirmed status; stale GPS is hidden below. */ }
      finally { trackingController.abort(); running = false; }
    }
    const socket = openSocket();
    socket.on("connect", refresh);
    socket.on("request:updated", (data: AssistanceRequest) => { if (data.id === id) void refresh(); });
    socket.on("driver:location", (data: Tracking & { requestId: string }) => { if (data.requestId === id) setTracking(data); });
    void refresh();
    const timer = window.setInterval(() => {
      setTracking(current => current.driver && Date.now() - Date.parse(current.driver.recordedAt) > 120000 ? { driver: null, stale: true } : current);
      void refresh();
    }, 5000);
    return () => { controller.abort(); window.clearInterval(timer); socket.disconnect(); };
  }, [id]);
  return { request, tracking };
}
