"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError, currentPosition, errorMessage, openSocket, type AssistanceRequest, type Tracking } from "./api";
import type { LoadOffer } from "@/components/driver/shared";

const PENDING_LIFETIME_MS = 6 * 60 * 60 * 1000;

export type PendingLoadAction={id:string;phase:"accept"|"location"};

type AvailableRequest = Pick<AssistanceRequest, "id" | "service" | "vehicleName" | "originLat" | "originLng" | "destinationLat" | "destinationLng" | "distanceMeters" | "priceToman" | "createdAt">;
const loadDateFormatter = new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
export function toLoad(request: AvailableRequest & Partial<AssistanceRequest>): LoadOffer {
  const createdAt = new Date(request.createdAt);
  return {
    driverCommissionConfirmedAt: request.driverCommissionConfirmedAt,
    operationsStartedAt: request.operationsStartedAt,paymentMethod:request.payment?.method, paymentStatus: request.payment?.status, gatewayPaid: request.payment?.status === "VERIFIED" && !!request.payment.checkouts?.length, finalAmountToman: request.payment?.amountToman,
    expiresAt: request.status === "PENDING" && Number.isFinite(createdAt.getTime()) ? new Date(createdAt.getTime() + PENDING_LIFETIME_MS).toISOString() : undefined,
    id: request.id, customer: request.customer?.fullName || "مشتری خودرو چاره", role: "درخواست امداد", rating: 0, tone: 0,
    car: request.vehicleName, plate: request.vehiclePlate || "—",
    from: request.originAddress || "نشانی مبدأ ثبت نشده",
    to: request.destinationLat != null && request.destinationLng != null ? request.destinationAddress || "نشانی مقصد ثبت نشده" : request.service==='REPAIR'?"تعمیر در مبدأ":"انجام خدمت در مبدأ",
    distanceKm: (request.distanceMeters || 0) / 1000, price: request.priceToman || 0,
    priceKnown: request.priceToman != null,
    when: Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }) : loadDateFormatter.format(createdAt),
    weight: ({TOWING:"حمل خودرو",REPAIR:"تعمیر در محل",MOBILE_CARWASH:"کارواش سیار",PERIODIC_SERVICE:"سرویس دوره‌ای در محل",INSPECTION:"کارشناسی خودرو"})[request.service || "REPAIR"], note: (request.pricingBreakdown?.items?.map(item=>item.name).join("، ") || request.problem || (request.service === "TOWING" ? "درخواست حمل خودرو" : "درخواست تعمیر در محل")) + (request.service === "REPAIR" ? " · ورودی ۸۰۰٬۰۰۰ تومان؛ هزینه قطعات پس از بررسی خودرو محاسبه می‌شود." : ""),
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
  const paidRevision=useRef('');
  const refreshToken=useRef(0),earningsFetching=useRef(false),trackingFetching=useRef(false);
  const invalidateRefresh=useCallback(()=>{refreshToken.current++;fetching.current=false;},[]);
  const busy = useRef(false);
  const revision = useRef(0);
  const gpsInFlight = useRef<Promise<void>|null>(null);
  const [pendingAction,setPendingAction] = useState<PendingLoadAction|null>(null);
  const syncLocation = useCallback(() => {
    if(gpsInFlight.current)return gpsInFlight.current;
    const task=(async()=>{const point=await currentPosition();try{await api('/drivers/location',{method:'PUT',body:point});}catch(error){if(!(error instanceof ApiError)||error.status!==409)throw error;}})();
    gpsInFlight.current=task;
    void task.finally(()=>{if(gpsInFlight.current===task)gpsInFlight.current=null;}).catch(()=>{});
    return task;
  },[]);
  useEffect(() => { notifyRef.current = notify; }, [notify]);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (signal?.aborted || fetching.current) return;
    fetching.current = true;
    const startedRevision=revision.current,token=++refreshToken.current;
    if(!earningsFetching.current){earningsFetching.current=true;void api<{totalToman:number}>('/drivers/earnings',{signal}).then(result=>{if(!signal?.aborted)setEarnings(result.totalToman);}).catch(()=>{}).finally(()=>{earningsFetching.current=false;});}
    try {
      const [assigned, pending] = await Promise.all([
        api<AssistanceRequest[]>("/requests", { signal }),
        ready ? api<AvailableRequest[]>("/drivers/requests/available", { signal }) : Promise.resolve([]),
      ]);
      if (signal?.aborted || busy.current || revision.current!==startedRevision) return;
      const own = assigned.filter(r => !["CANCELLED", "EXPIRED"].includes(r.status));
      const paid=own.filter(r=>r.payment?.status==='VERIFIED').map(r=>r.id+':'+r.payment?.amountToman).sort().join('|');
      if(paid!==paidRevision.current){paidRevision.current=paid;window.dispatchEvent(new Event('khodrochare:wallet-refresh'));}
      // The available endpoint deliberately omits private fields and status.
      const offers = pending.filter(r => Date.parse(r.createdAt) + PENDING_LIFETIME_MS > Date.now()).map(request => ({ ...request, status: "PENDING" as const, driverId: null }));
      const merged = new Map([...offers, ...own].map(r => [r.id, toLoad(r)]));
      setLoads([...merged.values()]);
      const active = own.find(r => ["ACCEPTED", "ARRIVED"].includes(r.status));
      if (active && !trackingFetching.current) {
        trackingFetching.current=true;
        void api<Tracking>(`/requests/${active.id}/tracking`, { signal }).then(result=>{if(!signal?.aborted&&revision.current===startedRevision)setTracking(result);}).catch(()=>{}).finally(()=>{trackingFetching.current=false;});
      } else if(!active) setTracking({ driver: null });
    } catch { /* Next poll/reconnect retries safe reads only. */ }
    finally { if(refreshToken.current===token)fetching.current = false; }
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
    return () => { controller.abort();invalidateRefresh(); window.clearInterval(timer); socket.disconnect(); };
  }, [refresh,invalidateRefresh]);
  const nextExpiry = loads.reduce((soonest, load) => load.status === "pending" && load.expiresAt ? Math.min(soonest, Date.parse(load.expiresAt)) : soonest, Infinity);
  useEffect(() => {
    if (!Number.isFinite(nextExpiry)) return;
    const timer = window.setTimeout(() => setLoads(items => items.filter(load => load.status !== "pending" || !load.expiresAt || Date.parse(load.expiresAt) > Date.now())), Math.max(0, nextExpiry - Date.now()));
    return () => window.clearTimeout(timer);
  }, [nextExpiry]);
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
        if (!cancelled) await syncLocation();
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) return;
        if (!cancelled && !warned) { notifyRef.current(errorMessage(error)); warned = true; }
      } finally { sending = false; }
    }
    void send();
    const timer = window.setInterval(send, 5000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [ready, activeId, syncLocation]);
  const accept = async (load: LoadOffer) => {
    if (busy.current || load.status!=="pending") return false;
    if (load.expiresAt && Date.parse(load.expiresAt) <= Date.now()) {
      setLoads(items => items.filter(item => item.id !== load.id));
      notifyRef.current("مهلت پذیرش این درخواست تمام شده است.");
      return false;
    }
    busy.current = true;revision.current++;setPendingAction({id:load.id,phase:'accept'});
    try {
      let request:AssistanceRequest;
      try{request=await api<AssistanceRequest>(`/requests/${load.id}/accept`,{method:'POST'});}
      catch(error){
        if(!(error instanceof ApiError)||error.status!==409||error.code!=='Send a fresh GPS location before accepting')throw error;
        setPendingAction({id:load.id,phase:'location'});
        await syncLocation();setPendingAction({id:load.id,phase:'accept'});
        request=await api<AssistanceRequest>(`/requests/${load.id}/accept`,{method:'POST'});
      }
      revision.current++;
      setLoads(items=>[...items.filter(item=>item.id!==load.id),toLoad(request)]);
      return true;
    } catch(error){notifyRef.current(errorMessage(error));return false;}
    finally{busy.current=false;setPendingAction(null);void refresh();}
  };
  const status = async (load: LoadOffer, next: "ARRIVED" | "COMPLETED") => {
    revision.current++;
    const request = await api<AssistanceRequest>(`/requests/${load.id}/status`, { method: "PATCH", body: { status: next } });
    revision.current++;
    setLoads(items => items.map(item => item.id === load.id ? toLoad(request) : item));
    return true;
  };
  return { earnings, loads, active, tracking, accept, status, refresh, pendingAction };
}
