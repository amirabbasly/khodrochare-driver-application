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

function ReadinessCard({ ready, onToggle, onNavigate }: { ready: boolean; onToggle: () => void; onNavigate: (view: View) => void }) {
  return (
    <section className={`readiness-card${ready ? " is-on" : ""}`} aria-label="آمادگی دریافت بار">
      <div className="readiness-top">
        <span className="readiness-icon"><Icon name="power" size={20} /></span>
        <div className="readiness-copy">
          <small>آمادگی دریافت بار</small>
          <strong>{ready ? "آمادگی فعال" : "آمادگی غیرفعال"}</strong>
        </div>
        <button
          className={`ready-switch${ready ? " is-on" : ""}`}
          type="button"
          role="switch"
          aria-checked={ready}
          onClick={onToggle}
          aria-label={ready ? "غیرفعال کردن آمادگی" : "فعال کردن آمادگی"}
        >
          <i />
        </button>
      </div>
      <p>{ready ? "بارهای نزدیک محدودهٔ خدمتت الان بهت پیشنهاد می‌شود." : "اپلیکیشن فعلاً باری بهت نشان نمی‌دهد؛ برای دریافت بار آمادگی را فعال کن."}</p>
      <button className="readiness-link" type="button" onClick={() => onNavigate("readiness")}>
        تنظیم شیفت و محدوده <Icon name="arrow-left" size={14} />
      </button>
      <span className="readiness-pulse" aria-hidden="true" />
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
  const visibleLoads = pendingLoads.slice(0, 2);

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

      <section className="ops-layout" aria-label="آخرین بارها و وضعیت آمادگی">
        <div className="ops-board">
          <div className="ops-board-head">
            <div className="ops-board-title">
              <span className="live-dot" />
              <strong>آخرین بارها</strong>
              <span className="ops-count">{pendingLoads.length.toLocaleString("fa-IR")} بار آزاد</span>
            </div>
            <button className="ops-board-link" type="button" onClick={() => onNavigate("shahr")}>
              تالار ایرانشهر <Icon name="arrow-left" size={14} />
            </button>
          </div>

          {!ready ? (
            <div className="ops-offline">
              <span className="ops-offline-icon"><Icon name="power" size={22} /></span>
              <div>
                <strong>آمادگی دریافت بار غیرفعال است</strong>
                <p>با فعال کردن آمادگی، همین‌جا بارهای آزاد نزدیک محدوده‌ات را می‌بینی.</p>
              </div>
              <button type="button" onClick={onToggleReady}>فعال کردن</button>
            </div>
          ) : visibleLoads.length === 0 ? (
            <div className="ops-offline ops-offline--empty">
              <span className="ops-offline-icon"><Icon name="check" size={22} /></span>
              <div><strong>همهٔ بارها بررسی شدند</strong><p>بار آزاد جدیدی در محدودهٔ تو نیست. آمادگی‌ات فعال است.</p></div>
              <button type="button" onClick={() => onNavigate("shahr")}>تالار ایرانشهر</button>
            </div>
          ) : (
            <div className="ops-load-list">
              {visibleLoads.map((load) => (
                <LoadOfferCard
                  key={load.id}
                  load={load}
                  compact
                  onAccept={() => onAcceptLoad(load)}
                  onReject={() => onRejectLoad(load)}
                  onProfile={() => onProfile(load)}
                />
              ))}
            </div>
          )}

          <div className="ops-board-foot">
            <span><Icon name="briefcase" size={13} /> {activeCount.toLocaleString("fa-IR")} بار در حال انجام</span>
            <button type="button" onClick={() => onNavigate("loads")}>بارهای من <Icon name="arrow-left" size={13} /></button>
          </div>
        </div>

        <div className="ops-side">
          <ReadinessCard ready={ready} onToggle={onToggleReady} onNavigate={onNavigate} />
          <ServiceLogCard onNavigate={onNavigate} />
        </div>
      </section>

      <section className="main-services-section">
        <SectionTitle
          title="خرید لوازم یدکی"
          caption="گیربکس، موتور و قطعات ضروری ناوگان؛ با قیمت همکار و ارسال سریع."
          action={<button className="text-link" type="button" onClick={() => onNavigate("parts")}>همهٔ قطعات <Icon name="arrow-left" size={14} /></button>}
        />
        <div className="main-services-grid">
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
