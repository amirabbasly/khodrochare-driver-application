import type { ReactNode } from "react";

export type ServiceId =
  | "roadside"
  | "transport"
  | "maintenance"
  | "carwash"
  | "diagnostic"
  | "insurance"
  | "fines"
  | "tolls"
  | "license"
  | "reminder"
  | "tripcheck"
  | "expert"
  | "inspection";

export type ArtId = ServiceId | "wallet" | "oil";

const shadow = <ellipse cx="32" cy="56" rx="17" ry="4.2" fill="#0F2233" opacity=".13" />;

const sparkle = (x: number, y: number, s: number, color = "#FFC188") => (
  <path
    d={`M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z`}
    fill={color}
    opacity=".9"
  />
);

const drawings: Record<ArtId, ReactNode> = {
  /* ───────── امداد خودرو · جرثقیل امداد ───────── */
  roadside: (
    <>
      <defs>
        <linearGradient id="g3d-rs-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#EE7B2E" />
        </linearGradient>
        <linearGradient id="g3d-rs-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C5DEEE" />
          <stop offset="1" stopColor="#5F82A0" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M22 31 L33 13 L48 11" stroke="#E06F22" strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 30.5 L33 13 L47 11.3" stroke="#FFD3A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
      <path d="M48 11.5 v4.6" stroke="#22384B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M48 16.4 a3.1 3.1 0 1 0 .1 4.2" stroke="#22384B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="7" y="31" width="35" height="15.5" rx="4.5" fill="url(#g3d-rs-body)" />
      <rect x="8.8" y="32.4" width="31.4" height="5.4" rx="2.7" fill="#FFE0BE" opacity=".55" />
      <path d="M40 46.5 V33.6 a3 3 0 0 1 3-3 h2.6 l6.2 8.2 v7.7 z" fill="url(#g3d-rs-body)" />
      <path d="M43.8 33.6 h2.2 L51.2 40 h-7.4 z" fill="url(#g3d-rs-glass)" />
      <rect x="11.5" y="26" width="7.5" height="5" rx="2.4" fill="#FFD24D" />
      <circle cx="15.2" cy="24.4" r="3.6" fill="#FFE9A6" opacity=".55" />
      <rect x="34.5" y="38.6" width="6.4" height="2.8" rx="1.3" fill="#FFE9A6" />
      <path d="M11.5 43 h24" stroke="#FFD9B0" strokeWidth="1.7" strokeLinecap="round" opacity=".75" />
      <circle cx="17" cy="47" r="5.6" fill="#26343F" />
      <circle cx="17" cy="47" r="2.5" fill="#E4ECF1" />
      <circle cx="46" cy="47" r="5.6" fill="#26343F" />
      <circle cx="46" cy="47" r="2.5" fill="#E4ECF1" />
      {sparkle(53, 26, 3.4)}
    </>
  ),

  /* ───────── حمل خودرو · خودروبر ───────── */
  transport: (
    <>
      <defs>
        <linearGradient id="g3d-tr-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A7B95" />
          <stop offset="1" stopColor="#253D51" />
        </linearGradient>
        <linearGradient id="g3d-tr-car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6FAFC" />
          <stop offset="1" stopColor="#A2B4C2" />
        </linearGradient>
        <linearGradient id="g3d-tr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C5DEEE" />
          <stop offset="1" stopColor="#5F82A0" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M44 47 V35.5 a2.6 2.6 0 0 1 2.6-2.6 h2.4 l5.6 7.6 v6.5 z" fill="url(#g3d-tr-cab)" />
      <path d="M47.4 35.6 h1.6 l3.9 5.4 h-5.5 z" fill="url(#g3d-tr-glass)" />
      <rect x="7" y="35.5" width="37" height="5.8" rx="2.2" fill="#2E4A61" />
      <rect x="7" y="41" width="37" height="4.2" rx="1.8" fill="#22384B" />
      <rect x="10.5" y="27.5" width="28" height="8.2" rx="3.2" fill="url(#g3d-tr-car)" />
      <path d="M16.8 27.8 l3-4.4 h8.4 l3 4.4 z" fill="url(#g3d-tr-glass)" />
      <path d="M12.8 31.5 h23" stroke="#DCE6EC" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      <circle cx="18" cy="35.6" r="3" fill="#26343F" />
      <circle cx="18" cy="35.6" r="1.3" fill="#E4ECF1" />
      <circle cx="32" cy="35.6" r="3" fill="#26343F" />
      <circle cx="32" cy="35.6" r="1.3" fill="#E4ECF1" />
      <circle cx="17" cy="48" r="5.4" fill="#26343F" />
      <circle cx="17" cy="48" r="2.4" fill="#E4ECF1" />
      <circle cx="47" cy="48" r="5.4" fill="#26343F" />
      <circle cx="47" cy="48" r="2.4" fill="#E4ECF1" />
      <path d="M8 47 h3.4 M23 47 h18" stroke="#F28A43" strokeWidth="2" strokeLinecap="round" opacity=".85" />
      {sparkle(55, 18, 3.2)}
    </>
  ),

  /* ───────── سرویس دوره‌ای · خودرو و آچار ───────── */
  maintenance: (
    <>
      <defs>
        <linearGradient id="g3d-mt-car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6FAFC" />
          <stop offset="1" stopColor="#A2B4C2" />
        </linearGradient>
        <linearGradient id="g3d-mt-tool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
        <linearGradient id="g3d-mt-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C5DEEE" />
          <stop offset="1" stopColor="#5F82A0" />
        </linearGradient>
      </defs>
      {shadow}
      <circle cx="47" cy="15" r="10" fill="#2E4A61" opacity=".18" />
      <path
        d="M47 7.6 a7.4 7.4 0 0 1 6.4 11.1 l2.1 2.1 -2.6 2.6 -2.1-2.1 a7.4 7.4 0 1 1-3.8-13.7 Z"
        fill="#3E5A72"
        opacity=".35"
      />
      <path d="M10.5 42.5 v-4.6 a2.1 2.1 0 0 1 1.7-2 l6-1 3.8-4.8 a2.5 2.5 0 0 1 2-1 h9.2 a2.5 2.5 0 0 1 2 1 l3.8 4.8 6 1 a2.1 2.1 0 0 1 1.7 2 v4.6 a1.6 1.6 0 0 1-1.6 1.6 H12.1 a1.6 1.6 0 0 1-1.6-1.6 Z" fill="url(#g3d-mt-car)" />
      <path d="M21.5 33.6 l3-3.9 h7.2 l3 3.9 z" fill="url(#g3d-mt-glass)" />
      <circle cx="19.5" cy="43.5" r="5.1" fill="#26343F" />
      <circle cx="19.5" cy="43.5" r="2.3" fill="#E4ECF1" />
      <circle cx="41" cy="43.5" r="5.1" fill="#26343F" />
      <circle cx="41" cy="43.5" r="2.3" fill="#E4ECF1" />
      <g transform="rotate(38 38 17)">
        <rect x="30" y="13.4" width="21" height="6.8" rx="3.4" fill="url(#g3d-mt-tool)" />
        <path d="M33 9.8 a6.6 6.6 0 1 1 0 13.2 a6.6 6.6 0 1 1 0-13.2 Z M33 13.6 a2.8 2.8 0 1 0 0 5.6 a2.8 2.8 0 1 0 0-5.6 Z" fillRule="evenodd" fill="url(#g3d-mt-tool)" />
        <rect x="32.6" y="8.2" width="5.6" height="4.4" rx="1.2" fill="#FFD9AE" opacity=".85" />
      </g>
      {sparkle(12, 16, 3.2, "#FFB271")}
    </>
  ),

  /* ───────── کارواش سیار · کف و آب ───────── */
  carwash: (
    <>
      <defs>
        <linearGradient id="g3d-cw-car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FC4E8" />
          <stop offset="1" stopColor="#2F6FA6" />
        </linearGradient>
        <linearGradient id="g3d-cw-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D5EAF6" />
          <stop offset="1" stopColor="#6089AC" />
        </linearGradient>
        <linearGradient id="g3d-cw-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BE0D4" />
          <stop offset="1" stopColor="#2E9C8C" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M11 41 v-4 a2 2 0 0 1 1.6-2 l5.6-1 3.6-4.6 a2.4 2.4 0 0 1 1.9-1 h9.2 a2.4 2.4 0 0 1 1.9 1 l3.6 4.6 5.6 1 a2 2 0 0 1 1.6 2 v4 a1.5 1.5 0 0 1-1.5 1.5 H12.5 A1.5 1.5 0 0 1 11 41 Z" fill="url(#g3d-cw-car)" />
      <path d="M21.6 32.8 l2.9-3.8 h7 l2.9 3.8 z" fill="url(#g3d-cw-glass)" />
      <circle cx="19.8" cy="42" r="5" fill="#26343F" />
      <circle cx="19.8" cy="42" r="2.2" fill="#E4ECF1" />
      <circle cx="40.8" cy="42" r="5" fill="#26343F" />
      <circle cx="40.8" cy="42" r="2.2" fill="#E4ECF1" />
      <circle cx="25" cy="23" r="6.2" fill="#FFFFFF" />
      <circle cx="32.5" cy="19.5" r="7.4" fill="#FFFFFF" />
      <circle cx="40" cy="23.5" r="5.4" fill="#FFFFFF" />
      <circle cx="29" cy="21.5" r="2" fill="#EAF3F8" opacity=".9" />
      <circle cx="35.5" cy="18" r="1.6" fill="#EAF3F8" opacity=".9" />
      <path d="M13 16 c0 2.8-2.2 4.4-2.2 6 a2.2 2.2 0 0 0 4.4 0 c0-1.6-2.2-3.2-2.2-6 Z" fill="url(#g3d-cw-drop)" />
      <circle cx="12" cy="20.6" r="1" fill="#EAFBF8" />
      <path d="M52 22 c0 2.4-1.9 3.8-1.9 5.2 a1.9 1.9 0 0 0 3.8 0 c0-1.4-1.9-2.8-1.9-5.2 Z" fill="url(#g3d-cw-drop)" />
      <circle cx="51.2" cy="25.8" r=".9" fill="#EAFBF8" />
      {sparkle(47, 12, 3.2, "#B7E4F5")}
    </>
  ),

  /* ───────── عیب‌یابی هوشمند · موبایل دیاگ ───────── */
  diagnostic: (
    <>
      <defs>
        <linearGradient id="g3d-dg-phone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A6780" />
          <stop offset="1" stopColor="#22384B" />
        </linearGradient>
        <linearGradient id="g3d-dg-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2FAFD" />
          <stop offset="1" stopColor="#C9E2F0" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="16" y="7" width="30" height="50" rx="7.5" fill="url(#g3d-dg-phone)" />
      <rect x="19.2" y="11.4" width="23.6" height="38.8" rx="4.4" fill="url(#g3d-dg-screen)" />
      <rect x="28" y="9.2" width="7" height="2.2" rx="1.1" fill="#16293A" />
      <path d="M22 36 l4.2-8.6 4 5.2 4.2-11 4.4 6.4" stroke="#F28A43" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30.2" cy="27.4" r="1.8" fill="#F28A43" />
      <circle cx="38.6" cy="21.6" r="1.8" fill="#F28A43" />
      <path d="M22 42 h14" stroke="#9FBCCB" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 45.6 h9" stroke="#9FBCCB" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 57 c0 3.4 3.6 4.6 7.2 3.6" stroke="#3E5A72" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="37.4" y="58.4" width="5.2" height="3.6" rx="1.4" fill="#F28A43" transform="rotate(12 37.4 58.4)" />
      <path d="M50 16 a7 7 0 0 1 3.4 5.8 M50.5 21 a3.8 3.8 0 0 1 1.8 3.2" stroke="#F28A43" strokeWidth="2" strokeLinecap="round" />
      {sparkle(12, 14, 3, "#9BC7E4")}
    </>
  ),

  /* ───────── خدمات بیمه · سپر ───────── */
  insurance: (
    <>
      <defs>
        <linearGradient id="g3d-in-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FD8B4" />
          <stop offset="1" stopColor="#2E9C74" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M32 6.5 L51.5 13.2 V26 c0 11.8-8.6 19.3-19.5 23 C21.1 45.3 12.5 37.8 12.5 26 V13.2 Z" fill="url(#g3d-in-shield)" />
      <path d="M32 6.5 L51.5 13.2 V19.6 L32 14.2 L12.5 19.6 V13.2 Z" fill="#FFFFFF" opacity=".22" />
      <path d="M32 6.5 L51.5 13.2 V26 c0 11.8-8.6 19.3-19.5 23 C21.1 45.3 12.5 37.8 12.5 26 V13.2 Z" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="1.4" fill="none" />
      <path d="M23.5 30 l5.8 5.8 11.4-12" stroke="#FFFFFF" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
      {sparkle(53, 10, 3.2, "#B8F0D8")}
    </>
  ),

  /* ───────── پرداخت جرائم · قبض و سکه ───────── */
  fines: (
    <>
      <defs>
        <linearGradient id="g3d-fn-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D9E4EC" />
        </linearGradient>
        <linearGradient id="g3d-fn-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#E07222" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M15 8.5 h22.5 a2.4 2.4 0 0 1 2.4 2.4 v33.4 l-3.2-2.3-3.2 2.3-3.2-2.3-3.2 2.3-3.2-2.3-3.2 2.3-3.2-2.3-3.2 2.3-3.2-2.3 V10.9 a2.4 2.4 0 0 1 2.4-2.4 Z" fill="url(#g3d-fn-paper)" />
      <rect x="19.5" y="14" width="15" height="2.6" rx="1.3" fill="#9FB2C0" />
      <rect x="19.5" y="20" width="12" height="2.4" rx="1.2" fill="#BCC9D3" />
      <rect x="19.5" y="25.6" width="14" height="2.4" rx="1.2" fill="#BCC9D3" />
      <rect x="19.5" y="31.2" width="9" height="2.4" rx="1.2" fill="#F28A43" />
      <circle cx="44.5" cy="43" r="10.5" fill="url(#g3d-fn-coin)" />
      <circle cx="44.5" cy="43" r="7" fill="none" stroke="#FFE0B8" strokeWidth="1.6" opacity=".85" />
      <path d="M41 43.2 l2.6 2.6 5-5.4" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {sparkle(50, 12, 3, "#FFC98F")}
    </>
  ),

  /* ───────── عوارض و خلافی · گیت عوارضی ───────── */
  tolls: (
    <>
      <defs>
        <linearGradient id="g3d-tl-post" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A7B95" />
          <stop offset="1" stopColor="#253D51" />
        </linearGradient>
        <linearGradient id="g3d-tl-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M12 52 L24 30 h17 L53 52 Z" fill="#2A3A46" />
      <path d="M32.5 34 v3.4 M32.5 41 v3.4 M32.5 48 v3" stroke="#E4ECF1" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <rect x="12" y="17" width="7.5" height="27" rx="2.6" fill="url(#g3d-tl-post)" />
      <circle cx="15.8" cy="21" r="1.6" fill="#FFD9A6" />
      <g transform="rotate(-16 19 24)">
        <rect x="19" y="21.2" width="31" height="5.8" rx="2.9" fill="url(#g3d-tl-arm)" />
        <rect x="24" y="21.2" width="3.4" height="5.8" fill="#FFFFFF" opacity=".85" />
        <rect x="32" y="21.2" width="3.4" height="5.8" fill="#FFFFFF" opacity=".85" />
        <rect x="40" y="21.2" width="3.4" height="5.8" fill="#FFFFFF" opacity=".85" />
      </g>
      <path d="M46 52 l3.2-8.4 3.2 8.4 z" fill="#F28A43" />
      <path d="M47.4 48 h3.6" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity=".9" />
      {sparkle(52, 12, 3, "#FFC98F")}
    </>
  ),

  /* ───────── نمره گواهینامه · کارت و ستاره ───────── */
  license: (
    <>
      <defs>
        <linearGradient id="g3d-lc-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA9DC" />
          <stop offset="1" stopColor="#2F5B94" />
        </linearGradient>
        <linearGradient id="g3d-lc-star" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD98F" />
          <stop offset="1" stopColor="#F0812F" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="8.5" y="13" width="47" height="35" rx="5.5" fill="url(#g3d-lc-card)" />
      <path d="M8.5 13 h47 v9.5 L8.5 27 Z" fill="#FFFFFF" opacity=".16" />
      <circle cx="21.5" cy="27.5" r="6.6" fill="#DCEAF6" />
      <circle cx="21.5" cy="25.6" r="2.7" fill="#FFFFFF" />
      <path d="M17.2 32.6 c0.7-2.8 8-2.8 8.7 0 Z" fill="#FFFFFF" />
      <rect x="32" y="21.5" width="17" height="2.7" rx="1.35" fill="#FFFFFF" opacity=".92" />
      <rect x="32" y="27.6" width="13" height="2.7" rx="1.35" fill="#FFFFFF" opacity=".7" />
      <rect x="32" y="33.7" width="9" height="2.7" rx="1.35" fill="#FFD9A6" opacity=".9" />
      <rect x="14" y="38.5" width="14" height="2.7" rx="1.35" fill="#FFFFFF" opacity=".55" />
      <path d="M47.5 36.2 l1.85 3.9 4.3 0.6-3.1 3 0.75 4.3-3.8-2.05-3.8 2.05 0.75-4.3-3.1-3 4.3-0.6 Z" fill="url(#g3d-lc-star)" />
      {sparkle(55, 12, 3, "#B9D4F2")}
    </>
  ),

  /* ───────── یادآور سرویس · تقویم و زنگ ───────── */
  reminder: (
    <>
      <defs>
        <linearGradient id="g3d-rm-cal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D5E1EA" />
        </linearGradient>
        <linearGradient id="g3d-rm-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB871" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
        <linearGradient id="g3d-rm-bell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD98F" />
          <stop offset="1" stopColor="#F0812F" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="18.6" y="8.6" width="3.6" height="8" rx="1.8" fill="#3E5A72" />
      <rect x="29.8" y="8.6" width="3.6" height="8" rx="1.8" fill="#3E5A72" />
      <rect x="10" y="13" width="32" height="35" rx="5" fill="url(#g3d-rm-cal)" />
      <path d="M10 18 a5 5 0 0 1 5-5 h22 a5 5 0 0 1 5 5 v4.5 H10 Z" fill="url(#g3d-rm-head)" />
      <circle cx="17.5" cy="28.5" r="1.7" fill="#B9C6D0" />
      <circle cx="26" cy="28.5" r="1.7" fill="#B9C6D0" />
      <circle cx="34.5" cy="28.5" r="1.7" fill="#B9C6D0" />
      <circle cx="17.5" cy="35" r="1.7" fill="#B9C6D0" />
      <circle cx="34.5" cy="35" r="1.7" fill="#B9C6D0" />
      <circle cx="20.5" cy="41.5" r="4.2" fill="#2E9C74" />
      <path d="M18.6 41.6 l1.4 1.4 2.8-3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29.5" cy="41.5" r="1.7" fill="#B9C6D0" />
      <path d="M50 23.5 a7.2 7.2 0 0 0-7.2 7.2 c0 4.1-1.5 5.1-1.5 7.2 h17.4 c0-2.1-1.5-3.1-1.5-7.2 A7.2 7.2 0 0 0 50 23.5 Z" fill="url(#g3d-rm-bell)" />
      <circle cx="50" cy="21.4" r="2.1" fill="#E06F22" />
      <path d="M47 39.8 a3.2 3.2 0 0 0 6 0 Z" fill="#E06F22" />
      {sparkle(54, 12, 2.8, "#FFD9A6")}
    </>
  ),

  /* ───────── چک خودرو قبل سفر · چک‌لیست و مسیر ───────── */
  tripcheck: (
    <>
      <defs>
        <linearGradient id="g3d-tc-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A7B95" />
          <stop offset="1" stopColor="#253D51" />
        </linearGradient>
        <linearGradient id="g3d-tc-pin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="11" y="10.5" width="31" height="41" rx="5" fill="url(#g3d-tc-board)" />
      <rect x="21.5" y="7.4" width="10" height="6.4" rx="2.8" fill="#A2B4C2" />
      <rect x="15" y="17.5" width="23" height="29" rx="2.8" fill="#F4F9FC" />
      <path d="M18.6 25.6 l2 2 3.6-4" stroke="#2E9C74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="26.5" y="25" width="8.5" height="2.2" rx="1.1" fill="#A8B7C2" />
      <path d="M18.6 33.1 l2 2 3.6-4" stroke="#2E9C74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="26.5" y="32.5" width="8.5" height="2.2" rx="1.1" fill="#A8B7C2" />
      <rect x="18.6" y="40.2" width="6" height="2.2" rx="1.1" fill="#F28A43" />
      <rect x="26.5" y="40.2" width="8.5" height="2.2" rx="1.1" fill="#C9D4DC" />
      <path d="M51 30.2 c0 6.8-6.4 12.2-6.4 12.2 s-6.4-5.4-6.4-12.2 a6.4 6.4 0 0 1 12.8 0 Z" fill="url(#g3d-tc-pin)" />
      <circle cx="44.6" cy="30.2" r="2.5" fill="#FFF4E6" />
      {sparkle(55, 14, 2.8, "#FFD9A6")}
    </>
  ),

  /* ───────── ارتباط با کارشناس · هدست ───────── */
  expert: (
    <>
      <defs>
        <linearGradient id="g3d-ex-cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
        <linearGradient id="g3d-ex-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A7B95" />
          <stop offset="1" stopColor="#253D51" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M14 34 v-3 a18 15.5 0 0 1 36 0 v3" stroke="url(#g3d-ex-band)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M18 21.5 a15 12 0 0 1 27.4 0" stroke="#8FA8BC" strokeWidth="1.6" strokeLinecap="round" opacity=".6" fill="none" />
      <rect x="8.6" y="30.5" width="10.5" height="16" rx="5.2" fill="url(#g3d-ex-cup)" />
      <rect x="44.9" y="30.5" width="10.5" height="16" rx="5.2" fill="url(#g3d-ex-cup)" />
      <rect x="11.4" y="33.6" width="4.6" height="9.6" rx="2.3" fill="#FFE0BE" opacity=".8" />
      <rect x="47.7" y="33.6" width="4.6" height="9.6" rx="2.3" fill="#FFE0BE" opacity=".8" />
      <path d="M19 44.5 c0.6 6.6 6 10 12.6 10" stroke="#2E4A61" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx="33.5" cy="54.4" r="3.3" fill="#F28A43" />
      <circle cx="33.5" cy="54.4" r="1.3" fill="#FFE0BE" />
      {sparkle(53, 16, 3, "#FFD9A6")}
      {sparkle(12, 14, 2.4, "#FFD9A6")}
    </>
  ),

  /* ───────── کارشناسی خودرو · خودرو و ذره‌بین ───────── */
  inspection: (
    <>
      <defs>
        <linearGradient id="g3d-is-car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6FAFC" />
          <stop offset="1" stopColor="#A2B4C2" />
        </linearGradient>
        <linearGradient id="g3d-is-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C5DEEE" />
          <stop offset="1" stopColor="#5F82A0" />
        </linearGradient>
      </defs>
      {shadow}
      <path d="M8 43.5 v-4.2 a2 2 0 0 1 1.6-2 l5.2-0.9 3.4-4.4 a2.4 2.4 0 0 1 1.9-1 h8.2 a2.4 2.4 0 0 1 1.9 1 l3.4 4.4 5.2 0.9 a2 2 0 0 1 1.6 2 v4.2 a1.5 1.5 0 0 1-1.5 1.5 H9.5 A1.5 1.5 0 0 1 8 43.5 Z" fill="url(#g3d-is-car)" />
      <path d="M17.6 34.8 l2.7-3.5 h6.4 l2.7 3.5 z" fill="url(#g3d-is-glass)" />
      <circle cx="16.6" cy="44.4" r="4.6" fill="#26343F" />
      <circle cx="16.6" cy="44.4" r="2" fill="#E4ECF1" />
      <circle cx="35.4" cy="44.4" r="4.6" fill="#26343F" />
      <circle cx="35.4" cy="44.4" r="2" fill="#E4ECF1" />
      <circle cx="43" cy="22" r="11.5" fill="#B9D7EA" opacity=".45" />
      <circle cx="43" cy="22" r="11.5" fill="none" stroke="#F28A43" strokeWidth="4" />
      <path d="M37.6 22.2 l3.6 3.6 7-7.6" stroke="#2E9C74" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M51.2 30.4 l5.6 5.6" stroke="#E06F22" strokeWidth="5.6" strokeLinecap="round" />
      <path d="M36.5 15.5 a9 9 0 0 1 5-3.4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity=".7" fill="none" />
    </>
  ),

  /* ───────── کیف پول ───────── */
  wallet: (
    <>
      <defs>
        <linearGradient id="g3d-wl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB871" />
          <stop offset="1" stopColor="#E07222" />
        </linearGradient>
        <linearGradient id="g3d-wl-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD3A6" />
          <stop offset="1" stopColor="#F2913F" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="17" y="12.5" width="22" height="10" rx="2.6" fill="#DCEAF6" />
      <rect x="19.5" y="15" width="10" height="2.2" rx="1.1" fill="#7FA9DC" />
      <rect x="8" y="18.5" width="44" height="30" rx="7" fill="url(#g3d-wl-body)" />
      <path d="M8 25.5 a7 7 0 0 1 7-7 h30 a7 7 0 0 1 7 7 v3 H8 Z" fill="url(#g3d-wl-flap)" />
      <path d="M13 41 h27" stroke="#FFE0BE" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      <rect x="39" y="28" width="15" height="12" rx="4.2" fill="#22384B" />
      <circle cx="46.5" cy="34" r="2.4" fill="#FFD98F" />
      {sparkle(54, 12, 3, "#FFD9A6")}
    </>
  ),

  /* ───────── سرویس روغن · بطری و قطره ───────── */
  oil: (
    <>
      <defs>
        <linearGradient id="g3d-ol-bottle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A6780" />
          <stop offset="1" stopColor="#22384B" />
        </linearGradient>
        <linearGradient id="g3d-ol-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB871" />
          <stop offset="1" stopColor="#E06F22" />
        </linearGradient>
      </defs>
      {shadow}
      <rect x="25.4" y="11" width="9.2" height="10" rx="2.2" fill="#2E4A61" />
      <rect x="24" y="7" width="12" height="6" rx="2.4" fill="url(#g3d-ol-drop)" />
      <rect x="17" y="19" width="26" height="33" rx="6.5" fill="url(#g3d-ol-bottle)" />
      <path d="M20.5 23 v23" stroke="#5F82A0" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
      <rect x="21" y="27" width="18" height="15" rx="3" fill="#F4F9FC" />
      <path d="M30 30 c0 3.2-2.6 4.8-2.6 6.8 a2.6 2.6 0 0 0 5.2 0 c0-2-2.6-3.6-2.6-6.8 Z" fill="url(#g3d-ol-drop)" />
      <path d="M48 17 c0 6.2-5 9.4-5 13.6 a5 5 0 0 0 10 0 C53 26.4 48 23.2 48 17 Z" fill="url(#g3d-ol-drop)" />
      <circle cx="46.2" cy="30.4" r="1.5" fill="#FFE7C6" />
      {sparkle(12, 13, 2.8, "#FFD9A6")}
    </>
  ),
};

export function ServiceIllustration({
  type,
  size = "md",
  delay = 0,
}: {
  type: ArtId;
  size?: "sm" | "md" | "lg";
  delay?: number;
}) {
  return (
    <span
      className={`service-art3d service-art3d--${type} service-art3d--${size}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {drawings[type]}
      </svg>
    </span>
  );
}

export function MoreDots3D({ size = "md", delay = 0 }: { size?: "sm" | "md" | "lg"; delay?: number }) {
  return (
    <span className={`service-art3d service-art3d--more service-art3d--${size}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
        <defs>
          <linearGradient id="g3d-more-dot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFC98F" />
            <stop offset="1" stopColor="#E07222" />
          </linearGradient>
          <linearGradient id="g3d-more-dot2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5A7B95" />
            <stop offset="1" stopColor="#253D51" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="50" rx="19" ry="4.2" fill="#0F2233" opacity=".13" />
        <g className="more-dots">
          <g className="more-dot more-dot--one">
            <circle cx="17" cy="33" r="7.2" fill="url(#g3d-more-dot)" />
            <circle cx="14.9" cy="30.6" r="2.2" fill="#FFE7C8" opacity=".85" />
          </g>
          <g className="more-dot more-dot--two">
            <circle cx="32" cy="33" r="7.2" fill="url(#g3d-more-dot2)" />
            <circle cx="29.9" cy="30.6" r="2.2" fill="#C5DAEA" opacity=".8" />
          </g>
          <g className="more-dot more-dot--three">
            <circle cx="47" cy="33" r="7.2" fill="url(#g3d-more-dot)" />
            <circle cx="44.9" cy="30.6" r="2.2" fill="#FFE7C8" opacity=".85" />
          </g>
        </g>
      </svg>
    </span>
  );
}
