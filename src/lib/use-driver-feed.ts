"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError, currentPosition, errorMessage, openSocket, type AssistanceRequest, type Tracking } from "./api";
import type { LoadOffer } from "@/components/driver/shared";

type AvailableRequest = Pick<AssistanceRequest, "id" | "service" | "vehicleName" | "originLat" | "originLng" | "destinationLat" | "destinationLng" | "distanceMeters" | "priceToman" | "createdAt">;
export function toLoad(request: AvailableRequest & Partial<AssistanceRequest>): LoadOffer {
  return {
    id: request.id, customer: "مشتری خودرو چاره", role: "درخواست امداد", rating: 0, tone: 0,
    car: request.vehicleName, plate: request.vehiclePlate || "—",
    from: request.originAddress || "نشانی مبدأ ثبت نشده",
    to: request.destinationLat != null && request.destinationLng != null ? request.destinationAddress || "نشانی مقصد ثبت نشده" : "تعمیر در مبدأ",
    distanceKm: (request.distanceMeters || 0) / 1000, price: request.priceToman || 0,
    priceKnown: request.priceToman != null,
    when: new Date(request.createdAt).toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }),
    weight: request.service === "TOWING" ? "حمل خودرو" : "تعمیر در محل", note: (request.problem || (request.service === "TOWING" ? "درخواست حمل خودرو" : "درخواست تعمیر در محل")) + (request.service === "REPAIR" ? " · ورودی ۸۰۰٬۰۰۰ تومان؛ هزینه قطعات پس از بررسی خودرو محاسبه می‌شود." : ""),
    phone: "", status: request.status === "PENDING" ? "pending" : request.status === "COMPLETED" ? "done" : "active",
    lat: request.originLat, lng: request.originLng, partsQuoteToman: request.partsQuoteToman, partsApprovedToman: request.partsApprovedToman, service: request.service, serverStatus: request.status,
  };
}

export function useDriverFeed(ready: boolean, notify: (message: string) => void) {
  const [earnings, setEarnings] = useState(0);
  const [loads, setLoads] = useState<LoadOffer[]>([]);
  const [tracking, setTracking] = useState<Tracking>({ driver: null });
  const notifyRef = useRef(notify);
  const fetching = useRef(false);
  const busy = useRef(false);
  useEffect(() => { notifyRef.current = notify; }, [notify]);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      const [assigned, pending, earningTotal] = await Promise.all([
        api<AssistanceRequest[]>("/requests", { signal }),
        ready ? api<AvailableRequest[]>("/drivers/requests/available", { signal }) : Promise.resolve([]),
        api<{ totalToman: number }>("/drivers/earnings", { signal }),
      ]);
      if (signal?.aborted) return;
      setEarnings(earningTotal.totalToman);
      const own = assigned.filter(r => r.status !== "CANCELLED");
      // The available endpoint deliberately omits private fields and status.
      const offers = pending.map(request => ({ ...request, status: "PENDING" as const, driverId: null }));
      const merged = new Map([...offers, ...own].map(r => [r.id, toLoad(r)]));
      setLoads([...merged.values()]);
      const active = own.find(r => ["ACCEPTED", "ARRIVED"].includes(r.status));
      if (active) {
        const result = await api<Tracking>(`/requests/${active.id}/tracking`, { signal });
        if (!signal?.aborted) setTracking(result);
      } else setTracking({ driver: null });
    } catch { /* Next poll/reconnect retries safe reads only. */ }
    finally { fetching.current = false; }
  }, [ready]);
  useEffect(() => {
    const controller = new AbortController();
    const socket = openSocket();
    const update = () => { void refresh(controller.signal); };
    socket.on("connect", update);
    socket.on("request:updated", update);
    socket.on("driver:location", (payload: Tracking) => setTracking(payload));
    update();
    const timer = window.setInterval(() => {
      setTracking(current => current.driver && Date.now() - Date.parse(current.driver.recordedAt) > 120000 ? { driver: null, stale: true } : current);
      update();
    }, 5000);
    return () => { controller.abort(); window.clearInterval(timer); socket.disconnect(); };
  }, [refresh]);
  const active = loads.find(l => l.status === "active") || null;
  const activeId = active?.id;
  useEffect(() => {
    if (!ready && !activeId) return;
    let cancelled = false;
    let sending = false;
    let warned = false;
    async function send() {
      if (sending || cancelled) return;
      sending = true;
      try {
        const point = await currentPosition();
        if (!cancelled) await api("/drivers/location", { method: "PUT", body: point });
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) return;
        if (!cancelled && !warned) { notifyRef.current(errorMessage(error)); warned = true; }
      } finally { sending = false; }
    }
    void send();
    const timer = window.setInterval(send, 5000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [ready, activeId]);
  const accept = async (load: LoadOffer) => {
    if (busy.current) return false;
    busy.current = true;
    try {
      try { await api("/drivers/location", { method: "PUT", body: await currentPosition() }); }
      catch (error) { if (!(error instanceof ApiError) || error.status !== 409) throw error; }
      const request = await api<AssistanceRequest>(`/requests/${load.id}/accept`, { method: "POST" });
      setLoads(items => items.map(item => item.id === load.id ? toLoad(request) : item));
      await refresh();
      return true;
    } catch (error) { notifyRef.current(errorMessage(error)); await refresh(); return false; }
    finally { busy.current = false; }
  };
  const status = async (load: LoadOffer, next: "ARRIVED" | "COMPLETED") => {
    const request = await api<AssistanceRequest>(`/requests/${load.id}/status`, { method: "PATCH", body: { status: next } });
    setLoads(items => items.map(item => item.id === load.id ? toLoad(request) : item));
    return true;
  };
  return { earnings, loads, active, tracking, accept, status, refresh };
}
