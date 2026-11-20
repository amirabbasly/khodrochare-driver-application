"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSessionState } from "@/lib/session";
import { useEffect, useState, type ReactNode } from "react";

const splashMessage = "بار بگیر، مسیر بساز؛ خودرو چاره";

export function SplashGate({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const {status,error,retry} = useSessionState();
  const pathname = usePathname(), router = useRouter();
  const authPage = pathname === "/" || pathname === "/register";
  const redirecting = status === "authenticated" && authPage || status === "anonymous" && pathname === "/home";
  const holding = status === "checking" || status === "error" || redirecting;
  const leaving = visible && minimumElapsed && !holding;

  useEffect(() => {
    if (status === "authenticated" && (pathname === "/" || pathname === "/register")) router.replace("/home");
    else if (status === "anonymous" && pathname === "/home") router.replace("/");
  }, [pathname,status,router]);

  useEffect(() => {
    if (!visible || !minimumElapsed || holding) return;
    const timer = window.setTimeout(() => setVisible(false),500);
    return () => window.clearTimeout(timer);
  }, [visible,minimumElapsed,holding]);

  useEffect(() => {
    let character = 0;
    const typingTimer = window.setInterval(() => {
      character += 1;
      setTypedMessage(splashMessage.slice(0, character));
      if (character >= splashMessage.length) window.clearInterval(typingTimer);
    }, 72);
    const minimumTimer = window.setTimeout(() => setMinimumElapsed(true), 2850);

    return () => {
      window.clearInterval(typingTimer);
      window.clearTimeout(minimumTimer);
    };
  }, []);

  return (
    <>
      {!holding && children}
      {(visible || holding) && (
        <div className={`launch-splash${leaving ? " launch-splash--leaving" : ""}`} role="status" aria-label="خودرو چاره در حال آماده‌سازی است" dir="rtl">
          <div className="splash-backdrop-glow splash-backdrop-glow--one" />
          <div className="splash-backdrop-glow splash-backdrop-glow--two" />
          <div className="splash-tire-ring splash-tire-ring--outer" />
          <div className="splash-tire-ring splash-tire-ring--inner" />
          <div className="splash-content">
            <div className="splash-logo-wrap">
              <Image
                src="/khodrochare-wordmark.png"
                alt="لوگوی خودرو چاره"
                width={2172}
                height={724}
                sizes="(max-width: 640px) 370px, 405px"
                priority
                className="splash-logo"
              />
            </div>
            <p className="splash-type-line" aria-live="polite"><span>{typedMessage}</span><i className="splash-cursor" /></p>
            <p className="splash-subtitle">شبکهٔ امدادگران و سفیران خودرو چاره؛ همیشه در راه.</p>
            <a className="splash-phone" href="tel:02191855" dir="ltr" aria-label="تماس با خودرو چاره: ۰۲۱ ۹۱۸۵۵">
              <span className="splash-phone-prefix">۰۲۱</span>
              <span className="splash-phone-dash">-</span>
              <strong className="splash-phone-number">۹۱۸۵۵</strong>
            </a>
            <div className="splash-loader" aria-hidden="true"><span /></div>
            {status === "error" && <div className="splash-session-error"><p role="alert">{error}</p><button type="button" onClick={retry}>تلاش دوباره</button></div>}
          </div>
          <span className="splash-footer">همراه ناوگان امداد در هر مسیر</span>
        </div>
      )}
    </>
  );
}

export function PwaBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // PWA installation remains available even if service-worker registration is blocked.
    });
  }, []);

  return null;
}
