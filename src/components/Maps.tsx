"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Icon } from "@/components/Icons";

const TEHRAN: [number, number] = [35.6892, 51.389];
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

type LeafletModule = typeof import("leaflet");

function brandPin(L: LeafletModule) {
  return L.divIcon({
    className: "leaflet-brand-pin",
    html: '<span class="leaflet-brand-pin-dot"></span>',
    iconSize: [30, 42],
    iconAnchor: [15, 40],
  });
}

function rescuerPin(L: LeafletModule) {
  return L.divIcon({
    className: "leaflet-rescuer-pin",
    html: '<span class="leaflet-rescuer-dot"></span>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export function LocationPickerMap({
  onPick,
  onToast,
}: {
  onPick?: (lat: number, lng: number) => void;
  onToast?: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const dropPin = useCallback(
    (L: LeafletModule, map: import("leaflet").Map, lat: number, lng: number) => {
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { icon: brandPin(L), draggable: true }).addTo(map);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current?.getLatLng();
          if (pos) {
            setCoords({ lat: pos.lat, lng: pos.lng });
            onPick?.(pos.lat, pos.lng);
          }
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
      setCoords({ lat, lng });
      onPick?.(lat, lng);
    },
    [onPick],
  );

  useEffect(() => {
    let disposed = false;
    let clickHandler: ((e: import("leaflet").LeafletMouseEvent) => void) | null = null;

    async function init() {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current || mapRef.current) return;
      let initial = TEHRAN;
      try {
        const cached = JSON.parse(sessionStorage.getItem("khodrochare_location_v1") || "null");
        if (cached && Number.isFinite(cached.latitude) && Number.isFinite(cached.longitude) && Date.now() - Date.parse(cached.recordedAt) < 120000) initial = [cached.latitude, cached.longitude];
      } catch {}
      const map = L.map(containerRef.current, {
        center: initial,
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
        preferCanvas: true,
      });
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTR, crossOrigin: true }).addTo(map);
      clickHandler = (e) => dropPin(L, map, e.latlng.lat, e.latlng.lng);
      map.on("click", clickHandler);
      mapRef.current = map;
      dropPin(L, map, initial[0], initial[1]);
      window.setTimeout(() => map.invalidateSize(), 220);
    }

    init();
    return () => {
      disposed = true;
      if (mapRef.current && clickHandler) mapRef.current.off("click", clickHandler);
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [dropPin]);

  function locateMe() {
    if (!("geolocation" in navigator)) {
      onToast?.("دسترسی به موقعیت در این مرورگر ممکن نیست.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapRef.current;
        if (map) {
          import("leaflet").then(({ default: L }) => {
            dropPin(L, map, latitude, longitude);
            map.setView([latitude, longitude], 15, { animate: true });
          });
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        onToast?.("موقعیت شما پیدا نشد؛ لطفاً دسترسی مکان را بررسی کنید یا روی نقشه نقطه‌گذاری کنید.");
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 15000 },
    );
  }

  return (
    <div className="map-field">
      <div ref={containerRef} className="map-canvas" />
      <div className="map-vpn-warning" role="note">
        <Icon name="shield" size={14} /> برای سرویس‌دهی بهتر، لطفاً فیلترشکن خود را خاموش کنید.
      </div>
      <button className="map-locate-btn" type="button" onClick={locateMe} disabled={locating}>
        <Icon name="pin" size={15} /> {locating ? "در حال یافتن موقعیت..." : "موقعیت منو پیدا کن"}
      </button>
      <span className="map-coords-chip" dir="ltr">
        {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "برای انتخاب، روی نقشه بزنید"}
      </span>
    </div>
  );
}

export function TrackingMap({
  lat,
  lng,
  progress,
}: {
  lat: number;
  lng: number;
  progress: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const rescuerRef = useRef<import("leaflet").Marker | null>(null);
  const routeRef = useRef<import("leaflet").Polyline | null>(null);
  const startRef = useRef<[number, number]>([lat + 0.02, lng - 0.024]);

  useEffect(() => {
    let disposed = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        preferCanvas: true,
      });
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTR, crossOrigin: true }).addTo(map);
      L.marker([lat, lng], { icon: brandPin(L) }).addTo(map);
      const start = startRef.current;
      routeRef.current = L.polyline([start, [lat, lng]], { color: "#f47725", weight: 3.5, dashArray: "7 9", opacity: 0.85 }).addTo(map);
      rescuerRef.current = L.marker(start, { icon: rescuerPin(L) }).addTo(map);
      map.fitBounds(L.latLngBounds([start, [lat, lng]]).pad(0.65));
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 220);
    }

    init();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      rescuerRef.current = null;
      routeRef.current = null;
    };
  }, [lat, lng]);

  useEffect(() => {
    const start = startRef.current;
    const lat2 = start[0] + (lat - start[0]) * progress;
    const lng2 = start[1] + (lng - start[1]) * progress;
    rescuerRef.current?.setLatLng([lat2, lng2]);
  }, [progress, lat, lng]);

  return <div ref={containerRef} className="map-canvas" />;
}

export function UserPinMap({ lat, lng, driver }: { lat: number; lng: number; driver?: { latitude: number; longitude: number } | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const driverRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    let disposed = false;

    async function init() {
      const L = await import("leaflet");
      if (disposed || !containerRef.current || mapRef.current) return;
      const map = new L.Map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      L.marker([lat, lng], { icon: brandPin(L) }).addTo(map);
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 220);
    }

    init();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  useEffect(() => {
    let cancelled = false;
    const update = async () => {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;
      driverRef.current?.remove(); driverRef.current = null;
      if (driver) {
        driverRef.current = L.marker([driver.latitude, driver.longitude], { icon: rescuerPin(L) }).addTo(mapRef.current);
        mapRef.current.fitBounds([[lat, lng], [driver.latitude, driver.longitude]], { padding: [35, 35], maxZoom: 15 });
      }
    };
    void update();
    const timer = window.setTimeout(update, 300);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [lat, lng, driver]);

  return <div ref={containerRef} className="map-canvas" aria-label="موقعیت شما روی نقشه" />;
}

export function LoadRequestMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    let disposed = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        preferCanvas: true,
      });
      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTR, crossOrigin: true }).addTo(map);
      const icon = L.divIcon({
        className: "leaflet-request-pin",
        html: '<span class="leaflet-request-pulse"></span><span class="leaflet-request-dot"></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      markerRef.current = L.marker([lat, lng], { icon, keyboard: false, interactive: false }).addTo(map);
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 220);
      window.setTimeout(() => map.setView([lat, lng], 15, { animate: false }), 260);
    }

    init();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // the map is created once; position updates are handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markerRef.current?.setLatLng([lat, lng]);
    mapRef.current?.setView([lat, lng], 15, { animate: true, duration: 0.6 });
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="map-canvas load-map-canvas"
      role="img"
      aria-label={label ? `موقعیت ${label} روی نقشه` : "موقعیت امدادخواه روی نقشه"}
    />
  );
}
