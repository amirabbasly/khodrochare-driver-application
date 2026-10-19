"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getSession, openSocket, updateSessionUser, type AssistanceRequest, type Tracking, type User } from "./api";

export function useAuthenticatedUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const unauthorized = () => router.replace("/");
    window.addEventListener("khodrochare:unauthorized", unauthorized);
    if (!getSession()) unauthorized();
    else api<User>("/me", { signal: controller.signal }).then(user => {
      if (controller.signal.aborted) return;
      updateSessionUser(user); setUser(user);
    }).catch(() => {});
    return () => { controller.abort(); window.removeEventListener("khodrochare:unauthorized", unauthorized); };
  }, [router]);
  return user;
}

export function useLiveRequest(id: string) {
  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [tracking, setTracking] = useState<Tracking>({ driver: null });
  useEffect(() => {
    const controller = new AbortController();
    let running = false;
    async function refresh() {
      if (running) return;
      running = true;
      try {
        const current = await api<AssistanceRequest>(`/requests/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setRequest(current);
        if (current.status === "COMPLETED" || current.status === "CANCELLED") { setTracking({ driver: null }); return; }
        const next = await api<Tracking>(`/requests/${encodeURIComponent(id)}/tracking`, { signal: controller.signal });
        if (!controller.signal.aborted) setTracking(next);
      } catch { /* Keep the last confirmed status; stale GPS is hidden below. */ }
      finally { running = false; }
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
