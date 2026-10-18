import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type IconName =
  | "menu"
  | "bell"
  | "home"
  | "market"
  | "auction"
  | "user"
  | "chevron"
  | "wallet"
  | "history"
  | "car"
  | "pin"
  | "gift"
  | "support"
  | "logout"
  | "close"
  | "arrow-left"
  | "arrow-right"
  | "plus"
  | "sparkles"
  | "search"
  | "calendar"
  | "shield"
  | "check"
  | "clock"
  | "edit"
  | "send"
  | "phone"
  | "tag"
  | "filter"
  | "more"
  | "ticket"
  | "chat"
  | "location"
  | "refresh"
  | "eye"
  | "eye-off";

const paths: Record<IconName, ReactNode> = {
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  market: <><path d="M4 9h16v11H4zM3 9l2-5h14l2 5" /><path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M8 20v-5h5v5" /></>,
  auction: <><path d="m15 5 4 4M8 12l8-8 4 4-8 8M5 15l4 4M3 21l7-7M13 19h8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  wallet: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3" /><path d="M3 8h17M15.5 14h.01" /><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" /></>,
  history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  car: <><path d="m5 11 2-5h10l2 5M4 11h16l1 7H3z" /><path d="M6 18v2m12-2v2M6 14h.01M18 14h.01" /></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  gift: <><path d="M3 10h18v11H3zM2 6h20v4H2zM12 6v15" /><path d="M12 6H8.5a2.5 2.5 0 1 1 2.4-3.2L12 6Zm0 0h3.5a2.5 2.5 0 1 0-2.4-3.2L12 6Z" /></>,
  support: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 12H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7Zm16 0h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7Z" /><path d="M17 19c-.7 1.3-2.2 2-5 2" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  "arrow-left": <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
  "arrow-right": <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.2 2.3L23 17l-2.8.8L19 20l-1.2-2.2L15 17l2.8-.7L19 14ZM5 2l.7 1.5L7 4l-1.3.5L5 6l-.7-1.5L3 4l1.3-.5L5 2Z" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h2m3 0h3m-8 3h2" /></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  edit: <><path d="m15 5 4 4M4 20l4-.8L19.5 7.7a2.1 2.1 0 0 0-3-3L5 16.2 4 20Z" /><path d="M12 20h8" /></>,
  send: <><path d="m21 3-7.5 18-3.2-7.3L3 10.5 21 3Z" /><path d="M10.3 13.7 15 9" /></>,
  phone: <><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-6-6l2-2-2-5Z" /></>,
  tag: <><path d="M20 13 13 20a2 2 0 0 1-3 0l-7-7V4h9l8 8a1 1 0 0 1 0 1Z" /><circle cx="8" cy="8" r="1" /></>,
  filter: <><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="9" cy="7" r="1.5" /><circle cx="15" cy="12" r="1.5" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  ticket: <><path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4h16v-4a2 2 0 0 1 0-4V5H4v2Z" /><path d="M13 7v2m0 2v2m0 2v2" /></>,
  chat: <><path d="M20 11.5a7.5 7.5 0 0 1-11.5 6.4L4 20l1.1-4.5A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><path d="M9 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" /></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 9a7 7 0 0 1 11.5-2L20 12M4 12l2.4 5a7 7 0 0 0 11.5-2" /></>,
  eye: <><path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12 17.9 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="M4 4l16 16" /><path d="M9.9 5.7A9.7 9.7 0 0 1 12 5.5c5.9 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-2.8 3.6M6.2 7.8A17.4 17.4 0 0 0 2.5 12s3.6 6.5 9.5 6.5a9.6 9.6 0 0 0 3.9-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}

export function BrandLogo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className={`brand-lockup${compact ? " brand-lockup--compact" : ""}${light ? " brand-lockup--light" : ""}`} dir="rtl">
      <Image
        src="/khodrochare-3d-logo.webp"
        alt="لوگوی خودرو چاره"
        width={2172}
        height={724}
        sizes={compact ? "(max-width: 640px) 108px, 150px" : "195px"}
        priority
        className="brand-logo-image"
      />
      {!compact && <span className="brand-caption">همراه هوشمند خودرو</span>}
    </div>
  );
}
