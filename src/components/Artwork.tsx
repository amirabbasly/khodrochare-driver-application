export function MiniCar({ variant = "silver" }: { variant?: "silver" | "orange" | "blue" }) {
  const colors = {
    silver: ["#EFF4F6", "#8498A8", "#182B3A"],
    orange: ["#FFAA62", "#F47725", "#292E36"],
    blue: ["#93C5E4", "#347AA8", "#172F43"],
  };
  const [light, dark, glass] = colors[variant];
  return (
    <svg viewBox="0 0 240 120" className="mini-car-art" aria-hidden="true" fill="none">
      <ellipse cx="119" cy="101" rx="94" ry="8" fill="#0C1823" opacity=".16" />
      <path d="m25 77 12-23c5-9 13-14 24-16l28-4 25-21c5-4 11-7 18-7h22c7 0 13 3 17 9l23 26 15 6c7 3 11 9 12 16l2 14c1 6-4 11-11 11H30c-5 0-8-4-5-11Z" fill={light} stroke={dark} strokeWidth="2" />
      <path d="m93 35 25-21c4-3 9-5 14-5h19c5 0 9 2 12 6l18 20H93Z" fill={glass} stroke="#8EA1AF" strokeWidth="1.5" />
      <path d="m130 11-1 24m24-24 4 24" stroke="#72899A" strokeWidth="1.5" />
      <path d="M34 69h19m142 0h19" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <circle cx="66" cy="83" r="15" fill="#172530" stroke="#718392" strokeWidth="2" />
      <circle cx="66" cy="83" r="7" fill="#DCE3E7" /><circle cx="181" cy="83" r="15" fill="#172530" stroke="#718392" strokeWidth="2" /><circle cx="181" cy="83" r="7" fill="#DCE3E7" />
      <path d="M28 73h12m180-1h7" stroke="#FF7929" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AiMascot() {
  return (
    <svg className="ai-mascot" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ai-bot-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE6C9" />
          <stop offset="1" stopColor="#FFB27B" />
        </linearGradient>
        <linearGradient id="ai-bot-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A4A60" />
          <stop offset="1" stopColor="#142C3B" />
        </linearGradient>
      </defs>
      <path d="M24 11 V6.5" stroke="#FFD3A6" strokeWidth="2.2" strokeLinecap="round" />
      <circle className="ai-mascot-orb" cx="24" cy="4.6" r="3.1" fill="#FF9A52" />
      <rect x="5.2" y="20" width="5.6" height="12.5" rx="2.8" fill="#FF9A52" />
      <rect x="37.2" y="20" width="5.6" height="12.5" rx="2.8" fill="#FF9A52" />
      <rect x="9" y="11.5" width="30" height="26.5" rx="11" fill="url(#ai-bot-head)" />
      <path d="M12.5 15.5 a9 9 0 0 1 7-3.2" stroke="#FFF1DE" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
      <rect x="13" y="16.5" width="22" height="16.5" rx="8.2" fill="url(#ai-bot-face)" />
      <g className="ai-mascot-eyes">
        <rect x="17.4" y="21.8" width="4.5" height="5.8" rx="2.25" fill="#7FD8FF" />
        <rect x="26.1" y="21.8" width="4.5" height="5.8" rx="2.25" fill="#7FD8FF" />
      </g>
      <path className="ai-mascot-smile" d="M20.6 30.6 h6.8" stroke="#7FD8FF" strokeWidth="2" strokeLinecap="round" />
      <path className="ai-mascot-spark ai-mascot-spark--one" d="M42 7.5 l1 2.1 2.1 1-2.1 1-1 2.1-1-2.1-2.1-1 2.1-1 Z" fill="#FFD9A6" />
      <path className="ai-mascot-spark ai-mascot-spark--two" d="M6.2 10.2 l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8 Z" fill="#FFD9A6" />
    </svg>
  );
}

export function ServicesScene3D() {
  return (
    <svg className="services-scene" viewBox="0 0 520 300" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sc-car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC98F" />
          <stop offset="0.55" stopColor="#F28A43" />
          <stop offset="1" stopColor="#D9611B" />
        </linearGradient>
        <linearGradient id="sc-car-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D5EAF6" />
          <stop offset="1" stopColor="#54789A" />
        </linearGradient>
        <linearGradient id="sc-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9B8" />
          <stop offset="1" stopColor="#E8931F" />
        </linearGradient>
        <linearGradient id="sc-copper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB27B" />
          <stop offset="1" stopColor="#C75B1D" />
        </linearGradient>
        <linearGradient id="sc-teal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FE9C4" />
          <stop offset="1" stopColor="#279468" />
        </linearGradient>
        <linearGradient id="sc-coral" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB9A0" />
          <stop offset="1" stopColor="#E45C2A" />
        </linearGradient>
        <radialGradient id="sc-glow-o" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF9A52" stopOpacity=".4" />
          <stop offset="1" stopColor="#FF9A52" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sc-glow-b" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#6FB2E8" stopOpacity=".3" />
          <stop offset="1" stopColor="#6FB2E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sc-orb-g" cx="0.35" cy="0.28" r="1">
          <stop offset="0" stopColor="#FFE9B8" stopOpacity=".38" />
          <stop offset="1" stopColor="#F0912F" stopOpacity=".1" />
        </radialGradient>
        <radialGradient id="sc-orb-c" cx="0.35" cy="0.28" r="1">
          <stop offset="0" stopColor="#FFD0A8" stopOpacity=".38" />
          <stop offset="1" stopColor="#C75B1D" stopOpacity=".1" />
        </radialGradient>
        <radialGradient id="sc-orb-t" cx="0.35" cy="0.28" r="1">
          <stop offset="0" stopColor="#C8F5DF" stopOpacity=".38" />
          <stop offset="1" stopColor="#279468" stopOpacity=".1" />
        </radialGradient>
        <radialGradient id="sc-orb-r" cx="0.35" cy="0.28" r="1">
          <stop offset="0" stopColor="#FFD3C2" stopOpacity=".4" />
          <stop offset="1" stopColor="#E45C2A" stopOpacity=".12" />
        </radialGradient>
      </defs>

      {/* colored backlight */}
      <ellipse cx="150" cy="252" rx="210" ry="132" fill="url(#sc-glow-o)" />
      <ellipse cx="430" cy="66" rx="180" ry="122" fill="url(#sc-glow-b)" />
      <ellipse className="scene-ring" cx="258" cy="158" rx="196" ry="118" stroke="#FFFFFF" strokeOpacity=".13" strokeDasharray="4 10" strokeWidth="1.6" />

      {/* colored dashed links */}
      <path className="scene-link scene-link--one" d="M112 122 C 136 150 158 172 184 190" stroke="#FFD98F" strokeOpacity=".55" strokeDasharray="3 8" strokeWidth="2" strokeLinecap="round" />
      <path className="scene-link scene-link--two" d="M222 96 C 228 124 232 146 238 168" stroke="#FFB27B" strokeOpacity=".55" strokeDasharray="3 8" strokeWidth="2" strokeLinecap="round" />
      <path className="scene-link scene-link--three" d="M338 96 C 330 124 322 146 312 168" stroke="#8FE9C4" strokeOpacity=".55" strokeDasharray="3 8" strokeWidth="2" strokeLinecap="round" />
      <path className="scene-link scene-link--four" d="M446 128 C 416 152 388 172 362 188" stroke="#FFB9A0" strokeOpacity=".55" strokeDasharray="3 8" strokeWidth="2" strokeLinecap="round" />

      {/* stage + car */}
      <g className="scene-car">
        <ellipse cx="258" cy="252" rx="128" ry="15" fill="#0B1A26" opacity=".42" />
        <ellipse cx="258" cy="247" rx="116" ry="11" fill="none" stroke="#FF9A52" strokeOpacity=".32" strokeWidth="2" />
        <path d="M162 238 v-27 a7 7 0 0 1 6-7 l25-6 23-28 a11 11 0 0 1 9-4.5 h42 a11 11 0 0 1 9 4.5 l23 28 25 6 a7 7 0 0 1 6 7 v27 a5 5 0 0 1-5 5 H167 a5 5 0 0 1-5-5 Z" fill="url(#sc-car-body)" />
        <path d="M167 214 h280" stroke="#FFE0BE" strokeWidth="3" strokeLinecap="round" opacity=".5" />
        <path d="M224 176 l21-25 h42 l20 25 z" fill="url(#sc-car-glass)" />
        <path d="M228 176 l18-22" stroke="#EAF4FA" strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
        <path d="M245 151 l-1 25 M281 151 l2 25" stroke="#3E5A72" strokeWidth="1.8" opacity=".75" />
        <rect x="162" y="222" width="16" height="6" rx="3" fill="#FFE9B8" />
        <rect x="162" y="222" width="16" height="6" rx="3" fill="#FFF6E2" opacity=".9" />
        <rect x="345" y="222" width="13" height="6" rx="3" fill="#FF5A3C" />
        <circle cx="207" cy="241" r="19" fill="#22303C" />
        <circle cx="207" cy="241" r="9" fill="#E4ECF1" />
        <circle cx="207" cy="241" r="3.4" fill="#FF9A52" />
        <circle cx="322" cy="241" r="19" fill="#22303C" />
        <circle cx="322" cy="241" r="9" fill="#E4ECF1" />
        <circle cx="322" cy="241" r="3.4" fill="#FF9A52" />
      </g>

      {/* orb · خرید خودرو (golden key) */}
      <g className="scene-orb scene-orb--buy">
        <circle cx="92" cy="86" r="33" fill="url(#sc-orb-g)" stroke="#FFD98F" strokeOpacity=".8" strokeWidth="1.8" />
        <circle cx="92" cy="86" r="39" fill="none" stroke="#FFD98F" strokeOpacity=".16" strokeWidth="7" />
        <g transform="rotate(-28 92 86)">
          <circle cx="83" cy="86" r="9.5" fill="url(#sc-gold)" />
          <circle cx="83" cy="86" r="4" fill="#1B3448" />
          <rect x="91" y="82.6" width="21" height="6.8" rx="2.6" fill="url(#sc-gold)" />
          <rect x="103" y="89" width="4" height="5.4" rx="1.4" fill="url(#sc-gold)" />
          <rect x="109" y="89" width="4" height="4.2" rx="1.4" fill="url(#sc-gold)" />
        </g>
        <rect x="53" y="124" width="78" height="23" rx="11.5" fill="#FFFFFF" fillOpacity=".14" stroke="#FFD98F" strokeOpacity=".35" />
        <text x="92" y="140" textAnchor="middle" className="scene-label" fill="#FFE9C4">خرید خودرو</text>
      </g>

      {/* orb · لوازم یدکی (copper gear) */}
      <g className="scene-orb scene-orb--parts">
        <circle cx="222" cy="56" r="33" fill="url(#sc-orb-c)" stroke="#FFB27B" strokeOpacity=".8" strokeWidth="1.8" />
        <circle cx="222" cy="56" r="39" fill="none" stroke="#FFB27B" strokeOpacity=".16" strokeWidth="7" />
        <g transform="translate(222 56)">
          <g className="scene-gear">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x="-3.6" y="-20" width="7.2" height="8.6" rx="2" fill="url(#sc-copper)" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="13" fill="url(#sc-copper)" />
            <circle r="5.6" fill="#1B3448" />
            <path d="M-9.4-9.4 A 13.2 13.2 0 0 1 2-13" stroke="#FFE3C2" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>
        <rect x="183" y="94" width="78" height="23" rx="11.5" fill="#FFFFFF" fillOpacity=".14" stroke="#FFB27B" strokeOpacity=".35" />
        <text x="222" y="110" textAnchor="middle" className="scene-label" fill="#FFDCC2">لوازم یدکی</text>
      </g>

      {/* orb · بیمه (teal shield) */}
      <g className="scene-orb scene-orb--insurance">
        <circle cx="338" cy="56" r="33" fill="url(#sc-orb-t)" stroke="#8FE9C4" strokeOpacity=".8" strokeWidth="1.8" />
        <circle cx="338" cy="56" r="39" fill="none" stroke="#8FE9C4" strokeOpacity=".16" strokeWidth="7" />
        <path d="M338 36 L353 41 v8.4 c0 8-6.2 13.2-15 15.8 -8.8-2.6-15-7.8-15-15.8 V41 Z" fill="url(#sc-teal)" />
        <path d="M338 36 L353 41 v5 L338 39.8 L323 46 V41 Z" fill="#FFFFFF" opacity=".28" />
        <path d="M331.6 50.6 l4 4 7.4-8" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="312" y="94" width="52" height="23" rx="11.5" fill="#FFFFFF" fillOpacity=".14" stroke="#8FE9C4" strokeOpacity=".35" />
        <text x="338" y="110" textAnchor="middle" className="scene-label" fill="#CFF3E3">بیمه</text>
      </g>

      {/* orb · امداد خودرو (coral beacon) */}
      <g className="scene-orb scene-orb--roadside">
        <circle cx="446" cy="86" r="33" fill="url(#sc-orb-r)" stroke="#FFB9A0" strokeOpacity=".8" strokeWidth="1.8" />
        <circle cx="446" cy="86" r="39" fill="none" stroke="#FFB9A0" strokeOpacity=".16" strokeWidth="7" />
        <circle className="beacon-glow" cx="446" cy="79" r="15" fill="#FF8A5C" opacity=".4" />
        <path d="M438 87 a8 8 0 0 1 16 0 Z" fill="url(#sc-coral)" />
        <rect x="434.4" y="87" width="23.2" height="5.6" rx="2.4" fill="#22384B" />
        <rect x="443.6" y="70" width="4.8" height="5" rx="2.2" fill="#FFE9B8" />
        <path d="M431 73 l-4.4-3.2 M461 73 l4.4-3.2" stroke="#FFE9B8" strokeWidth="2.2" strokeLinecap="round" opacity=".85" />
        <rect x="412" y="124" width="68" height="23" rx="11.5" fill="#FFFFFF" fillOpacity=".14" stroke="#FFB9A0" strokeOpacity=".35" />
        <text x="446" y="140" textAnchor="middle" className="scene-label" fill="#FFD9C8">امداد</text>
      </g>

      {/* twinkles */}
      <path className="scene-spark scene-spark--one" d="M300 30 l1.5 3.2 3.2 1.5-3.2 1.5-1.5 3.2-1.5-3.2-3.2-1.5 3.2-1.5 Z" fill="#FFE9B8" />
      <path className="scene-spark scene-spark--two" d="M152 32 l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2 Z" fill="#B9D4F2" />
      <path className="scene-spark scene-spark--three" d="M486 190 l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2 Z" fill="#FFE9B8" />

      {/* tagline */}
      <g className="scene-tagline">
        <rect x="120" y="266" width="292" height="27" rx="13.5" fill="#FFFFFF" fillOpacity=".12" stroke="#FFFFFF" strokeOpacity=".22" />
        <circle cx="396" cy="279.5" r="3.2" fill="#FF9A52" />
        <text x="258" y="284" textAnchor="middle" className="scene-caption" fill="#FFEEDC">همراه مطمئن شما از خرید تا تأمین خدمات خودرو</text>
      </g>
    </svg>
  );
}
