"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo, Icon } from "@/components/Icons";
import { AiMascot, MiniCar } from "@/components/Artwork";
import { LocationPickerMap, UserPinMap } from "@/components/Maps";
import { MoreDots3D, ServiceIllustration, type ServiceId } from "@/components/ServiceIllustration";

type View =
  | "home"
  | "wallet"
  | "history"
  | "market"
  | "hall"
  | "profile"
  | "mycars"
  | "addresses"
  | "invite"
  | "support"
  | "notifications"
  | "service"
  | "waiting";

type UserSession = { name?: string; username?: string; phone?: string; wallet?: string };
type Service = { id: ServiceId; name: string; note: string; category: string };

const services: Service[] = [
  { id: "roadside", name: "امداد خودرو", note: "همیشه در راه", category: "امداد" },
  { id: "transport", name: "حمل خودرو", note: "امن و مطمئن", category: "امداد" },
  { id: "maintenance", name: "سرویس دوره‌ای خودرو", note: "سرویس و نگهداری", category: "سرویس" },
  { id: "carwash", name: "کارواش سیار", note: "در محل شما", category: "سرویس" },
  { id: "diagnostic", name: "عیب‌یابی هوشمند", note: "دیاگ با موبایل", category: "هوشمند" },
  { id: "insurance", name: "خدمات بیمه", note: "بیمهٔ خودرو", category: "خودرو" },
  { id: "fines", name: "پرداخت جرائم", note: "استعلام و پرداخت", category: "خودرو" },
  { id: "tolls", name: "عوارض و خلافی خودرو", note: "پرداخت یک‌جا", category: "خودرو" },
  { id: "license", name: "نمرهٔ گواهینامه", note: "وضعیت رانندگی", category: "خودرو" },
  { id: "reminder", name: "یادآور سرویس خودرو", note: "هیچ‌چیز یادت نره", category: "سرویس" },
  { id: "tripcheck", name: "چک خودرو قبل سفر", note: "با خیال راحت برو", category: "سرویس" },
  { id: "expert", name: "ارتباط با کارشناس", note: "پاسخ تخصصی", category: "پشتیبانی" },
  { id: "inspection", name: "کارشناسی خودرو", note: "خرید مطمئن‌تر", category: "خودرو" },
];

const drawerItems: { label: string; view: View; icon: "wallet" | "history" | "market" | "auction" | "user" | "car" | "pin" | "gift" | "support" }[] = [
  { label: "کیف پول", view: "wallet", icon: "wallet" },
  { label: "تاریخچه درخواست‌ها", view: "history", icon: "history" },
  { label: "جمعه‌بازار لوازم یدکی", view: "market", icon: "market" },
  { label: "تالار فروش خودرو", view: "hall", icon: "auction" },
  { label: "حساب کاربری", view: "profile", icon: "user" },
  { label: "خودروهای من", view: "mycars", icon: "car" },
  { label: "آدرس‌های من", view: "addresses", icon: "pin" },
  { label: "دعوت از دوستان", view: "invite", icon: "gift" },
  { label: "تماس با پشتیبانی", view: "support", icon: "support" },
];

const heroSlides = [
  {
    id: "hero-roadside",
    image: "/slides/hero-roadside.jpg",
    tag: "امداد خودرو ۲۴ ساعته",
    title: "راه بیفت، چاره با ماست.",
    description: "هر وقت تو راه بمانی، امدادگرهای خودرو چاره سریع کنارت می‌رسند.",
    action: "درخواست امداد",
  },
  {
    id: "hero-carwash",
    image: "/slides/hero-carwash.jpg",
    tag: "سرویس و نگهداری",
    title: "ماشینت سرحال، مسیرت روشن.",
    description: "کارواش سیار و سرویس دوره‌ای، درست در محل خودت.",
    action: "دیدن خدمات سرویس",
  },
  {
    id: "hero-care",
    image: "/slides/hero-care.jpg",
    tag: "همه‌چیز برای ماشینت",
    title: "هرچیزی برای خودروت، یک‌جا.",
    description: "از قطعه و بیمه تا کارشناسی خودرو؛ فقط با چند لمس.",
    action: "شروع کن",
  },
];

const bannerSlides = [
  {
    id: "banner-parts",
    image: "/slides/banner-parts.jpg",
    tag: "جمعه‌بازار",
    title: "اولین جمعه‌بازار لوازم یدکی ایران",
    description: "تا ۱۰۰٪ تخفیف روی قطعات منتخب؛ جمعه‌ها، پر از چاره!",
  },
  {
    id: "banner-auction",
    image: "/slides/banner-auction.jpg",
    tag: "تالار خودرو",
    title: "تالار تخصصی فروش و مزایده خودرو",
    description: "خودروی بعدی‌ات را با خیال راحت پیدا کن.",
  },
  {
    id: "banner-coverage",
    image: "/slides/banner-coverage.jpg",
    tag: "پوشش گسترده",
    title: "پوشش تهران، کرج و کل شمال کشور",
    description: "هرجا که باشی، چاره نزدیک توست.",
  },
  {
    id: "banner-diagnostic",
    image: "/slides/banner-diagnostic.jpg",
    tag: "دیاگ هوشمند",
    title: "ماشینت را با گوشی دیاگ بزن",
    description: "عیب‌یابی هوشمند؛ ساده، سریع و همیشه در دسترس.",
  },
];

const bottomItems: { label: string; view: View; icon: "home" | "market" | "auction" | "user" }[] = [
  { label: "خانه", view: "home", icon: "home" },
  { label: "جمعه‌بازار", view: "market", icon: "market" },
  { label: "تالار خودرو", view: "hall", icon: "auction" },
  { label: "پروفایل", view: "profile", icon: "user" },
];

function latinDigits(value: string) {
  return value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/[٬،,\s]/g, "");
}

function normalizePhoneNumber(value: string) {
  let digits = value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/\D/g, "");
  if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("98")) digits = `0${digits.slice(2)}`;
  else if (digits.length === 10 && digits.startsWith("9")) digits = `0${digits}`;
  return digits;
}

function formatMoney(value: number) {
  return `${Math.max(0, value).toLocaleString("fa-IR")} تومان`;
}

function PageTitle({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack: () => void; action?: ReactNode }) {
  return (
    <div className="page-title-row">
      <div className="page-title-main">
        <button className="back-button" type="button" onClick={onBack} aria-label="بازگشت به صفحهٔ قبل"><Icon name="arrow-right" size={19} /></button>
        <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      </div>
      {action && <div className="page-title-action">{action}</div>}
    </div>
  );
}

function SectionTitle({ title, caption, action }: { title: string; caption?: string; action?: ReactNode }) {
  return (
    <div className="section-title-row">
      <div><h2>{title}</h2>{caption && <p>{caption}</p>}</div>
      {action}
    </div>
  );
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "ک";
  return <span className={`user-avatar${large ? " user-avatar--large" : ""}`} aria-hidden="true">{initials}</span>;
}

function HeroSlider({ onService, onExplore }: { onService: (service: Service) => void; onExplore: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % total), 6500);
    return () => window.clearInterval(timer);
  }, [total]);

  function handleAction() {
    if (current === 0) onService(services[0]);
    else if (current === 1) onService(services[2]);
    else onExplore();
  }

  return (
    <section className="hero-slider" aria-roledescription="carousel" aria-label="پیشنهادهای ویژه خودرو چاره">
      {heroSlides.map((slide, index) => (
        <article key={slide.id} className={`hero-slide${index === current ? " is-active" : ""}`} aria-hidden={index !== current}>
          <Image src={slide.image} alt="" fill sizes="(max-width: 760px) 100vw, 1320px" priority={index === 0} className="hero-slide-image" />
          <div className="hero-slide-veil" />
          <div className="hero-slide-copy">
            <span className="hero-slide-tag">{slide.tag}</span>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <button className="hero-slide-cta" type="button" tabIndex={index === current ? 0 : -1} onClick={handleAction}>
              {slide.action} <Icon name="arrow-left" size={16} />
            </button>
          </div>
        </article>
      ))}
      <div className="hero-slider-bullets">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`slider-bullet${index === current ? " is-active" : ""}`}
            aria-label={`اسلاید ${index + 1} از ${total}`}
            aria-current={index === current}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}

function BannerStrip({ onAction }: { onAction: (index: number) => void }) {
  return (
    <section className="banner-strip-section" aria-label="پیشنهادهای ویژه خودرو چاره">
      <SectionTitle title="چاره‌های بیشتر برای ماشینت" caption="برای دیدن همهٔ پیشنهادها، افقی اسکرول کن." />
      <div className="banner-strip">
        {bannerSlides.map((slide, index) => (
          <article key={slide.id} className="banner-strip-card">
            <Image src={slide.image} alt="" fill sizes="(max-width: 640px) 80vw, 380px" className="banner-strip-image" />
            <div className="banner-strip-veil" />
            <div className="banner-strip-copy">
              <span className="banner-strip-tag">{slide.tag}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <button className="banner-slide-link" type="button" onClick={() => onAction(index)}>
                بیشتر ببین <Icon name="arrow-left" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service, onClick, delay }: { service: Service; onClick: () => void; delay?: number }) {
  return (
    <button className={`service-card service-card--${service.id}`} type="button" onClick={onClick}>
      <ServiceIllustration type={service.id} size="md" delay={delay} />
      <span className="service-name">{service.name}</span>
      <span className="service-note">{service.note}</span>
    </button>
  );
}

function HomeView({
  onService,
  onNavigate,
  onToast,
  balance,
}: {
  onService: (service: Service) => void;
  onNavigate: (view: View) => void;
  onToast: (message: string) => void;
  balance: number;
}) {
  const mainServices = services.slice(0, 4);
  const moreServices = services.slice(4);

  return (
    <div className="home-content">
      <section className="wallet-strip" aria-label="موجودی کیف پول">
        <span className="wallet-strip-icon"><ServiceIllustration type="wallet" size="md" /></span>
        <div className="wallet-strip-copy">
          <small>موجودی کیف پول</small>
          <strong>{balance.toLocaleString("fa-IR")} <em>تومان</em></strong>
        </div>
        <button className="wallet-strip-cta" type="button" onClick={() => onNavigate("wallet")}>
          افزایش موجودی <Icon name="plus" size={15} />
        </button>
        <span className="wallet-strip-glow" aria-hidden="true" />
      </section>

      <section className="bento-stats" aria-label="خلاصه وضعیت خودرو و خدمات">
        <button className="bento-main" type="button" onClick={() => onNavigate("history")}>
          <span className="bento-main-scene"><Image src="/slides/scene-iran-map.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 780px" className="bento-main-image" /></span>
          <span className="bento-main-veil" aria-hidden="true" />
          <div className="bento-main-copy">
            <span className="bento-main-label"><i className="live-dot" /> وضعیت آخرین خدمت - امداد خودرو</span>
            <strong>امدادگر در مسیر ...</strong>
            <span className="bento-progress" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} aria-label="پیشرفت آخرین خدمت">
              <span className="bento-progress-fill" />
            </span>
            <span className="bento-main-meta">درخواست امروز · ۱۰:۴۲ · تا ۲۵ دقیقه دیگر</span>
          </div>
          <span className="bento-scene-caption">همراه مطمئن شما از خرید تا تأمین خدمات خودرو</span>
        </button>

        <div className="bento-stack">
          <button className="bento-mini" type="button" onClick={() => onService(services[9])}>
            <span className="bento-mini-icon"><ServiceIllustration type="reminder" size="sm" delay={0.25} /></span>
            <span className="bento-mini-copy"><small>سرویس دوره‌ای</small><strong>۴۵ <em>روز</em></strong><span>باقی‌مانده</span></span>
          </button>
          <button className="bento-mini" type="button" onClick={() => onService(services[9])}>
            <span className="bento-mini-icon"><ServiceIllustration type="oil" size="sm" delay={0.55} /></span>
            <span className="bento-mini-copy"><small>سرویس روغن</small><strong>۱۲ <em>روز</em></strong><span>باقی‌مانده</span></span>
          </button>
        </div>
      </section>

      <section className="main-services-section">
        <SectionTitle title="خدمات اصلی خودرو چاره" caption="چهار خدمت پرطرفدار ما، همیشه آمادهٔ کمک به تو." />
        <div className="main-services-grid">
          {mainServices.map((service, index) => (
            <button key={service.id} className={`main-service-card main-service-card--${service.id}`} type="button" onClick={() => onService(service)}>
              <span className="main-service-art"><ServiceIllustration type={service.id} size="lg" delay={index * 0.35} /></span>
              <strong>{service.name}</strong>
              <small>{service.note}</small>
            </button>
          ))}
        </div>
      </section>

      <HeroSlider onService={onService} onExplore={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} />

      <section className="services-section" id="services">
        <SectionTitle
          title="بقیه خدمات"
          caption="هر نیازی، فقط با چند لمس فاصله دارد."
          action={<span className="service-count"><Icon name="sparkles" size={12} /> {moreServices.length + 1} خدمت دیگر</span>}
        />
        <div className="services-grid">
          {moreServices.map((service, index) => <ServiceCard key={service.id} service={service} onClick={() => onService(service)} delay={index * 0.18} />)}
          <button className="service-card service-card--more" type="button" onClick={() => onToast("به‌زودی خدمات بیشتری به خودرو چاره اضافه می‌شود")}>
            <MoreDots3D delay={0.4} />
            <span className="service-name">بیشتر</span>
            <span className="service-note">به‌زودی بیشتر</span>
          </button>
        </div>
      </section>

      <BannerStrip onAction={(index) => (index === 0 ? onNavigate("market") : index === 1 ? onNavigate("hall") : index === 3 ? onService(services[4]) : onToast("پوشش خودرو چاره: تهران، کرج و کل شمال کشور"))} />
    </div>
  );
}

function WalletView({ balance, onAdd, onBack }: { balance: number; onAdd: (amount: number) => void; onBack: () => void }) {
  const [amount, setAmount] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(latinDigits(amount));
    if (parsed < 10000) return;
    onAdd(parsed);
    setAmount("");
  }
  return <div className="subpage"><PageTitle title="کیف پول" subtitle="پرداخت سریع‌تر و بی‌دردسرتر خدمات خودرو" onBack={onBack} />
    <div className="wallet-layout">
      <section className="wallet-card"><div className="wallet-card-top"><span className="wallet-emblem"><Icon name="wallet" size={23} /></span><span className="wallet-secure"><Icon name="shield" size={14} /> کیف پول امن خودرو چاره</span></div><span className="wallet-label">موجودی قابل استفاده</span><strong className="wallet-balance">{formatMoney(balance)}</strong><span className="wallet-card-foot">موجودی شما همیشه در دسترس است.</span><div className="wallet-card-orbit" /></section>
      <section className="panel-card topup-card"><span className="panel-eyebrow">افزایش موجودی</span><h2>کیف پولت را شارژ کن</h2><p>مبلغ دلخواهت را وارد کن و ادامه بده.</p><form className="topup-form" onSubmit={submit}><label className="form-field"><span className="field-label">مبلغ شارژ (تومان)</span><span className="field-control"><input type="text" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="مثلاً ۵۰۰٬۰۰۰" required dir="rtl" /></span></label><button type="submit" className="primary-button">ادامه به پرداخت <Icon name="arrow-left" size={17} /></button></form></section>
    </div>
    <section className="panel-card list-panel"><SectionTitle title="تراکنش‌های اخیر" caption="آخرین تغییرات کیف پول شما" /><div className="transaction-row"><span className="transaction-icon transaction-icon--green"><Icon name="plus" size={18} /></span><span className="transaction-info"><strong>شارژ کیف پول</strong><small>امروز · ۱۰:۴۲</small></span><b className="money-positive">+ ۵۰۰٬۰۰۰ تومان</b></div><div className="transaction-row"><span className="transaction-icon"><Icon name="car" size={18} /></span><span className="transaction-info"><strong>سرویس دوره‌ای خودرو</strong><small>۲۴ مهر · ۱۶:۲۰</small></span><b>− ۸۵۰٬۰۰۰ تومان</b></div></section>
  </div>;
}

function HistoryView({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("همه");
  const rows = [
    { title: "تعویض روغن و فیلتر", date: "۲۴ مهر ۱۴۰۴ · ۱۰:۳۰", status: "در انتظار", kind: "سرویس دوره‌ای", icon: "maintenance" as ServiceId },
    { title: "کارواش سیار", date: "۱۸ مهر ۱۴۰۴ · ۱۴:۰۰", status: "انجام‌شده", kind: "کارواش", icon: "carwash" as ServiceId },
    { title: "استعلام خلافی", date: "۱۲ مهر ۱۴۰۴ · ۰۹:۱۲", status: "انجام‌شده", kind: "خودرو", icon: "fines" as ServiceId },
  ];
  const filteredRows = filter === "همه" ? rows : rows.filter((row) => row.status === filter);
  return <div className="subpage"><PageTitle title="تاریخچهٔ درخواست‌ها" subtitle="همهٔ سرویس‌ها و پیگیری‌های تو اینجاست." onBack={onBack} /><div className="filter-tabs">{["همه", "در انتظار", "انجام‌شده"].map((item) => <button type="button" key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><section className="panel-card history-list">{filteredRows.map((row) => <article className="history-row" key={row.title}><ServiceIllustration type={row.icon} size="sm" /><div className="history-details"><span>{row.kind}</span><strong>{row.title}</strong><small><Icon name="calendar" size={13} />{row.date}</small></div><span className={`status-pill${row.status === "انجام‌شده" ? " status-pill--done" : ""}`}><i />{row.status}</span><button className="row-more" type="button" aria-label="گزینه‌ها"><Icon name="more" size={20} /></button></article>)}</section><div className="history-note"><Icon name="sparkles" size={18} /><span>با ثبت درخواست جدید، جزئیات آن همین‌جا نمایش داده می‌شود.</span></div></div>;
}

function MarketView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [category, setCategory] = useState("همهٔ قطعات");
  const categories = ["همهٔ قطعات", "لوازم مصرفی", "قطعات فنی", "تجهیزات جانبی"];
  const products = [
    { name: "روغن موتور 5W-30", detail: "مناسب خودروهای داخلی · ۴ لیتر", price: "۱٬۸۹۰٬۰۰۰", badge: "تخفیف ۲۰٪", tone: "oil" },
    { name: "باتری ۶۰ آمپر", detail: "۱۸ ماه ضمانت تعویض", price: "۳٬۷۵۰٬۰۰۰", badge: "پرفروش", tone: "battery" },
    { name: "لاستیک چهارفصل", detail: "سایز ۱۸۵/۶۵ · جفت", price: "۵٬۴۰۰٬۰۰۰", badge: "ارسال رایگان", tone: "tire" },
  ];
  return <div className="subpage"><PageTitle title="جمعه‌بازار لوازم یدکی" subtitle="بازار قطعات مطمئن، با قیمت‌های به‌صرفه." onBack={onBack} action={<button className="icon-outline-button" type="button" onClick={() => onToast("فهرست علاقه‌مندی‌ها باز شد") } aria-label="علاقه‌مندی‌ها"><Icon name="gift" size={18} /></button>} />
    <section className="market-hero"><span className="market-hero-label"><Icon name="tag" size={15} /> هر جمعه، یک فرصت تازه</span><h2>قطعهٔ خوب پیدا کن،<br /><em>هوشمندانه خرید کن.</em></h2><p>فروشنده‌های تأییدشده، پیشنهادهای ویژه و خرید با خیال راحت.</p><button type="button" onClick={() => onToast("به‌زودی جمعه‌بازار کامل‌تر می‌شود")}>دیدن پیشنهادهای ویژه <Icon name="arrow-left" size={16} /></button><div className="market-wheel"><span /><i /></div></section>
    <div className="market-toolbar"><div className="search-field"><Icon name="search" size={19} /><input placeholder="دنبال چه قطعه‌ای می‌گردی؟" aria-label="جست‌وجوی قطعه" /></div><button className="filter-button" type="button" onClick={() => onToast("فیلترهای بیشتر به‌زودی اضافه می‌شوند")}><Icon name="filter" size={17} /> فیلترها</button></div>
    <div className="category-tabs">{categories.map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <SectionTitle title="پیشنهادهای جمعه" caption="محصول‌های منتخب فروشندگان خودرو چاره" action={<button className="text-link" type="button" onClick={() => onToast("همهٔ محصولات در نسخهٔ کامل نمایش داده می‌شوند")}>مشاهده همه <Icon name="arrow-left" size={14} /></button>} />
    <div className="product-grid">{products.map((product) => <article className="product-card" key={product.name}><div className={`product-visual product-visual--${product.tone}`}><span className="product-badge">{product.badge}</span>{product.tone === "tire" ? <span className="product-tire" /> : product.tone === "battery" ? <span className="product-battery"><i /><b>+  −</b></span> : <span className="product-oil"><i /></span>}<button type="button" className="product-heart" aria-label="افزودن به علاقه‌مندی‌ها" onClick={() => onToast("به فهرست علاقه‌مندی‌ها اضافه شد")}><Icon name="gift" size={15} /></button></div><div className="product-info"><span className="product-category">{category === "همهٔ قطعات" ? "قطعات منتخب" : category}</span><h3>{product.name}</h3><p>{product.detail}</p><div className="product-bottom"><strong>{product.price} <small>تومان</small></strong><button type="button" onClick={() => onToast(`${product.name} به سبد خرید اضافه شد`)} aria-label="افزودن به سبد خرید"><Icon name="plus" size={17} /></button></div></div></article>)}</div>
  </div>;
}

function HallView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const cars = [
    { name: "پژو ۲۰۷ پانوراما", year: "۱۴۰۱", km: "۳۸٬۰۰۰", price: "۹۸۰٬۰۰۰٬۰۰۰", variant: "silver" as const, city: "تهران" },
    { name: "دنا پلاس توربو", year: "۱۴۰۲", km: "۲۱٬۵۰۰", price: "۱٬۲۴۰٬۰۰۰٬۰۰۰", variant: "blue" as const, city: "کرج" },
    { name: "تارا اتوماتیک", year: "۱۴۰۳", km: "۱۲٬۰۰۰", price: "۱٬۵۵۰٬۰۰۰٬۰۰۰", variant: "orange" as const, city: "تهران" },
  ];
  return <div className="subpage"><PageTitle title="تالار فروش خودرو" subtitle="جای مطمئن خرید و فروش خودروهای کارشناسی‌شده." onBack={onBack} action={<button className="primary-button compact-button" type="button" onClick={() => onToast("فرم ثبت خودرو به‌زودی در دسترس است")}><Icon name="plus" size={16} /> ثبت خودروی من</button>} />
    <section className="hall-banner"><span className="hall-banner-mark"><Icon name="shield" size={24} /></span><div><span>خرید و فروش با اطمینان</span><h2>خودروی بعدی‌ات را اینجا پیدا کن.</h2><p>آگهی‌های بررسی‌شده، قیمت شفاف و همراهی کارشناسان.</p></div><div className="hall-banner-stats"><strong>+۲,۴۰۰</strong><small>خودروی آمادهٔ معامله</small></div></section>
    <div className="market-toolbar"><div className="search-field"><Icon name="search" size={19} /><input placeholder="مدل یا برند خودرو را جست‌وجو کن" aria-label="جست‌وجوی خودرو" /></div><button className="filter-button" type="button" onClick={() => onToast("فیلترهای خودرو باز شد")}><Icon name="filter" size={17} /> فیلترها</button></div>
    <div className="listing-heading"><SectionTitle title="خودروهای پیشنهادی" caption="انتخاب‌های تازه و کارشناسی‌شده" /><button className="sort-button" type="button" onClick={() => onToast("مرتب‌سازی بر اساس تازه‌ترین آگهی‌ها")}>جدیدترین <Icon name="chevron" size={15} /></button></div>
    <div className="car-listing-grid">{cars.map((car, index) => <article className="car-listing-card" key={car.name}><div className={`listing-car-visual listing-car-visual--${car.variant}`}><span className="listing-tag">{index === 0 ? "کارشناسی‌شده" : "آگهی ویژه"}</span><MiniCar variant={car.variant} /><button className="product-heart" type="button" aria-label="ذخیرهٔ آگهی" onClick={() => onToast("آگهی به علاقه‌مندی‌ها اضافه شد")}><Icon name="gift" size={15} /></button></div><div className="listing-info"><div className="listing-title-line"><h3>{car.name}</h3><span>{car.year}</span></div><div className="listing-specs"><span><Icon name="car" size={14} />{car.km} کیلومتر</span><span><Icon name="pin" size={14} />{car.city}</span></div><div className="listing-price-line"><strong>{car.price} <small>تومان</small></strong><button type="button" onClick={() => onToast(`جزئیات ${car.name} در تالار خودرو`)} aria-label="مشاهده جزئیات"><Icon name="arrow-left" size={16} /></button></div></div></article>)}</div>
  </div>;
}

function ProfileView({ name, username, phone, onSave, onBack, onToast }: { name: string; username: string; phone: string; onSave: (name: string, phone: string) => void; onBack: () => void; onToast: (message: string) => void }) {
  const [fullName, setFullName] = useState(name);
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [email, setEmail] = useState("");
  return <div className="subpage"><PageTitle title="حساب کاربری" subtitle="اطلاعات و تنظیمات حساب خودت را مدیریت کن." onBack={onBack} />
    <div className="profile-layout"><section className="panel-card profile-summary"><div className="profile-cover"><span className="profile-cover-orbit" /></div><Avatar name={name} large /><h2>{name}</h2><p dir="ltr">{username === "admin" ? "@admin" : phone || username}</p><span className="profile-member"><Icon name="shield" size={14} />عضو خودرو چاره</span><div className="profile-stats"><span><b>۰۳</b><small>درخواست</small></span><span><b>۰۱</b><small>خودرو</small></span><span><b>۰۲</b><small>نشان</small></span></div></section>
      <section className="panel-card profile-edit"><div className="panel-heading"><span className="profile-edit-icon"><Icon name="user" size={20} /></span><div><h2>اطلاعات شخصی</h2><p>اطلاعاتت را به‌روز نگه دار.</p></div></div><form className="profile-form" onSubmit={(event) => { event.preventDefault(); onSave(fullName.trim(), phoneNumber); onToast("اطلاعات کاربری ذخیره شد"); }}><label className="form-field"><span className="field-label">نام و نام خانوادگی</span><span className="field-control"><input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></span></label><label className="form-field"><span className="field-label">شمارهٔ تماس</span><span className="field-control field-control--ltr"><input type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} dir="ltr" /></span></label><label className="form-field"><span className="field-label">ایمیل (اختیاری)</span><span className="field-control field-control--ltr"><input type="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" /></span></label><button className="primary-button" type="submit">ذخیرهٔ تغییرات <Icon name="arrow-left" size={16} /></button></form></section></div>
    <section className="panel-card settings-list"><button type="button" onClick={() => onToast("تنظیمات امنیتی در نسخهٔ کامل فعال می‌شود")}><span className="settings-icon"><Icon name="shield" size={18} /></span><span><strong>امنیت و حریم خصوصی</strong><small>رمز عبور و تنظیمات ورود</small></span><Icon name="chevron" size={17} /></button><button type="button" onClick={() => onToast("تنظیمات اعلان‌ها باز شد")}><span className="settings-icon"><Icon name="bell" size={18} /></span><span><strong>تنظیمات اعلان‌ها</strong><small>مدیریت پیام‌ها و یادآورها</small></span><Icon name="chevron" size={17} /></button></section>
  </div>;
}

function MyCarsView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [cars, setCars] = useState(["پژو ۲۰۷ پانوراما · ۱۴۰۱", "پراید ۱۳۱ · ۱۳۹۸"]);
  const [adding, setAdding] = useState(false);
  const [newCar, setNewCar] = useState("");
  function addCar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCar.trim()) return;
    setCars((items) => [...items, newCar.trim()]); setNewCar(""); setAdding(false); onToast("خودروی جدید به فهرستت اضافه شد");
  }
  return <div className="subpage"><PageTitle title="خودروهای من" subtitle="خودروهایت را اضافه کن تا خدمات دقیق‌تری بگیری." onBack={onBack} action={<button className="primary-button compact-button" type="button" onClick={() => setAdding((current) => !current)}><Icon name="plus" size={16} /> افزودن خودرو</button>} />
    {adding && <form className="add-inline-form" onSubmit={addCar}><input autoFocus placeholder="مثلاً تارا اتوماتیک · ۱۴۰۲" value={newCar} onChange={(event) => setNewCar(event.target.value)} required /><button className="primary-button compact-button" type="submit">ثبت خودرو</button></form>}
    <div className="my-cars-grid">{cars.map((car, index) => <article className="my-car-card" key={`${car}-${index}`}><div className={`my-car-visual ${index % 2 ? "my-car-visual--blue" : ""}`}><span className="car-plate">ایران <b>۴۶</b> · <b>ک ۵۲۱</b></span><MiniCar variant={index % 2 ? "blue" : "silver"} /></div><div className="my-car-info"><span className="car-primary-label">خودروی اصلی{index === 0 ? "" : ""}</span><h2>{car}</h2><div className="my-car-meta"><span><Icon name="shield" size={14} />بیمهٔ شخص ثالث: ۱۲۰ روز</span><span><Icon name="clock" size={14} />سرویس بعدی: ۴۵ روز</span></div><div className="my-car-actions"><button type="button" className="car-action-main" onClick={() => onToast(`خودروی ${car} انتخاب شد`)}>انتخاب خودرو <Icon name="arrow-left" size={15} /></button><button type="button" className="icon-outline-button" onClick={() => onToast("ویرایش خودرو در نسخهٔ کامل فعال می‌شود")} aria-label="ویرایش"><Icon name="edit" size={17} /></button></div></div></article>)}</div>
    <button type="button" className="add-car-dashed" onClick={() => setAdding(true)}><span><Icon name="plus" size={22} /></span><strong>خودروی دیگری اضافه کن</strong><small>با اضافه کردن خودرو، پیشنهادهای بهتری بگیر.</small></button>
  </div>;
}

function AddressesView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [addresses, setAddresses] = useState([{ title: "خانه", address: "تهران، سعادت‌آباد، خیابان سرو غربی، پلاک ۲۴", label: "پیش‌فرض" }, { title: "محل کار", address: "تهران، ونک، خیابان گاندی، پلاک ۸", label: "" }]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  function addAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!newAddress.trim()) return;
    setAddresses((items) => [...items, { title: "آدرس جدید", address: newAddress.trim(), label: "" }]); setNewAddress(""); setShowForm(false); onToast("آدرس جدید ذخیره شد");
  }
  return <div className="subpage"><PageTitle title="آدرس‌های من" subtitle="مقصدهای پرتکرارت را ذخیره کن." onBack={onBack} action={<button className="primary-button compact-button" type="button" onClick={() => setShowForm((current) => !current)}><Icon name="plus" size={16} /> افزودن آدرس</button>} />
    {showForm && <form className="add-inline-form" onSubmit={addAddress}><input autoFocus placeholder="آدرس کامل را وارد کن" value={newAddress} onChange={(event) => setNewAddress(event.target.value)} required /><button className="primary-button compact-button" type="submit">ذخیرهٔ آدرس</button></form>}
    <div className="address-grid">{addresses.map((item, index) => <article className="panel-card address-card" key={`${item.title}-${index}`}><div className="address-card-top"><span className="address-icon"><Icon name="pin" size={20} /></span>{item.label && <span className="default-address">{item.label}</span>}<button className="row-more" type="button" aria-label="ویرایش آدرس" onClick={() => onToast("ویرایش آدرس در نسخهٔ کامل فعال می‌شود")}><Icon name="more" size={20} /></button></div><h2>{item.title}</h2><p>{item.address}</p><div className="address-card-footer"><span><Icon name="location" size={14} /> محدودهٔ تهران</span><button type="button" onClick={() => onToast("این آدرس انتخاب شد")}>انتخاب آدرس <Icon name="arrow-left" size={14} /></button></div></article>)}</div>
  </div>;
}

function InviteView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  async function copyCode() {
    try { await navigator.clipboard.writeText("CHAREH-ARMAN"); onToast("کد دعوت کپی شد"); } catch { onToast("کد دعوت شما: CHAREH-ARMAN"); }
  }
  return <div className="subpage"><PageTitle title="دعوت از دوستان" subtitle="با هم، مسیرها آسوده‌تر می‌شوند." onBack={onBack} />
    <section className="invite-hero"><div className="invite-text"><span className="invite-eyebrow"><Icon name="gift" size={15} /> هدیه‌ای برای تو و دوستت</span><h2>دوستت را دعوت کن،<br /><em>چاره را شریک شو!</em></h2><p>با هر دعوت موفق، شما و دوستت از هدیه‌های ویژهٔ خودرو چاره بهره‌مند می‌شوید.</p><div className="invite-code"><span><small>کد دعوت اختصاصی تو</small><b dir="ltr">CHAREH-ARMAN</b></span><button type="button" onClick={copyCode}><Icon name="tag" size={17} /> کپی کد</button></div><button className="invite-share" type="button" onClick={() => onToast("لینک دعوت برای اشتراک‌گذاری آماده شد")}><Icon name="send" size={17} /> دعوت از دوستان</button></div><div className="invite-art"><span className="invite-art-circle"><Icon name="gift" size={74} /></span><span className="invite-spark invite-spark--one"><Icon name="sparkles" size={17} /></span><span className="invite-spark invite-spark--two"><Icon name="sparkles" size={22} /></span><span className="invite-confetti" /></div></section>
    <div className="invite-steps"><div><b>۰۱</b><strong>کدت را بفرست</strong><small>کد دعوت را با دوستت به اشتراک بگذار.</small></div><div><b>۰۲</b><strong>دوستت ثبت‌نام کند</strong><small>دوستت با کد تو وارد خودرو چاره می‌شود.</small></div><div><b>۰۳</b><strong>هدیه‌تان را بگیرید</strong><small>پاداش برای هر دوی شما فعال می‌شود.</small></div></div>
  </div>;
}

function SupportView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [message, setMessage] = useState("");
  return <div className="subpage"><PageTitle title="تماس با پشتیبانی" subtitle="هر سؤالی داری، ما با خوشحالی پاسخ می‌دهیم." onBack={onBack} />
    <section className="support-hero"><span className="support-orbit"><Icon name="support" size={32} /></span><div><span>همیشه کنار تو</span><h2>چطور می‌توانیم کمکت کنیم؟</h2><p>پاسخ‌گویی هر روز، از ساعت ۸ صبح تا ۱۲ شب.</p></div><button type="button" onClick={() => onToast("تماس با پشتیبانی: ۰۲۱-۹۱۰۰-۱۲۰۰")}><Icon name="phone" size={17} /> تماس با ما</button></section>
    <div className="support-columns"><section className="panel-card faq-panel"><SectionTitle title="سؤال‌های پرتکرار" caption="شاید پاسخ سؤالت اینجا باشد." /><details><summary>چطور درخواست خدمات ثبت کنم؟ <span>+</span></summary><p>از صفحهٔ خانه خدمت موردنیاز را انتخاب کن، خودروی موردنظر و آدرس را وارد کن و درخواستت را ثبت کن.</p></details><details><summary>چطور خودروی جدید اضافه کنم؟ <span>+</span></summary><p>از منوی اپلیکیشن وارد «خودروهای من» شو و گزینهٔ افزودن خودرو را انتخاب کن.</p></details><details><summary>هزینهٔ خدمات را کجا ببینم؟ <span>+</span></summary><p>هزینهٔ نهایی پیش از تأیید درخواست به تو نمایش داده می‌شود.</p></details></section>
      <section className="panel-card support-message"><div className="support-message-icon"><Icon name="chat" size={22} /></div><h2>پیامت را برای ما بفرست</h2><p>کارشناسان ما در کوتاه‌ترین زمان پاسخ می‌دهند.</p><form onSubmit={(event) => { event.preventDefault(); if (!message.trim()) return; setMessage(""); onToast("پیامت برای پشتیبانی ارسال شد"); }}><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="پیامت را اینجا بنویس…" required /><button className="primary-button" type="submit">ارسال پیام <Icon name="arrow-left" size={16} /></button></form></section></div>
  </div>;
}

function NotificationsView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const notices = [
    { title: "سرویس دوره‌ای خودروت نزدیکه", description: "فقط ۳ روز تا یادآور سرویس بعدی پژو ۲۰۷ باقی مانده.", time: "امروز · ۰۹:۳۰", icon: "maintenance" as ServiceId, unread: true },
    { title: "جمعه‌بازار این هفته شروع شد", description: "پیشنهادهای ویژهٔ قطعات را از دست نده.", time: "دیروز · ۱۷:۰۰", icon: "fines" as ServiceId, unread: true },
    { title: "حساب کاربری‌ات آماده است", description: "خوش آمدی به خانوادهٔ خودرو چاره!", time: "۲۴ مهر · ۱۲:۱۵", icon: "insurance" as ServiceId, unread: false },
  ];
  return <div className="subpage"><PageTitle title="اعلان‌ها" subtitle="خبرهای تازه و یادآورهای خودروی تو." onBack={onBack} action={<button className="text-link" type="button" onClick={() => onToast("همهٔ اعلان‌ها خوانده شدند")}>خواندن همه</button>} /><section className="panel-card notification-list">{notices.map((notice) => <article className={`notification-row${notice.unread ? " is-unread" : ""}`} key={notice.title}><ServiceIllustration type={notice.icon} size="sm" /><div><strong>{notice.title}</strong><p>{notice.description}</p><small><Icon name="clock" size={13} />{notice.time}</small></div>{notice.unread && <i className="notification-unread" />}</article>)}</section></div>;
}

const faDigits = (value: string) => value.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

function TrustWarning() {
  return (
    <div className="trust-warning">
      <Icon name="shield" size={15} />
      <p>
        <strong>توجه:</strong> برای امنیت و آرامش شما، لطفاً فقط از امدادگرانی استفاده کنید که آرم و علائم رسمی خودرو چاره را دارند.
        تنها خدمات این امدادگران شامل گارانتی، پیگیری و حمایت کامل شرکت است؛ لطفاً از پذیرش امدادگران آزاد و بدون نشان خودداری کنید.
      </p>
    </div>
  );
}

function ServiceView({
  service,
  onBack,
  onToast,
  onRegister,
}: {
  service: Service;
  onBack: () => void;
  onToast: (message: string) => void;
  onRegister: (info: { car: string; problem: string; lat: number; lng: number }) => void;
}) {
  const [car, setCar] = useState("پژو ۲۰۷ پانوراما · ۱۴۰۱");
  const [problem, setProblem] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(true);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRegister({ car, problem, lat: coords?.lat ?? 35.6892, lng: coords?.lng ?? 51.389 });
  }

  return (
    <>
      <div className="subpage">
      <PageTitle title={service.name} subtitle={`ثبت درخواست ${service.name} با چند قدم ساده`} onBack={onBack} />

      <section className="service-hero">
        <Image
          src="/slides/service-hero.jpg"
          alt="بنر تمام‌عرض فرایند هوشمند امداد خودرو چاره"
          fill
          sizes="100vw"
          className="service-hero-image"
        />
      </section>

      <section className="panel-card service-request-card">
        <div className="request-heading">
          <span>درخواست خدمت</span>
          <h2>خودرو و مشکل را مشخص کن</h2>
          <p>موقعیت دریافت خدمت را روی نقشه انتخاب کن؛ بقیه‌اش با ما.</p>
        </div>
        <form className="service-request-form" onSubmit={submit}>
          <div className="service-request-grid">
            <div className="request-fields">
              <label className="form-field">
                <span className="field-label">خودروی شما</span>
                <span className="field-control">
                  <select value={car} onChange={(event) => setCar(event.target.value)}>
                    <option>پژو ۲۰۷ پانوراما · ۱۴۰۱</option>
                    <option>پراید ۱۳۱ · ۱۳۹۸</option>
                    <option>سایر خودروها</option>
                  </select>
                  <Icon name="chevron" size={15} />
                </span>
              </label>
              <label className="form-field">
                <span className="field-label">مشکل خودرو</span>
                <span className="field-control field-control--area">
                  <textarea value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="مثلاً: ماشین روشن نمی‌شود یا پنچر شده‌ام..." rows={4} required />
                </span>
              </label>
            </div>
            <div className="request-map">
              <div className="map-frame">
                <div className="map-frame-head">
                  <span className="map-frame-badge"><Icon name="pin" size={15} /></span>
                  <div className="map-frame-titles">
                    <strong>موقعیت دریافت خدمت</strong>
                    <small>روی نقشه بزنید یا موقعیت خود را پیدا کنید</small>
                  </div>
                  <span className="map-frame-tag"><Icon name="clock" size={12} /> امداد سریع</span>
                </div>
                <LocationPickerMap onPick={(lat, lng) => setCoords({ lat, lng })} onToast={onToast} />
                <div className="map-frame-foot">
                  <span><Icon name="shield" size={12} /> موقعیت شما فقط برای اعزام امدادگر استفاده می‌شود</span>
                  <span><Icon name="clock" size={12} /> حداکثر ۱۵ دقیقه تا رسیدن</span>
                </div>
              </div>
            </div>
          </div>
          <button className="primary-button request-submit" type="submit">ثبت درخواست خدمت <Icon name="arrow-left" size={17} /></button>
        </form>
      </section>
      </div>

      {noticeOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="trust-modal-title" onClick={() => setNoticeOpen(false)}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <span className="modal-icon"><Icon name="shield" size={24} /></span>
            <h3 id="trust-modal-title">نکته مهم امنیتی</h3>
            <p>
              برای امنیت و آرامش شما، لطفاً فقط از امدادگرانی استفاده کنید که آرم و علائم رسمی خودرو چاره را دارند.
              تنها خدمات این امدادگران شامل گارانتی، پیگیری و حمایت کامل شرکت است؛ لطفاً از پذیرش امدادگران آزاد و بدون نشان خودداری کنید.
            </p>
            <button type="button" className="modal-confirm-btn" onClick={() => setNoticeOpen(false)}>فهمیدم</button>
          </div>
        </div>
      )}
    </>
  );
}

function WaitingView({
  request,
  onCancel,
  onToast,
}: {
  request: { service: Service; car: string; problem: string; lat: number; lng: number };
  onCancel: () => void;
  onToast: (message: string) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onToast("امدادگر به محل شما رسید.");
  }, [secondsLeft, onToast]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="waiting-page">
      <div className="page-title-row waiting-title-row">
        <div className="page-title-main">
          <button className="back-button" type="button" onClick={onCancel} aria-label="بازگشت"><Icon name="arrow-right" size={19} /></button>
          <div><h1>در حال اعزام امدادگر</h1><p>{request.service.name} · {request.car}</p></div>
        </div>
      </div>

      <div className="map-frame">
        <div className="map-frame-head">
          <span className="map-frame-badge"><Icon name="pin" size={15} /></span>
          <div className="map-frame-titles">
            <strong>موقعیت شما روی نقشه</strong>
            <small>امدادگر به سمت این موقعیت در حرکت است</small>
          </div>
          <span className="map-frame-tag"><Icon name="clock" size={12} /> حداکثر ۱۵ دقیقه</span>
        </div>
        <div className="waiting-map">
          <UserPinMap lat={request.lat} lng={request.lng} />
        </div>
        <div className="map-frame-foot">
          <span><Icon name="shield" size={12} /> امدادگر رسمی خودرو چاره</span>
          <span><Icon name="car" size={12} /> ون امداد در مسیر شما</span>
        </div>
      </div>

      <section className="waiting-sheet">
        <div className="waiting-timer">
          <span className="waiting-timer-label">امدادگر در مسیر شماست</span>
          <strong className="waiting-timer-digits">{faDigits(`${mm}:${ss}`)}</strong>
          <span className="waiting-timer-sub">زمان باقی‌مانده تا رسیدن امدادگر (حداکثر ۱۵ دقیقه)</span>
        </div>

        <article className="driver-card">
          <Image src="/slides/driver-avatar.jpg" alt="عکس پروفایل رضا محمدی، امدادگر رسمی خودرو چاره" width={56} height={56} className="driver-photo" />
          <div className="driver-info">
            <strong>رضا محمدی</strong>
            <small>امدادگر رسمی خودرو چاره · امتیاز ۴.۹</small>
            <span className="driver-vehicle"><Icon name="car" size={13} /> ون امداد · ایران ۴۶ ط ۲۳۴</span>
          </div>
          <div className="driver-side">
            <strong>۲۵۰٬۰۰۰ <small>تومان</small></strong>
            <small>هزینهٔ تخمینی</small>
            <div className="driver-actions">
              <button type="button" className="driver-call" onClick={() => onToast("تماس با امدادگر در نسخهٔ کامل فعال می‌شود.")}>
                <Icon name="phone" size={14} /> تماس
              </button>
              <button type="button" className="driver-chat" onClick={() => onToast("گفتگو با امدادگر در نسخهٔ کامل فعال می‌شود.")}>
                <Icon name="chat" size={14} /> چت
              </button>
            </div>
          </div>
        </article>

        <button type="button" className="pay-button" onClick={() => onToast("پرداخت امن پس از انجام خدمت فعال می‌شود.")}>
          <Icon name="wallet" size={16} /> پرداخت
        </button>

        <TrustWarning />
        <button type="button" className="waiting-cancel" onClick={onCancel}>انصراف از درخواست</button>
      </section>
    </div>
  );
}

function AIChat({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: "سلام! من چاره‌یارم. برای چه چیزی دربارهٔ ماشینت کمکت کنم؟" }]);
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!text.trim()) return;
    const question = text.trim(); setMessages((items) => [...items, { from: "user", text: question }, { from: "bot", text: "حتماً! برای راهنمایی دقیق‌تر، از بخش خدمات یک گزینه انتخاب کن یا موضوعت را با کارشناس خودرو چاره در میان بگذار." }]); setText("");
  }
  return <>
    {open && <section className="chat-window" aria-label="گفت‌وگو با چاره‌یار"><div className="chat-header"><span className="chat-avatar"><span>AI</span></span><div><strong>چاره‌یار</strong><small><i />همراه هوشمند تو</small></div><button type="button" onClick={() => setOpen(false)} aria-label="بستن گفت‌وگو"><Icon name="close" size={19} /></button></div><div className="chat-messages">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={`chat-bubble${message.from === "user" ? " chat-bubble--user" : ""}`}>{message.text}</p>)}</div><form className="chat-input-row" onSubmit={send}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="پیامت را بنویس…" aria-label="پیام شما" /><button type="submit" aria-label="ارسال پیام"><Icon name="send" size={17} /></button></form><div className="chat-demo-note">همراه هوشمند خودرو چاره</div></section>}
    <button className={`ai-fab${open ? " ai-fab--open" : ""}`} type="button" onClick={() => setOpen(!open)} aria-label={open ? "بستن چاره‌یار" : "گفت‌وگو با هوش مصنوعی"}><span className="ai-fab-mascot"><AiMascot /></span><span className="ai-fab-copy">چاره‌یار <small>پشتیبانی هوشمند</small></span>{open && <Icon name="close" size={18} />}</button>
  </>;
}

export default function Dashboard() {
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [userName, setUserName] = useState("آرمان رضایی");
  const [username, setUsername] = useState("arman");
  const [userPhone, setUserPhone] = useState("");
  const [balance, setBalance] = useState(1250000);
  const [request, setRequest] = useState<{ service: Service; car: string; problem: string; lat: number; lng: number } | null>(null);

  useEffect(() => {
    const refreshProfile = () => {
      try {
        const stored = localStorage.getItem("khodrochare_session_v1") || sessionStorage.getItem("khodrochare_session_v1");
        if (!stored) return;
        const user = JSON.parse(stored) as UserSession;
        if (user.name) setUserName(user.name);
        if (user.username) setUsername(user.username);
        if (user.phone) setUserPhone(user.phone);
        if (user.wallet !== undefined) {
          const value = Number(latinDigits(user.wallet));
          if (!Number.isNaN(value)) setBalance(value);
        }
      } catch {
        // Keep the demo profile if browser storage is unavailable.
      }
    };
    const timer = window.setTimeout(refreshProfile, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3400);
  }

  function navigate(next: View) {
    setView(next);
    setDrawerOpen(false);
    setToast("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openService(service: Service) {
    setSelectedService(service);
    navigate("service");
  }

  function addBalance(amount: number) {
    const next = balance + amount;
    setBalance(next);
    try {
      const session = JSON.parse(localStorage.getItem("khodrochare_session_v1") || sessionStorage.getItem("khodrochare_session_v1") || "{}");
      session.wallet = next.toLocaleString("fa-IR");
      localStorage.setItem("khodrochare_session_v1", JSON.stringify(session));
    } catch { /* Local-only prototype. */ }
    notify("کیف پول شما با موفقیت شارژ شد.");
  }

  function saveProfile(nextName: string, nextPhone: string) {
    if (nextName) setUserName(nextName);
    setUserPhone(nextPhone);
    try {
      const persistentSession = localStorage.getItem("khodrochare_session_v1");
      const sessionStorageValue = sessionStorage.getItem("khodrochare_session_v1");
      const session = JSON.parse(persistentSession || sessionStorageValue || "{}");
      session.name = nextName;
      session.phone = nextPhone;
      const normalizedPhone = normalizePhoneNumber(nextPhone);
      if (session.username && session.username !== "admin" && /^09\\d{9}$/.test(normalizedPhone)) {
        const users = JSON.parse(localStorage.getItem("khodrochare_users_v1") || "[]") as { username: string; name: string; phone?: string }[];
        const updatedUsers = users.map((user) => user.username === session.username
          ? { ...user, name: nextName, username: normalizedPhone, phone: normalizedPhone }
          : user);
        localStorage.setItem("khodrochare_users_v1", JSON.stringify(updatedUsers));
        session.username = normalizedPhone;
        session.phone = normalizedPhone;
        setUsername(normalizedPhone);
        setUserPhone(normalizedPhone);
      }
      const storage = persistentSession ? localStorage : sessionStorage;
      storage.setItem("khodrochare_session_v1", JSON.stringify(session));
    } catch { /* Local-only prototype. */ }
  }

  function logout() {
    localStorage.removeItem("khodrochare_session_v1");
    sessionStorage.removeItem("khodrochare_session_v1");
    setDrawerOpen(false);
    router.push("/");
  }

  let content: ReactNode;
  switch (view) {
    case "home": content = <HomeView balance={balance} onService={openService} onNavigate={navigate} onToast={notify} />; break;
    case "wallet": content = <WalletView balance={balance} onAdd={addBalance} onBack={() => navigate("home")} />; break;
    case "history": content = <HistoryView onBack={() => navigate("home")} />; break;
    case "market": content = <MarketView onBack={() => navigate("home")} onToast={notify} />; break;
    case "hall": content = <HallView onBack={() => navigate("home")} onToast={notify} />; break;
    case "profile": content = <ProfileView name={userName} username={username} phone={userPhone} onSave={saveProfile} onBack={() => navigate("home")} onToast={notify} />; break;
    case "mycars": content = <MyCarsView onBack={() => navigate("home")} onToast={notify} />; break;
    case "addresses": content = <AddressesView onBack={() => navigate("home")} onToast={notify} />; break;
    case "invite": content = <InviteView onBack={() => navigate("home")} onToast={notify} />; break;
    case "support": content = <SupportView onBack={() => navigate("home")} onToast={notify} />; break;
    case "notifications": content = <NotificationsView onBack={() => navigate("home")} onToast={notify} />; break;
    case "service": content = <ServiceView service={selectedService} onBack={() => navigate("home")} onToast={notify} onRegister={(info) => { setRequest({ service: selectedService, ...info }); navigate("waiting"); }} />; break;
    case "waiting": content = request
      ? <WaitingView request={request} onToast={notify} onCancel={() => { setRequest(null); navigate("home"); notify("درخواست شما لغو شد."); }} />
      : <HomeView balance={balance} onService={openService} onNavigate={navigate} onToast={notify} />; break;
    default: content = <HomeView balance={balance} onService={openService} onNavigate={navigate} onToast={notify} />;
  }

  return (
    <div className="app-frame" dir="rtl">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="header-menu-wrap"><button className={`menu-button${drawerOpen ? " menu-button--active" : ""}`} type="button" onClick={() => setDrawerOpen(true)} aria-label="باز کردن منو"><span /><span /><span /></button><span className="menu-word">منو</span></div>
          <button className="header-brand-button" type="button" onClick={() => navigate("home")} aria-label="بازگشت به خانه"><BrandLogo compact /></button>
          <div className="header-meta"><button className="header-profile-chip" type="button" onClick={() => navigate("profile")}><Avatar name={userName} /><span className="header-profile-text"><strong>{userName}</strong><small>کیف پول <b>{balance.toLocaleString("fa-IR")}</b></small></span></button><button className="notification-button" type="button" onClick={() => navigate("notifications")} aria-label="اعلان‌ها"><Icon name="bell" size={20} /><i /></button></div>
        </div>
      </header>

      <main className={`app-main${view === "home" ? " app-main--home" : ""}`} key={view}>{content}</main>

      <nav className="bottom-nav" aria-label="ناوبری اصلی">{bottomItems.map((item) => <button className={`bottom-nav-item${view === item.view || (item.view === "market" && view === "market") || (item.view === "hall" && view === "hall") || (item.view === "profile" && view === "profile") ? " is-active" : ""}`} key={item.view} type="button" onClick={() => navigate(item.view)} aria-current={view === item.view ? "page" : undefined}><span className="bottom-nav-icon"><Icon name={item.icon} size={21} /></span><span>{item.label}</span></button>)}</nav>

      <div className={`drawer-backdrop${drawerOpen ? " is-visible" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={`app-drawer${drawerOpen ? " is-open" : ""}`} aria-label="منوی اصلی" aria-hidden={!drawerOpen}>
        <div className="drawer-header"><div className="drawer-user"><Avatar name={userName} large /><div><strong>{userName}</strong><span>خودروچاره‌ای عزیز</span><small><Icon name="wallet" size={13} /> موجودی کیف پول <b>{balance.toLocaleString("fa-IR")} تومان</b></small></div></div><button type="button" className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="بستن منو"><Icon name="close" size={18} /></button><div className="drawer-header-glow" /></div>
        <div className="drawer-content"><span className="drawer-section-label">خدمات و حساب من</span><nav className="drawer-nav">{drawerItems.map((item) => <button type="button" key={item.view} onClick={() => navigate(item.view)} className={view === item.view ? "is-current" : ""}><span className="drawer-nav-icon"><Icon name={item.icon} size={18} /></span><span>{item.label}</span><Icon name="chevron" size={15} className="drawer-arrow" /></button>)}</nav><button className="drawer-logout" type="button" onClick={logout}><span><Icon name="logout" size={18} /></span>خروج</button><div className="drawer-footer"><BrandLogo compact /><span>خودرو چاره · نسخه ۱.۰.۰</span></div></div>
      </aside>

      <AIChat open={chatOpen} setOpen={setChatOpen} />
      {toast && <div className="toast-message" role="status"><span><Icon name="check" size={17} /></span>{toast}<button type="button" onClick={() => setToast("")} aria-label="بستن پیام"><Icon name="close" size={15} /></button></div>}
    </div>
  );
}
