"use client";
import { useEffect } from 'react';
import { api } from '@/lib/api';
type Point = { latitude: number; longitude: number; recordedAt: string };
export function LocationTelemetry() {
  useEffect(() => {
    let watcher: number | undefined;
    let timer: number | undefined;
    let flushTimer: number | undefined;
    let pending: Point | null = null;
    let disposed = false, sending = false, lastSent = 0;
    const controller = new AbortController();
    async function send(point: Point) {
      if (disposed) return;
      if (sending || Date.now() - lastSent < 10000) {
        pending = point;
        if (flushTimer === undefined) flushTimer = window.setTimeout(() => {
          flushTimer = undefined;
          const latest = pending; pending = null;
          if (latest) void send(latest);
        }, Math.max(1000, 10000 - (Date.now() - lastSent)));
        return;
      }
      sending = true; lastSent = Date.now();
      try { sessionStorage.setItem('khodrochare_location_v1', JSON.stringify(point)); await api('/me/location', { method: 'PUT', body: point, signal: controller.signal }); }
      catch { /* The next device sample retries; old coordinates are never timestamped as fresh. */ }
      finally { sending = false; }
    }
    const receive = (position: GeolocationPosition) => { void send({ latitude: position.coords.latitude, longitude: position.coords.longitude, recordedAt: new Date(position.timestamp).toISOString() }); };
    async function start(point?: Point) {
      // The permission dialog already obtained a real device sample. Send it immediately.
      if (point && Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Number.isFinite(Date.parse(point.recordedAt))) void send(point);
      if (disposed || watcher !== undefined || !navigator.geolocation) return;
      let allowed = false;
      try { allowed = localStorage.getItem('khodrochare_location_choice_v2') === 'granted'; } catch {}
      try { allowed = (await navigator.permissions.query({ name: 'geolocation' })).state === 'granted'; } catch {}
      if (!allowed || disposed || watcher !== undefined) return;
      watcher = navigator.geolocation.watchPosition(receive, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
      const sample = () => navigator.geolocation.getCurrentPosition(receive, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });
      sample();
      timer = window.setInterval(sample, 15000);
    }
    const granted = (event: Event) => { void start((event as CustomEvent<Point>).detail); };
    void start(); window.addEventListener('khodrochare:location', granted);
    return () => { disposed = true; controller.abort(); if (watcher !== undefined) navigator.geolocation.clearWatch(watcher); if (timer !== undefined) clearInterval(timer); if (flushTimer !== undefined) clearTimeout(flushTimer); window.removeEventListener('khodrochare:location', granted); };
  }, []);
  return null;
}
