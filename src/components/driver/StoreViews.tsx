"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";
import { ServiceIllustration } from "@/components/ServiceIllustration";
import {
  PageTitle,
  partCategories,
  partProducts,
  SectionTitle,
  techServices,
  type DriverService,
  type PartKey,
} from "@/components/driver/shared";

type PartFilter = PartKey | "all";

export function PartsView({
  initialPart = "all",
  onBack,
  onToast,
}: {
  initialPart?: PartFilter;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [filter, setFilter] = useState<PartFilter>(initialPart);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(0);

  const products = useMemo(() => {
    const term = search.trim();
    return partProducts.filter((product) => {
      const matchesPart = filter === "all" || product.part === filter;
      const matchesSearch = !term || `${product.name} ${product.detail}`.includes(term);
      return matchesPart && matchesSearch;
    });
  }, [filter, search]);

  function addToCart(name: string) {
    setCart((current) => current + 1);
    onToast(`${name} به سبد خرید ناوگان اضافه شد.`);
  }

  return (
    <div className="subpage">
      <PageTitle
        title="خرید لوازم یدکی"
        subtitle="قطعات اصلی با قیمت همکاران ناوگان امداد"
        onBack={onBack}
        action={<button className="icon-outline-button parts-cart" type="button" onClick={() => onToast(cart ? `${cart.toLocaleString("fa-IR")} قلم در سبد خرید توست.` : "سبد خرید خالی است.")} aria-label="سبد خرید"><Icon name="market" size={18} />{cart > 0 && <i>{cart.toLocaleString("fa-IR")}</i>}</button>}
      />

      <section className="parts-hero">
        <Image src="/slides/driver/hero-parts.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 1200px" className="parts-hero-image" priority />
        <span className="parts-hero-veil" aria-hidden="true" />
        <div className="parts-hero-copy">
          <span className="parts-hero-tag"><Icon name="tag" size={14} /> فروشگاه همکاران</span>
          <h2>قطعهٔ اصل، قیمت همکار.</h2>
          <p>گیربکس، موتور، بدنه و برق؛ ارسال به تعمیرگاه یا محل مأموریت.</p>
        </div>
        <div className="parts-hero-badges">
          <span><Icon name="shield" size={14} /> اصالت قطعه</span>
          <span><Icon name="car" size={14} /> ارسال سریع</span>
          <span><Icon name="wallet" size={14} /> پرداخت اعتباری</span>
        </div>
      </section>

      <div className="market-toolbar">
        <div className="search-field">
          <Icon name="search" size={19} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="دنبال چه قطعه‌ای هستی؟" aria-label="جست‌وجوی قطعه" />
        </div>
        <button className="filter-button" type="button" onClick={() => onToast("فیلتر برند و خودرو به‌زودی اضافه می‌شود")}>
          <Icon name="filter" size={17} /> فیلترها
        </button>
      </div>

      <div className="category-tabs" role="tablist" aria-label="دسته‌بندی قطعات">
        <button type="button" role="tab" aria-selected={filter === "all"} className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>همهٔ قطعات</button>
        {partCategories.map((category) => (
          <button key={category.key} type="button" role="tab" aria-selected={filter === category.key} className={filter === category.key ? "is-active" : ""} onClick={() => setFilter(category.key)}>
            {category.name}
          </button>
        ))}
      </div>

      <SectionTitle
        title={filter === "all" ? "پیشنهادهای فروشگاه ناوگان" : partCategories.find((category) => category.key === filter)?.note ?? "قطعات"}
        caption={`${products.length.toLocaleString("fa-IR")} قطعهٔ آمادهٔ ارسال`}
        action={<button className="text-link" type="button" onClick={() => onToast("لیست کامل قطعات در نسخهٔ نهایی نمایش داده می‌شود")}>مشاهده همه <Icon name="arrow-left" size={14} /></button>}
      />

      <div className="part-products">
        {products.map((product) => (
          <article className="part-product" key={product.id}>
            <div className={`part-product-visual part-product-visual--${product.tone}`}>
              <span className="part-product-badge">{product.badge}</span>
              <ServiceIllustration type={product.art} size="lg" />
            </div>
            <div className="part-product-info">
              <span className="part-product-cat">{partCategories.find((category) => category.key === product.part)?.name}</span>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <div className="part-product-bottom">
                <strong>{product.price} <small>تومان</small>{product.oldPrice && <del>{product.oldPrice}</del>}</strong>
                <button type="button" onClick={() => addToCart(product.name)} aria-label={`افزودن ${product.name} به سبد خرید`}><Icon name="plus" size={17} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {products.length === 0 && (
        <div className="panel-card loads-empty">
          <span><Icon name="search" size={26} /></span>
          <strong>قطعه‌ای پیدا نشد</strong>
          <p>عبارت دیگری جست‌وجو کن یا دسته‌بندی را تغییر بده.</p>
        </div>
      )}

      <p className="history-note"><Icon name="shield" size={18} /><span>همهٔ قطعات فروشگاه ناوگان دارای ضمانت اصالت و امکان مرجوعی تا ۷ روز هستند.</span></p>
    </div>
  );
}

export function TechView({
  initialId,
  onBack,
  onToast,
}: {
  initialId?: string;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [selected, setSelected] = useState<DriverService>(techServices.find((service) => service.id === initialId) ?? techServices[0]);
  const [car, setCar] = useState("یدک‌کش / جرثقیل");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isInquiry = ["fines", "license", "tolls"].includes(selected.id);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    onToast(isInquiry ? `استعلام ${selected.name} انجام شد.` : `درخواست ${selected.name} ثبت شد؛ کارشناس تماس می‌گیرد.`);
  }

  return (
    <div className="subpage">
      <PageTitle title="خدمات فنی و بیمه" subtitle="خدمات تخصصی برای خودروی امدادی و ناوگان تو" onBack={onBack} />

      <section className="tech-hero">
        <div className="tech-hero-copy">
          <span className="tech-hero-tag"><Icon name="shield" size={14} /> پشتیبانی فنی ناوگان</span>
          <h2>قبل از اعزام بعدی،<br />خودروت را مطمئن کن.</h2>
          <p>بیمه، دیاگ، کارشناسی، کارواش و سرویس دوره‌ای؛ همه با تعرفهٔ همکاران و پشتیبانی اختصاصی.</p>
        </div>
        <div className="tech-hero-art">
          <ServiceIllustration type="diagnostic" size="lg" />
          <ServiceIllustration type="insurance" size="md" delay={0.3} />
          <ServiceIllustration type="battery" size="md" delay={0.6} />
        </div>
      </section>

      <section className="tech-services-section">
        <SectionTitle title="انتخاب خدمت" caption="روی هر خدمت بزن تا جزئیات و فرم درخواست را ببینی." />
        <div className="tech-grid">
          {techServices.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`tech-card${selected.id === service.id ? " is-active" : ""}`}
              onClick={() => {
                setSelected(service);
                setSubmitted(false);
              }}
            >
              <ServiceIllustration type={service.id} size="sm" />
              <span><strong>{service.name}</strong><small>{service.note}</small></span>
              <Icon name="chevron" size={15} />
            </button>
          ))}
        </div>
      </section>

      <div className="tech-layout">
        <section className="panel-card tech-detail">
          <div className="tech-detail-head">
            <span className="tech-detail-art"><ServiceIllustration type={selected.id} size="md" /></span>
            <div>
              <span className="panel-eyebrow">{isInquiry ? "استعلام خودکار" : "درخواست خدمت"}</span>
              <h2>{selected.name}</h2>
              <p>{selected.note}</p>
            </div>
          </div>
          <p className="tech-description">{selected.description}</p>
          <ul className="tech-benefits">
            <li><Icon name="check" size={14} /> تعرفهٔ ویژهٔ ناوگان امداد و سفیران</li>
            <li><Icon name="check" size={14} /> پیگیری اختصاصی توسط کارشناس</li>
            <li><Icon name="check" size={14} /> ثبت در پروندهٔ خودرو و اعلان یادآور</li>
          </ul>

          {submitted ? (
            <div className="tech-success">
              <span><Icon name="check" size={20} /></span>
              <div>
                <strong>{isInquiry ? "استعلام انجام شد" : "درخواستت ثبت شد"}</strong>
                <p>{isInquiry ? "نتیجهٔ استعلام در اعلان‌ها و پروفایل خودرو ذخیره شد." : "کارشناس ناوگان تا ۱۵ دقیقهٔ آینده با تو تماس می‌گیرد."}</p>
              </div>
              <button type="button" onClick={() => setSubmitted(false)}>درخواست جدید</button>
            </div>
          ) : (
            <form className="tech-form" onSubmit={submit}>
              <div className="tech-form-grid">
                <label className="form-field">
                  <span className="field-label">خودرو</span>
                  <span className="field-control">
                    <select value={car} onChange={(event) => setCar(event.target.value)}>
                      <option>یدک‌کش / جرثقیل</option>
                      <option>ون امداد سیار</option>
                      <option>خودروی سواری امداد</option>
                      <option>وانت حمل قطعات</option>
                    </select>
                    <Icon name="chevron" size={15} />
                  </span>
                </label>
                <label className="form-field">
                  <span className="field-label">زمان درخواست</span>
                  <span className="field-control">
                    <select defaultValue="امروز">
                      <option>امروز</option>
                      <option>فردا</option>
                      <option>این هفته</option>
                    </select>
                    <Icon name="chevron" size={15} />
                  </span>
                </label>
              </div>
              <label className="form-field">
                <span className="field-label">توضیح تکمیلی {isInquiry && "(اختیاری)"}</span>
                <span className="field-control field-control--area">
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder={isInquiry ? "مثلاً شمارهٔ پلاک یا کد ملی" : "مشکل یا درخواستت را کوتاه بنویس…"} />
                </span>
              </label>
              <button className="primary-button" type="submit">
                {isInquiry ? "شروع استعلام" : "ثبت درخواست خدمت"} <Icon name="arrow-left" size={16} />
              </button>
            </form>
          )}
        </section>

        <aside className="panel-card tech-contact">
          <span className="tech-contact-icon"><Icon name="support" size={24} /></span>
          <h2>کارشناس فنی ناوگان</h2>
          <p>هر ساعت از شبانه‌روز، برای عیب‌یابی و هماهنگی کنارت هستیم.</p>
          <a href="tel:02191001200" dir="ltr">۰۲۱ - ۹۱۰۰ - ۱۲۰۰</a>
          <button type="button" onClick={() => onToast("گفت‌وگو با کارشناس در تالار ایرانشهر باز شد")}>گفت‌وگو با کارشناس <Icon name="chat" size={15} /></button>
          <div className="tech-contact-note"><Icon name="clock" size={13} /> میانگین پاسخ‌گویی: ۳ دقیقه</div>
        </aside>
      </div>
    </div>
  );
}
