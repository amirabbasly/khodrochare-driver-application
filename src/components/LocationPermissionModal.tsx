"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { currentPosition, errorMessage } from "@/lib/api";
import "./location-permission.css";

export function LocationPermissionModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    try { if (localStorage.getItem('khodrochare_location_choice_v2')) return; } catch {}
    let disposed = false;
    async function show() {
      try {
        if ((await navigator.permissions.query({ name: 'geolocation' })).state === 'granted') { localStorage.setItem('khodrochare_location_choice_v2', 'granted'); window.dispatchEvent(new Event('khodrochare:location')); return; }
      } catch {}
      if (!disposed) { element?.showModal(); document.body.style.overflow = "hidden"; }
    }
    void show();
    const overflow = document.body.style.overflow;


    return () => {
      disposed = true;
      element?.close(); document.body.style.overflow = overflow; previous?.focus();
    };
  }, []);
  async function allow() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const position = await currentPosition();
      try { localStorage.setItem("khodrochare_location_choice_v2", "granted"); } catch {}
      try { sessionStorage.setItem("khodrochare_location_v1", JSON.stringify(position)); } catch {}
      window.dispatchEvent(new CustomEvent("khodrochare:location", { detail: position }));
      dialog.current?.close();
      document.body.style.overflow = "";
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }
  function close() { try { localStorage.setItem("khodrochare_location_choice_v2", "dismissed"); } catch {} dialog.current?.close(); document.body.style.overflow = ""; }
  return (
    <dialog ref={dialog} className="location-permission" aria-labelledby="location-permission-title" aria-describedby="location-permission-description" dir="rtl" onCancel={close}>
      <div className="location-permission-icon"><Icon name="pin" size={30} /></div>
      <span className="location-permission-kicker">همراه شما در مسیر</span>
      <h2 id="location-permission-title">دسترسی به موقعیت مکانی</h2>
      <p id="location-permission-description">برای انتخاب دقیق مبدأ، نمایش فاصله و پیگیری زنده امداد، اجازه دسترسی به موقعیت خود را بدهید.</p>
      {error && <p className="location-permission-error" role="alert">{error} اگر قبلاً دسترسی را بسته‌اید، آن را از تنظیمات سایت در مرورگر فعال کنید.</p>}
      <button className="primary-button" type="button" onClick={allow} disabled={busy} aria-busy={busy} autoFocus>{busy ? "در حال دریافت موقعیت…" : "اجازه دسترسی به موقعیت"}<Icon name="pin" size={18} /></button>
      <button className="location-permission-later" type="button" onClick={close}>فعلاً ادامه بدون موقعیت</button>
      <small>موقعیت فقط برای ارائه و پیگیری خدمات استفاده می‌شود.</small>
    </dialog>
  );
}
