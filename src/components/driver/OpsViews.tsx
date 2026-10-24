"use client";
import './payment-parts.css';

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";
import { ServiceIllustration } from "@/components/ServiceIllustration";
import { api, latinDigits, errorMessage, type Tracking } from "@/lib/api";
import { UserPinMap } from "@/components/Maps";
import { LoadOfferCard } from "@/components/driver/HomeView";
import {
  formatToman,
  PageTitle,
  SectionTitle,
  serviceLogs,
  type LoadOffer,
} from "@/components/driver/shared";

const faDigits = (value: string) => value.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

export function LoadsView({
  loads,
  onBack,
  onToast,
  onAccept,
  onReject,
  onOpenJob,
  onProfile,
}: {
  loads: LoadOffer[];
  onBack: () => void;
  onToast: (message: string) => void;
  onAccept: (load: LoadOffer) => void;
  onReject: (load: LoadOffer) => void;
  onOpenJob: (load: LoadOffer) => void;
  onProfile: (load: LoadOffer) => void;
}) {
  const [filter, setFilter] = useState<"pending" | "active" | "done">("pending");
  const earnings = loads.filter((load) => load.status === "done").reduce((total, load) => total + load.price, 0);
  const filtered = loads.filter((load) => load.status === filter);
  const tabs = [
    { key: "pending" as const, label: "در انتظار تأیید", count: loads.filter((load) => load.status === "pending").length },
    { key: "active" as const, label: "در حال انجام", count: loads.filter((load) => load.status === "active").length },
    { key: "done" as const, label: "تحویل‌شده", count: loads.filter((load) => load.status === "done").length },
  ];

  return (
    <div className="subpage">
      <PageTitle
        title="بارهای من"
        subtitle="همهٔ بارهای آزاد، در حال انجام و تسویه‌شدهٔ تو"
        onBack={onBack}
        action={<button className="primary-button compact-button" type="button" onClick={() => onToast("فیلتر بارها بر اساس محدوده به‌زودی فعال می‌شود")}><Icon name="filter" size={15} /> محدودهٔ من</button>}
      />

      <section className="loads-stats" aria-label="خلاصهٔ بارها">
        <div><span className="loads-stat-icon loads-stat-icon--orange"><Icon name="route" size={19} /></span><small>بار آزاد</small><strong>{faDigits(String(loads.filter((load) => load.status === "pending").length))}</strong></div>
        <div><span className="loads-stat-icon loads-stat-icon--blue"><Icon name="briefcase" size={19} /></span><small>در حال انجام</small><strong>{faDigits(String(loads.filter((load) => load.status === "active").length))}</strong></div>
        <div><span className="loads-stat-icon loads-stat-icon--green"><Icon name="wallet" size={19} /></span><small>درآمد تسویه‌شده</small><strong>{formatToman(earnings)}</strong></div>
        <div><span className="loads-stat-icon loads-stat-icon--navy"><Icon name="star" size={19} /></span><small>امتیاز ناوگان</small><strong>۴٫۸</strong></div>
      </section>

      <div className="filter-tabs" role="tablist" aria-label="وضعیت بارها">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" role="tab" aria-selected={filter === tab.key} className={filter === tab.key ? "is-active" : ""} onClick={() => setFilter(tab.key)}>
            {tab.label} <span className="filter-count">{faDigits(String(tab.count))}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="panel-card loads-empty">
          <span><Icon name="briefcase" size={26} /></span>
          <strong>باری در این بخش نیست</strong>
          <p>بارهای آزاد جدید در تالار ایرانشهر منتشر می‌شوند.</p>
        </div>
      ) : (
        <div className="loads-list">
          {filtered.map((load) => (
            <LoadOfferCard
              key={load.id}
              load={load}
              onAccept={() => (load.status === "pending" ? onAccept(load) : onOpenJob(load))}
              acceptLabel={load.status === "pending" ? "تأیید بار" : load.status === "active" ? "ادامهٔ بار" : "مشاهدهٔ جزئیات"}
              onReject={load.status === "pending" ? () => onReject(load) : undefined}
              onProfile={() => onProfile(load)}
            />
          ))}
        </div>
      )}

      <p className="history-note"><Icon name="shield" size={18} /><span>بارها فقط در محدودهٔ آمادگی و شیفت فعال تو نمایش داده می‌شوند.</span></p>
    </div>
  );
}

const ZONES = ["سعادت‌آباد", "ونک", "تهرانپارس", "تجریش", "کرج", "محور شمال"];

export function ReadinessView({
  ready,
  onToggle,
  onBack,
  onToast,
}: {
  ready: boolean;
  onToggle: () => void;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [zones, setZones] = useState<string[]>(["سعادت‌آباد", "ونک"]);
  const [radius, setRadius] = useState(25);
  const [start, setStart] = useState("۰۸:۰۰");
  const [end, setEnd] = useState("۲۰:۰۰");

  function toggleZone(zone: string) {
    setZones((current) => current.includes(zone) ? current.filter((item) => item !== zone) : [...current, zone]);
  }

  return (
    <div className="subpage">
      <PageTitle title="آمادگی و شیفت" subtitle="کنترل کن چه زمانی و در کدام محدوده بار بگیری" onBack={onBack} />

      <section className={`readiness-hero${ready ? " is-on" : ""}`}>
        <div className="readiness-hero-glow" aria-hidden="true" />
        <span className="readiness-hero-icon"><Icon name="power" size={26} /></span>
        <div className="readiness-hero-copy">
          <span>وضعیت دریافت بار</span>
          <h2>{ready ? "آمادگی فعال است" : "آمادگی غیرفعال است"}</h2>
          <p>{ready ? "بارهای آزاد محدودهٔ تو همین حالا به اپلیکیشن ارسال می‌شود." : "تا زمانی که آمادگی را فعال نکنی، اپلیکیشن باری به تو نشان نمی‌دهد."}</p>
        </div>
        <button
          className={`ready-switch ready-switch--large${ready ? " is-on" : ""}`}
          type="button"
          role="switch"
          aria-checked={ready}
          onClick={onToggle}
          aria-label={ready ? "غیرفعال کردن آمادگی" : "فعال کردن آمادگی"}
        >
          <i />
        </button>
      </section>

      <div className="readiness-grid">
        <section className="panel-card readiness-panel">
          <SectionTitle title="محدودهٔ خدمت" caption="بارهای داخل این مناطق برایت پیشنهاد می‌شود." />
          <div className="zone-chips">
            {ZONES.map((zone) => (
              <button key={zone} type="button" className={zones.includes(zone) ? "is-active" : ""} onClick={() => toggleZone(zone)}>
                <Icon name="pin" size={13} /> {zone}
              </button>
            ))}
          </div>
          <label className="radius-field">
            <span>شعاع پوشش: <b>{radius.toLocaleString("fa-IR")} کیلومتر</b></span>
            <input type="range" min={5} max={60} step={5} value={radius} onChange={(event) => setRadius(Number(event.target.value))} aria-label="شعاع پوشش" />
          </label>
        </section>

        <section className="panel-card readiness-panel">
          <SectionTitle title="ساعت شیفت" caption="فقط در این بازه بار دریافت می‌کنی." />
          <div className="shift-fields">
            <label className="form-field"><span className="field-label">شروع شیفت</span><span className="field-control"><input value={start} onChange={(event) => setStart(event.target.value)} dir="ltr" placeholder="۰۸:۰۰" /></span></label>
            <label className="form-field"><span className="field-label">پایان شیفت</span><span className="field-control"><input value={end} onChange={(event) => setEnd(event.target.value)} dir="ltr" placeholder="۲۰:۰۰" /></span></label>
          </div>
          <div className="shift-toggle-list">
            <span><Icon name="calendar" size={15} /> روزهای کاری: شنبه تا پنجشنبه</span>
            <span><Icon name="bell" size={15} /> اعلان بار جدید: فعال</span>
          </div>
        </section>
      </div>

      <section className="panel-card readiness-performance">
        <SectionTitle title="عملکرد این هفته" caption="آمار پذیرش بار در شیفت‌های فعال" />
        <div className="performance-stats">
          <span><strong>۲۸</strong><small>بار پیشنهادی</small></span>
          <span><strong>۱۹</strong><small>تأییدشده</small></span>
          <span><strong>۶۸٪</strong><small>نرخ تأیید</small></span>
          <span><strong>۴٫۸</strong><small>امتیاز</small></span>
        </div>
        <ul className="readiness-rules">
          <li><Icon name="check" size={14} /> با رد کردن سه بار پشت‌سرهم، آمادگی برای ۱۵ دقیقه غیرفعال می‌شود.</li>
          <li><Icon name="check" size={14} /> اگر در ۵ دقیقهٔ اول پاسخ ندهی، بار به امدادگر دیگری پیشنهاد می‌شود.</li>
          <li><Icon name="check" size={14} /> تغییر محدوده بلافاصله روی بارهای جدید اعمال می‌شود.</li>
        </ul>
        <button className="primary-button readiness-save" type="button" onClick={() => onToast(ready ? "تنظیمات شیفت و محدوده ذخیره شد." : "تنظیمات ذخیره شد؛ برای دریافت بار آمادگی را فعال کن.")}>
          ذخیرهٔ تنظیمات <Icon name="check" size={16} />
        </button>
      </section>
    </div>
  );
}

const JOB_STEPS = ["تأیید بار", "شروع مسیر", "رسیدن به مبدأ", "بارگیری", "تحویل بار"];

export function JobView({
  load,
  onBack,
  onToast,
  onComplete,
  onArrive,
  onPartsQuote,
  tracking,
  onOpenChat,
}: {
  load: LoadOffer;
  onBack: () => void;
  onToast: (message: string) => void;
  onComplete: (load: LoadOffer) => Promise<void>;
  onArrive: (load: LoadOffer) => Promise<void>;
  onPartsQuote: () => Promise<void>;
  tracking: Tracking;
  onOpenChat: () => void;
}) {
  const repair = load.service === 'REPAIR';
  const steps = repair ? ['پذیرش امداد', 'شروع مسیر', 'رسیدن به مبدأ', 'انجام عملیات', 'انجام و پرداخت شد'] : JOB_STEPS;
  const [partsAmount, setPartsAmount] = useState("");
  const [confirmingCommission, setConfirmingCommission] = useState(false);
  const [partsBusy, setPartsBusy] = useState(false);
  const [step, setStep] = useState(load.status === "done" ? 4 : load.operationsStartedAt ? 3 : load.serverStatus === "ARRIVED" ? 2 : 1);

  const [busy, setBusy] = useState(false);
  async function advance() {
    if (busy || load.status === "done") return;
    setBusy(true);
    try {
      if (repair && load.serverStatus === 'ARRIVED') {
        if (!load.operationsStartedAt) { await api(`/requests/${load.id}/operations/start`, { method: 'POST' }); await onPartsQuote(); setStep(3); return; }
        await onComplete(load); setStep(4); return;
      }
      if (step >= 3) { await onComplete(load); setStep(4); return; }
      if (step === 1 && load.serverStatus !== "ARRIVED") await onArrive(load);
      setStep(current => current + 1);
      onToast(`وضعیت مأموریت به «${steps[step + 1]}» تغییر کرد.`);
    } catch (error) { onToast(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return (
    <div className="subpage">
      <PageTitle
        title={repair ? "عملیات امداد خودرو" : load.status === "done" ? "جزئیات بار تحویل‌شده" : "بار در حال انجام"}
        subtitle={`${load.from} به ${load.to} · ${load.customer}`}
        onBack={onBack}
        action={<span className={`job-status ${load.status === "done" ? "is-done" : "is-active"}`}><i />{load.status === "done" ? "تحویل شد" : "در مسیر"}</span>}
      />

      <div className="job-layout">
        <section className="panel-card job-card">
          <div className="job-customer">
            <span className="job-avatar">{load.customer.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
            <div>
              <strong>{load.customer}</strong>
              <small><Icon name="shield" size={12} /> {load.role} · ★ {load.rating.toLocaleString("fa-IR")}</small>
            </div>
            <div className="job-contact">
              <button type="button" onClick={() => onToast("تماس با مشتری هنوز در سرور فعال نشده است.")} aria-label="تماس با مشتری"><Icon name="phone" size={17} /></button>
              <button type="button" onClick={onOpenChat} aria-label="گفت‌وگو"><Icon name="chat" size={17} /></button>
            </div>
          </div>

          <div className="job-route">
            <div className="job-route-stop">
              <span className="route-dot route-dot--from" />
              <div><small>مبدأ بارگیری</small><strong>{load.from}</strong><span>پلاک {load.plate}</span></div>
            </div>
            <span className="job-route-line"><i /><Icon name="arrow-left" size={13} /></span>
            <div className="job-route-stop">
              <span className="route-dot route-dot--to" />
              <div><small>مقصد تحویل</small><strong>{load.to}</strong><span>{load.distanceKm.toLocaleString("fa-IR")} کیلومتر · {load.when}</span></div>
            </div>
          </div>

          <div className="job-facts">
            <span><Icon name="car" size={14} /> {load.car}</span>
            <span><Icon name="briefcase" size={14} /> {load.weight}</span>
            <span><Icon name="wallet" size={14} /> {load.priceKnown === false ? "تعیین نشده" : formatToman(load.price)}</span>
          </div>

          <p className="job-note"><Icon name="chat" size={14} /> {load.note}</p>
          {load.service === "REPAIR" && ["ARRIVED", "COMPLETED"].includes(load.serverStatus || "") && <section className="parts-quote-panel"><h3>هزینه قطعات پس از بررسی</h3><p>مبلغ قطعات را به تومان ثبت کنید؛ اگر قطعه‌ای مصرف نشده، صفر وارد کنید. مشتری باید مبلغ را تأیید کند. کمیسیون ۳۰٪ از مجموع خدمت و قطعات محاسبه می‌شود.</p><form onSubmit={async event => { event.preventDefault(); if (partsBusy) return; setPartsBusy(true); try { await api(`/requests/${load.id}/parts-quote`, { method: "POST", body: { amountToman: Number(latinDigits(partsAmount).replace(/[,٬]/g, "")) } }); await onPartsQuote(); onToast("هزینه قطعات برای تأیید مشتری ثبت شد."); } catch (error) { onToast(errorMessage(error)); } finally { setPartsBusy(false); } }}><label className="form-field"><span className="field-label">مبلغ قطعات (تومان)</span><span className="field-control"><input value={partsAmount} onChange={event => { const digits = latinDigits(event.target.value).replace(/\D/g, "").slice(0, 10); setPartsAmount(digits ? Number(digits).toLocaleString("en-US") : ""); }} inputMode="numeric" required /></span></label><button className="primary-button" type="submit" disabled={partsBusy}>ثبت هزینه قطعه</button></form>{load.partsQuoteToman != null && <p>قطعات: {load.partsQuoteToman.toLocaleString("fa-IR")} تومان · {load.partsApprovedToman == null ? "منتظر تأیید مشتری" : "تأییدشده توسط مشتری"}</p>}</section>}

          {repair && load.operationsStartedAt && <section className="parts-quote-panel"><label className="commission-confirm"><input type="checkbox" checked={confirmingCommission || !!load.driverCommissionConfirmedAt} disabled={confirmingCommission || !!load.driverCommissionConfirmedAt || load.status === 'done'} onChange={async event => { if (!event.target.checked || confirmingCommission) return; setConfirmingCommission(true); try { await api(`/requests/${load.id}/commission-confirm`, { method: 'POST', body: { confirmed: true } }); await onPartsQuote(); onToast('تأیید دریافت کمیسیون ثبت شد.'); } catch (error) { onToast(errorMessage(error)); } finally { setConfirmingCommission(false); } }}/><span>کمیسیون به من پرداخت کرد</span></label><p>{confirmingCommission ? 'در حال ثبت تأیید…' : load.driverCommissionConfirmedAt ? 'تأیید شما ثبت شده است؛ می‌توانید پایان مأموریت را بزنید.' : 'پس از دریافت وجه، این گزینه را تأیید کنید تا پایان مأموریت فعال شود.'}</p></section>}
          {repair && load.partsQuoteToman == null && load.serverStatus === 'ARRIVED' && <p>برای شروع عملیات، ابتدا هزینه قطعات را ثبت کنید.</p>}
          <div className="job-actions">
            <button className="primary-button" type="button" onClick={advance} disabled={busy || load.status === "done" || (repair && load.serverStatus === "ARRIVED" && (load.partsApprovedToman == null || (!!load.operationsStartedAt && !load.driverCommissionConfirmedAt)))}>
              <Icon name={step >= 4 ? "check" : "navigation"} size={16} />
              {repair ? load.status === "done" ? "انجام و پرداخت شد" : load.serverStatus === "ARRIVED" ? load.operationsStartedAt ? "انجام و پرداخت شد" : "انجام عملیات" : steps[step + 1] : load.status === "done" ? "بار تکمیل شده است" : step >= 4 ? "پایان بار" : steps[step + 1]}
            </button>
            <button className="load-reject" type="button" onClick={() => onToast("برای لغو بار با پشتیبانی ناوگان تماس بگیر.")}><Icon name="phone" size={15} /> پشتیبانی</button>
          </div>
        </section>

        <div className="job-side">
          <div className="map-frame job-map">
            <div className="map-frame-head">
              <span className="map-frame-badge"><Icon name="pin" size={15} /></span>
              <div className="map-frame-titles">
                <strong>نقطهٔ بارگیری</strong>
                <small>{load.from}</small>
              </div>
              <span className="map-frame-tag"><Icon name="route" size={12} /> {tracking.distanceToOriginMeters === undefined ? "—" : (tracking.distanceToOriginMeters / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} کیلومتر تا مبدأ</span>
            </div>
            <div className="waiting-map"><UserPinMap lat={load.lat} lng={load.lng} driver={tracking.driver} /></div>
            <div className="map-frame-foot">
              <span><Icon name="shield" size={12} /> بار تأییدشدهٔ ناوگان</span>
              <span><Icon name="clock" size={12} /> حداکثر ۲ ساعت</span>
            </div>
          </div>

          <section className="panel-card job-timeline">
            <SectionTitle title="مراحل بار" caption="پیشرفت این مأموریت" />
            <ol>
              {steps.map((label, index) => (
                <li key={label} className={index <= step ? "is-done" : index === step + 1 ? "is-next" : ""}>
                  <span>{index <= step ? <Icon name="check" size={12} /> : index + 1}</span>
                  <div><strong>{label}</strong>{index <= step && <small>ثبت شد</small>}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

export function MaintenanceView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [logs, setLogs] = useState(serviceLogs);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [km, setKm] = useState("");

  function addLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setLogs((current) => [
      { id: `log-${Date.now()}`, title: title.trim(), date: "امروز", km: km.trim() || "—", cost: "—", art: "oil", tone: "green" },
      ...current,
    ]);
    setTitle("");
    setKm("");
    setAdding(false);
    onToast("سرویس جدید در پروندهٔ خودرو ثبت شد.");
  }

  return (
    <div className="subpage">
      <PageTitle
        title="آخرین سرویس‌های من"
        subtitle="پروندهٔ نگهداری خودروی امدادی و یادآور سرویس بعدی"
        onBack={onBack}
        action={<button className="primary-button compact-button" type="button" onClick={() => setAdding((current) => !current)}><Icon name="plus" size={15} /> ثبت سرویس</button>}
      />

      <div className="maintenance-grid">
        <section className="panel-card maintenance-next">
          <span className="panel-eyebrow">سرویس بعدی</span>
          <h2>تعویض روغن و فیلتر</h2>
          <p>تا سرویس بعدی ۱٬۶۰۰ کیلومتر یا ۲۸ روز باقی مانده است.</p>
          <div className="maintenance-progress"><span style={{ width: "72%" }} /></div>
          <div className="maintenance-meta">
            <span><Icon name="route" size={13} /> ۱۲۸٬۴۰۰ کیلومتر فعلی</span>
            <span><Icon name="calendar" size={13} /> یادآور: ۲۵ آبان</span>
          </div>
          <button className="primary-button compact-button" type="button" onClick={() => onToast("درخواست سرویس در محل ثبت شد.")}>رزرو سرویس در محل</button>
        </section>
        <section className="panel-card maintenance-reminders">
          <SectionTitle title="یادآورهای فعال" caption="برای خودروی امدادی تو" />
          <div className="reminder-row"><span className="reminder-icon reminder-icon--orange"><Icon name="refresh" size={17} /></span><div><strong>روغن و فیلتر</strong><small>تا ۱٬۶۰۰ کیلومتر دیگر</small></div><span className="status-pill"><i />نزدیک</span></div>
          <div className="reminder-row"><span className="reminder-icon reminder-icon--blue"><Icon name="shield" size={17} /></span><div><strong>بیمهٔ شخص ثالث</strong><small>۴۵ روز تا انقضا</small></div><span className="status-pill status-pill--done"><i />فعال</span></div>
          <div className="reminder-row"><span className="reminder-icon reminder-icon--green"><Icon name="document" size={17} /></span><div><strong>معاینهٔ فنی</strong><small>۹۰ روز اعتبار</small></div><span className="status-pill status-pill--done"><i />معتبر</span></div>
        </section>
      </div>

      {adding && (
        <form className="add-inline-form" onSubmit={addLog}>
          <input autoFocus placeholder="عنوان سرویس، مثلاً تعویض لنت" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <input placeholder="کیلومتر خودرو" inputMode="numeric" value={km} onChange={(event) => setKm(event.target.value)} />
          <button className="primary-button compact-button" type="submit">ثبت</button>
        </form>
      )}

      <section className="panel-card service-history">
        <SectionTitle title="تاریخچهٔ سرویس‌ها" caption="آخرین نگهداری‌های ثبت‌شده" />
        {logs.map((log) => (
          <article className="service-history-row" key={log.id}>
            <span className={`service-history-art service-history-art--${log.tone}`}><ServiceIllustration type={log.art} size="sm" /></span>
            <div><small>سرویس دوره‌ای</small><strong>{log.title}</strong><span><Icon name="calendar" size={12} /> {log.date} · {log.km} کیلومتر</span></div>
            <b>{log.cost}<small> تومان</small></b>
            <button type="button" onClick={() => onToast("فاکتور سرویس در نسخهٔ کامل نمایش داده می‌شود")} aria-label="مشاهدهٔ فاکتور"><Icon name="chevron" size={16} /></button>
          </article>
        ))}
      </section>

      <p className="history-note"><Icon name="sparkles" size={18} /><span>با ثبت هر سرویس، امتیاز نگهداری خودروی تو بالا می‌رود و در قرارداد ناوگان تأثیر دارد.</span></p>
    </div>
  );
}
