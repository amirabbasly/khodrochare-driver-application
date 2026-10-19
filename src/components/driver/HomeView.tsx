"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import { MoreDots3D, ServiceIllustration } from "@/components/ServiceIllustration";
import {
  Avatar,
  bannerSlides,
  formatToman,
  heroSlides,
  partCategories,
  moreServices,
  SectionTitle,
  serviceLogs,
  type DriverService,
  type LoadOffer,
  type PartCategory,
  type PartKey,
  type View,
} from "@/components/driver/shared";

function HeroSlider({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % total), 6500);
    return () => window.clearInterval(timer);
  }, [total]);

  return (
    <section className="hero-slider" aria-roledescription="carousel" aria-label="پیشنهادهای ویژهٔ ناوگان امداد">
      {heroSlides.map((slide, index) => (
        <article key={slide.id} className={`hero-slide${index === current ? " is-active" : ""}`} aria-hidden={index !== current}>
          <Image src={slide.image} alt="" fill sizes="(max-width: 760px) 100vw, 1320px" priority={index === 0} className="hero-slide-image" />
          <div className="hero-slide-veil" />
          <div className="hero-slide-copy">
            <span className="hero-slide-tag">{slide.tag}</span>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <button className="hero-slide-cta" type="button" tabIndex={index === current ? 0 : -1} onClick={() => onNavigate(slide.target)}>
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

function BannerStrip({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <section className="banner-strip-section" aria-label="پیشنهادهای ناوگان امداد">
      <SectionTitle title="چاره‌های بیشتر برای ناوگان" caption="برای دیدن همهٔ پیشنهادها، افقی اسکرول کن." />
      <div className="banner-strip">
        {bannerSlides.map((slide) => (
          <article key={slide.id} className="banner-strip-card">
            <Image src={slide.image} alt="" fill sizes="(max-width: 640px) 80vw, 380px" className="banner-strip-image" />
            <div className="banner-strip-veil" />
            <div className="banner-strip-copy">
              <span className="banner-strip-tag">{slide.tag}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <button className="banner-slide-link" type="button" onClick={() => onNavigate(slide.target)}>
                بیشتر ببین <Icon name="arrow-left" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service, onClick, delay }: { service: DriverService; onClick: () => void; delay?: number }) {
  return (
    <button className={`service-card service-card--${service.id}`} type="button" onClick={onClick}>
      <ServiceIllustration type={service.id} size="md" delay={delay} />
      <span className="service-name">{service.name}</span>
      <span className="service-note">{service.note}</span>
    </button>
  );
}

function PartCategoryCard({ category, onClick, delay }: { category: PartCategory; onClick: () => void; delay?: number }) {
  return (
    <button className={`part-cat-card part-cat-card--${category.accent}`} type="button" onClick={onClick}>
      <span className="part-cat-glow" aria-hidden="true" />
      <span className="part-cat-art"><ServiceIllustration type={category.id} size="lg" delay={delay} /></span>
      <strong>{category.name}</strong>
      <small>{category.note}</small>
      <span className="part-cat-price">از {category.priceFrom} تومان</span>
    </button>
  );
}

export function LoadOfferCard({
  load,
  onAccept,
  onReject,
  onProfile,
  acceptLabel = "تأیید بار",
  compact = false,
}: {
  load: LoadOffer;
  onAccept: () => void;
  onReject?: () => void;
  onProfile?: () => void;
  acceptLabel?: string;
  compact?: boolean;
}) {
  return (
    <article className={`load-offer${compact ? " load-offer--compact" : ""}`}>
      <div className="load-offer-head">
        <div className="load-person">
          <Avatar name={load.customer} tone={load.tone} />
          <div>
            <strong>{load.customer}</strong>
            <small><Icon name="shield" size={12} /> {load.role} · <b>★ {load.rating.toLocaleString("fa-IR")}</b></small>
          </div>
        </div>
        <span className="load-free-badge"><i /> بار آزاد</span>
      </div>

      <div className="load-route">
        <div className="route-stop">
          <span className="route-dot route-dot--from" />
          <small>مبدأ</small>
          <strong>{load.from}</strong>
        </div>
        <span className="route-line" aria-hidden="true"><i /></span>
        <div className="route-stop route-stop--to">
          <span className="route-dot route-dot--to" />
          <small>مقصد</small>
          <strong>{load.to}</strong>
        </div>
        <span className="route-distance"><Icon name="route" size={13} /> {load.distanceKm.toLocaleString("fa-IR")} کیلومتر</span>
      </div>

      <div className="load-facts">
        <span><Icon name="car" size={14} /> {load.car}</span>
        <span className="load-plate"><Icon name="tag" size={13} /> {load.plate}</span>
        <span><Icon name="clock" size={14} /> {load.when}</span>
        <span className="load-price">{formatToman(load.price)}</span>
      </div>
      {!compact && <p className="load-note">{load.note}</p>}

      <div className="load-offer-actions">
        <button className="load-accept" type="button" onClick={onAccept}><Icon name="check" size={16} /> {acceptLabel}</button>
        {onReject && <button className="load-reject" type="button" onClick={onReject}><Icon name="close" size={15} /> رد کردن</button>}
        {onProfile && <button className="load-profile" type="button" onClick={onProfile}><Icon name="user" size={15} /> پروفایل</button>}
      </div>
    </article>
  );
}

const ROTATE_SECONDS = 15;

function LoadHero({
  ready,
  loads,
  activeCount,
  onToggleReady,
  onNavigate,
  onAccept,
  onReject,
  onProfile,
}: {
  ready: boolean;
  loads: LoadOffer[];
  activeCount: number;
  onToggleReady: () => void;
  onNavigate: (view: View) => void;
  onAccept: (load: LoadOffer) => void;
  onReject: (load: LoadOffer) => void;
  onProfile: (load: LoadOffer) => void;
}) {
  const total = loads.length;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!ready || total === 0) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [ready, total]);

  const index = total > 0 ? Math.floor(tick / ROTATE_SECONDS) % total : 0;
  const seconds = ROTATE_SECONDS - (tick % ROTATE_SECONDS);
  const current = total > 0 ? loads[index] : null;
  const progress = Math.round((seconds / ROTATE_SECONDS) * 100);

  return (
    <section className={`load-hero${ready ? " is-ready" : ""}`} aria-label="آخرین بار و آمادگی دریافت بار">
      <div className="load-hero-top">
        <div className="lh-panel-head lh-panel-head--load">
          <span className="lh-panel-index">۱</span>
          <strong>درخواست بار</strong>
          <small className="lh-panel-hint">اطلاعات آخرین بار آزاد</small>
          <span className="lh-live"><i /> آخرین بار</span>
          <span className="lh-counter">
            {total > 0 ? `بار ${(index + 1).toLocaleString("fa-IR")} از ${total.toLocaleString("fa-IR")}` : "بدون بار آزاد"}
          </span>
          <span className="lh-refresh"><Icon name="refresh" size={12} /> هر ۱۵ ثانیه به‌روز می‌شود</span>
          <button className="lh-link" type="button" onClick={() => onNavigate("shahr")}>
            تالار ایرانشهر <Icon name="arrow-left" size={14} />
          </button>
        </div>

        {!ready ? (
          <div className="lh-top-empty">
            <span className="lh-empty-icon"><Icon name="power" size={22} /></span>
            <div>
              <strong>آمادگی دریافت بار غیرفعال است</strong>
              <p>بارها تا وقتی آمادگی را فعال نکنی نمایش داده نمی‌شوند.</p>
            </div>
          </div>
        ) : !current ? (
          <div className="lh-top-empty lh-top-empty--calm">
            <span className="lh-empty-icon"><Icon name="check" size={22} /></span>
            <div>
              <strong>بار آزادی در محدودهٔ تو نیست</strong>
              <p>آمادگی‌ات فعال است؛ به‌محض ثبت بار جدید اینجا نمایش داده می‌شود.</p>
            </div>
          </div>
        ) : (
          <div className="lh-top-body">
            <div className="lh-person">
              <Avatar name={current.customer} tone={current.tone} />
              <div>
                <strong>{current.customer}</strong>
                <small><Icon name="shield" size={12} /> {current.role} · ★ {current.rating.toLocaleString("fa-IR")}</small>
              </div>
            </div>

            <div className="lh-route">
              <span className="lh-stop"><i className="route-dot route-dot--from" /><span><small>مبدأ</small><b>{current.from}</b></span></span>
              <span className="lh-route-line"><Icon name="arrow-left" size={13} /></span>
              <span className="lh-stop"><i className="route-dot route-dot--to" /><span><small>مقصد</small><b>{current.to}</b></span></span>
            </div>

            <div className="lh-facts">
              <span><Icon name="car" size={13} /> {current.car}</span>
              <span dir="ltr"><Icon name="tag" size={12} /> {current.plate}</span>
              <span><Icon name="route" size={13} /> {current.distanceKm.toLocaleString("fa-IR")} کیلومتر</span>
              <span><Icon name="clock" size={13} /> {current.when}</span>
            </div>

            <div className="lh-price">
              <small>کرایهٔ بار</small>
              <b>{formatToman(current.price)}</b>
            </div>
          </div>
        )}
      </div>

      <div className="load-hero-grid">
        <div className={`lh-ready${ready ? " is-on" : ""}`}>
          <div className="lh-panel-head lh-panel-head--ready">
            <span className="lh-panel-index">۲</span>
            <strong>وضعیت آمادگی</strong>
            <small className="lh-panel-hint">کلید روشن/خاموش دریافت بار</small>
          </div>
          <div className="lh-ready-top">
            <span className="lh-ready-icon"><Icon name="power" size={20} /></span>
            <button
              className={`ready-switch${ready ? " is-on" : ""}`}
              type="button"
              role="switch"
              aria-checked={ready}
              onClick={onToggleReady}
              aria-label={ready ? "غیرفعال کردن آمادگی" : "فعال کردن آمادگی"}
            >
              <i />
            </button>
          </div>
          <strong>{ready ? "آمادگی فعال" : "آمادگی غیرفعال"}</strong>
          <p>{ready ? "بارهای نزدیک محدودهٔ تو بهت پیشنهاد می‌شود." : "برای دیدن و گرفتن بار، آمادگی را فعال کن."}</p>
          <div className="lh-ready-foot">
            <span><Icon name="briefcase" size={13} /> {activeCount.toLocaleString("fa-IR")} بار در حال انجام</span>
            <button type="button" onClick={() => onNavigate("readiness")}>شیفت و محدوده <Icon name="chevron" size={12} /></button>
          </div>
        </div>

        <div className="lh-actions">
          <div className="lh-panel-head lh-panel-head--answer">
            <span className="lh-panel-index">۳</span>
            <strong>پاسخ شما</strong>
            <small className="lh-panel-hint">فقط برای همین بار</small>
          </div>
          <div className="lh-timer" style={{ ["--timer-progress" as string]: `${progress}%` }}>
            <span className="lh-timer-ring">
              <b>{seconds.toLocaleString("fa-IR")}</b>
              <small>ثانیه</small>
            </span>
            <div className="lh-timer-copy">
              <strong>زمان تصمیم‌گیری</strong>
              <p>تا تغییر بار بعدی؛ بعد از این زمان بار بعدی جای این یکی را می‌گیرد.</p>
            </div>
          </div>
          <div className="lh-action-buttons">
            <button
              className="lh-accept"
              type="button"
              disabled={!ready || !current}
              onClick={() => current && onAccept(current)}
            >
              <Icon name="check" size={17} /> تأیید و گرفتن بار
            </button>
            <button
              className="lh-reject"
              type="button"
              disabled={!ready || !current}
              onClick={() => current && onReject(current)}
            >
              <Icon name="close" size={16} /> رد کردن
            </button>
            <button
              className="lh-profile"
              type="button"
              disabled={!current}
              onClick={() => current && onProfile(current)}
            >
              <Icon name="user" size={15} /> پروفایل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceLogCard({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <section className="service-log-card" aria-label="آخرین سرویس‌های خودرو">
      <div className="service-log-head">
        <div><Icon name="refresh" size={16} /><strong>آخرین سرویس‌های من</strong></div>
        <button type="button" onClick={() => onNavigate("maintenance")}>همه <Icon name="chevron" size={13} /></button>
      </div>
      <div className="service-log-list">
        {serviceLogs.slice(0, 2).map((log) => (
          <button className="service-log-row" type="button" key={log.id} onClick={() => onNavigate("maintenance")}>
            <span className={`service-log-icon service-log-icon--${log.tone}`}><ServiceIllustration type={log.art} size="sm" /></span>
            <span className="service-log-body">
              <strong>{log.title}</strong>
              <small>{log.date} · {log.km} کیلومتر</small>
            </span>
            <span className="service-log-cost">{log.cost}<small> تومان</small></span>
          </button>
        ))}
      </div>
      <div className="service-log-foot"><i /> سرویس بعدی: ۱٬۶۰۰ کیلومتر دیگر</div>
    </section>
  );
}

export function HomeView({
  balance,
  ready,
  pendingLoads,
  activeCount,
  onToggleReady,
  onNavigate,
  onToast,
  onAcceptLoad,
  onRejectLoad,
  onProfile,
  onOpenPart,
  onOpenService,
}: {
  balance: number;
  ready: boolean;
  pendingLoads: LoadOffer[];
  activeCount: number;
  onToggleReady: () => void;
  onNavigate: (view: View) => void;
  onToast: (message: string) => void;
  onAcceptLoad: (load: LoadOffer) => void;
  onRejectLoad: (load: LoadOffer) => void;
  onProfile: (load: LoadOffer) => void;
  onOpenPart: (key: PartKey) => void;
  onOpenService: (service: DriverService) => void;
}) {
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

      <LoadHero
        ready={ready}
        loads={pendingLoads}
        activeCount={activeCount}
        onToggleReady={onToggleReady}
        onNavigate={onNavigate}
        onAccept={onAcceptLoad}
        onReject={onRejectLoad}
        onProfile={onProfile}
      />

      <ServiceLogCard onNavigate={onNavigate} />

      <section className="main-services-section">
        <SectionTitle
          title="خرید لوازم یدکی"
          caption="گیربکس، موتور و قطعات ضروری ناوگان؛ با قیمت همکار و ارسال سریع."
          action={<button className="text-link" type="button" onClick={() => onNavigate("parts")}>همهٔ قطعات <Icon name="arrow-left" size={14} /></button>}
        />
        <div className="main-services-grid parts-row">
          {partCategories.map((category, index) => (
            <PartCategoryCard
              key={category.key}
              category={category}
              delay={index * 0.35}
              onClick={() => onOpenPart(category.key)}
            />
          ))}
        </div>
      </section>

      <HeroSlider onNavigate={onNavigate} />

      <section className="services-section" id="services">
        <SectionTitle
          title="بقیه خدمات"
          caption="خدمات فنی، بیمه و ابزارهایی که یک امدادگر حرفه‌ای لازم دارد."
          action={<span className="service-count"><Icon name="sparkles" size={12} /> {moreServices.length + 1} خدمت دیگر</span>}
        />
        <div className="services-grid">
          {moreServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} onClick={() => onOpenService(service)} delay={index * 0.18} />
          ))}
          <button className="service-card service-card--more" type="button" onClick={() => onToast("به‌زودی خدمات بیشتری برای ناوگان اضافه می‌شود")}>
            <MoreDots3D delay={0.4} />
            <span className="service-name">بیشتر</span>
            <span className="service-note">به‌زودی بیشتر</span>
          </button>
        </div>
      </section>

      <BannerStrip onNavigate={onNavigate} />
    </div>
  );
}
