"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

const splashMessage = "یک تماس، یک چاره؛ خودرو چاره";

export function SplashGate({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let character = 0;
    const typingTimer = window.setInterval(() => {
      character += 1;
      setTypedMessage(splashMessage.slice(0, character));
      if (character >= splashMessage.length) window.clearInterval(typingTimer);
    }, 72);
    const fadeTimer = window.setTimeout(() => setLeaving(true), 2850);
    const closeTimer = window.setTimeout(() => setVisible(false), 3350);

    return () => {
      window.clearInterval(typingTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  return (
    <>
      {children}
      {visible && (
        <div className={`launch-splash${leaving ? " launch-splash--leaving" : ""}`} role="status" aria-label="خودرو چاره در حال آماده‌سازی است" dir="rtl">
          <div className="splash-backdrop-glow splash-backdrop-glow--one" />
          <div className="splash-backdrop-glow splash-backdrop-glow--two" />
          <div className="splash-tire-ring splash-tire-ring--outer" />
          <div className="splash-tire-ring splash-tire-ring--inner" />
          <div className="splash-content">
            <div className="splash-logo-wrap">
              <Image
                src="/khodrochare-3d-logo.webp"
                alt="لوگوی خودرو چاره"
                width={2172}
                height={724}
                sizes="(max-width: 640px) 370px, 405px"
                priority
                className="splash-logo"
              />
            </div>
            <p className="splash-type-line" aria-live="polite"><span>{typedMessage}</span><i className="splash-cursor" /></p>
            <p className="splash-subtitle">اگر تو راه موندی و عجله داری، سریع تماس بگیر.</p>
            <a className="splash-phone" href="tel:02191855" dir="ltr" aria-label="تماس با خودرو چاره: ۰۲۱ ۹۱۸۵۵">
              <span className="splash-phone-prefix">۰۲۱</span>
              <span className="splash-phone-dash">-</span>
              <strong className="splash-phone-number">۹۱۸۵۵</strong>
            </a>
            <div className="splash-loader" aria-hidden="true"><span /></div>
          </div>
          <span className="splash-footer">همراه مطمئن تو در هر مسیر</span>
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
