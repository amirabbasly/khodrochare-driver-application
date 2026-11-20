"use client";

import Link from "next/link";
import { IranPlate } from "../IranPlate";
import { BluePickup } from "../BluePickup";
import "../account-polish.css";
import { useState } from "react";
import { api, getSession, uploadDocument, updateSessionUser, errorMessage, type User } from "@/lib/api";
import { Icon } from "@/components/Icons";
import { ServiceIllustration } from "@/components/ServiceIllustration";
import {
  Avatar,
  courses,
  IranFlag,
  PageTitle,
  providerServices,
  SectionTitle,
  vehicleSuggestions,
  type DriverSession,
  type View,
} from "@/components/driver/shared";

const faDigits = (value: string) => value.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

export function PlateDisplay({ plate, compact = false }: { plate?: string; compact?: boolean }) {
  const text = plate || "—";
  const match = text.match(/^([0-9۰-۹]{2})\s*([آ-ی])\s*([0-9۰-۹]{3})\s*-?\s*([0-9۰-۹]{2})$/);
  return (
    <span className={`plate-badge${compact ? " plate-badge--compact" : ""}`} dir="ltr" aria-label={`پلاک خودرو ${text}`}>
      <span className="plate-badge-iran"><small>IR</small><IranFlag className="plate-flag" /><b>ایران</b></span>
      <b className="plate-badge-text">{match ? <><span dir="ltr">{match[1]}</span>{" "}<span dir="rtl">{match[2]}</span>{" "}<span dir="ltr">{match[3]}</span>{" - "}<span dir="ltr">{match[4]}</span></> : text}</b>
    </span>
  );
}

export function ProfileView({
  session,
  onSave,
  onBack,
  onToast,
  onNavigate,
}: {
  session: DriverSession;
  onSave: (name: string, phone: string, nationalCode: string) => void;
  onBack: () => void;
  onToast: (message: string) => void;
  onNavigate: (view: View) => void;
}) {
  const name = session.name || "سفیر خودرو چاره";
  const [fullName, setFullName] = useState(name);
  const [phone] = useState(session.phone || session.username || "");
  const [nationalCode] = useState(session.nationalCode || "");

  return (
    <div className="subpage">
      <PageTitle title="پروفایل" subtitle="هویت ناوگان، امتیاز و تنظیمات حساب تو" onBack={onBack} />

      <div className="profile-layout driver-profile-layout">
        <section className="panel-card profile-summary driver-profile-summary">
          <div className="profile-cover">
            <span className="profile-cover-tag"><Icon name="shield" size={12} /> ناوگان امداد</span>
            <span className="profile-cover-orbit" />
          </div>
          <Avatar name={name} size="lg" />
          <h2>{name}</h2>
          <p dir="ltr">{session.phone || session.username || "۰۹۱۲۳۴۵۶۷۸۹"}</p>
          <div className="profile-badges">
            <span className="profile-member"><Icon name="shield" size={13} /> امدادگر خودرو چاره</span>
          </div>
          <Link href="/levels" className="rescuer-membership"><div className="membership-top"><PlateDisplay plate={session.plate} /><BluePickup /></div><strong>امدادگر پایه خودرو چاره <Icon name="chevron" size={16}/></strong><small>آشنایی با مسیر ارتقا به امدادگر ارشد</small></Link>
          <div className="profile-vehicle-chip">
            <span><Icon name="car" size={15} /></span>
            <div><small>خودروی امدادی</small><strong>{session.vehicleType || "یدک‌کش / جرثقیل"}</strong></div>
            <PlateDisplay plate={session.plate} compact />
          </div>
          <div className="profile-services">
            <span className="profile-services-label"><Icon name="briefcase" size={13} /> خدمات قابل ارائه</span>
            <div className="profile-services-chips">
              {(session.services || []).map((id) => {
                const service = providerServices.find((item) => item.id === id);
                return service ? <span key={id}>{service.name}</span> : null;
              })}
            </div>
          </div>
        </section>

        <section className="panel-card profile-edit">
          <div className="panel-heading">
            <span className="profile-edit-icon"><Icon name="user" size={20} /></span>
            <div><h2>اطلاعات شخصی</h2><p>اطلاعات هویتی‌ات را به‌روز نگه دار.</p></div>
          </div>
          <form
            className="profile-form"
            onSubmit={(event) => {
              event.preventDefault();
              onSave(fullName.trim(), phone.trim(), nationalCode.trim());

            }}
          >
            <label className="form-field"><span className="field-label">نام و نام خانوادگی</span><span className="field-control"><input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></span></label>
            <label className="form-field"><span className="field-label">شمارهٔ تماس</span><span className="field-control field-control--ltr"><input type="tel" value={phone} readOnly dir="ltr" /></span></label>
            <label className="form-field"><span className="field-label">کد ملی</span><span className="field-control field-control--ltr"><input inputMode="numeric" value={nationalCode} readOnly placeholder="۱۰ رقم" dir="ltr" /></span></label>
            <p className="account-help">برای اصلاح شماره تماس یا کد ملی با پشتیبانی تماس بگیرید.</p>
            <button className="primary-button" type="submit">ذخیرهٔ تغییرات <Icon name="check" size={16} /></button>
          </form>
        </section>
      </div>

      <section className="panel-card driver-menu-list">
        <button type="button" onClick={() => onNavigate("vehicles")}><span className="settings-icon"><Icon name="car" size={18} /></span><span><strong>خودرو و پلاک من</strong><small>مشخصات خودروی امدادی و مدارک آن</small></span><Icon name="chevron" size={17} /></button>
        <button type="button" onClick={() => onNavigate("documents")}><span className="settings-icon"><Icon name="document" size={18} /></span><span><strong>مدارک و احراز هویت</strong><small>کارت ملی، گواهینامه و بیمه‌نامه</small></span><Icon name="chevron" size={17} /></button>
        <button type="button" onClick={() => onNavigate("training")}><span className="settings-icon"><Icon name="book" size={18} /></span><span><strong>آموزش امداد</strong><small>دوره‌های حرفه‌ای ناوگان</small></span><Icon name="chevron" size={17} /></button>
        <button type="button" onClick={() => onNavigate("maintenance")}><span className="settings-icon"><Icon name="refresh" size={18} /></span><span><strong>آخرین سرویس‌های من</strong><small>پروندهٔ نگهداری خودرو</small></span><Icon name="chevron" size={17} /></button>
        <button type="button" onClick={() => onToast("تنظیمات اعلان‌های ناوگان باز شد")}><span className="settings-icon"><Icon name="bell" size={18} /></span><span><strong>تنظیمات اعلان‌ها</strong><small>بار جدید، یادآور و پیام‌ها</small></span><Icon name="chevron" size={17} /></button>
        <button type="button" onClick={() => onToast("تنظیمات امنیتی در نسخهٔ کامل فعال می‌شود")}><span className="settings-icon"><Icon name="shield" size={18} /></span><span><strong>امنیت حساب</strong><small>رمز عبور و ورود دومرحله‌ای</small></span><Icon name="chevron" size={17} /></button>
      </section>
    </div>
  );
}

export function VehicleView({
  session,
  onSave,
  onBack,
  onToast,
}: {
  session: DriverSession;
  onSave: (vehicleType: string, plate: string, model: string) => void;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [vehicleType, setVehicleType] = useState(session.vehicleType || "یدک‌کش / جرثقیل");
  const [plate, setPlate] = useState(session.plate || "۱۲ ب ۳۴۵ - ۶۷");
  const [model, setModel] = useState(session.vehicleModel || "ایویکو یدک‌کش");
  const [editing, setEditing] = useState(false);

  return (
    <div className="subpage">
      <PageTitle
        title="خودرو و پلاک من"
        subtitle="مشخصات خودروی امدادی ثبت‌شده در ناوگان"
        onBack={onBack}
        action={<button className="primary-button compact-button" type="button" onClick={() => setEditing((current) => !current)}><Icon name="edit" size={15} /> ویرایش</button>}
      />

      <section className="vehicle-card">
        <span className="vehicle-card-glow" aria-hidden="true" />
        <div className="vehicle-card-head">
          <span className="vehicle-card-icon"><Icon name="car" size={26} /></span>
          <div><small>خودروی اصلی ناوگان</small><strong>{model}</strong><span>{vehicleType}</span></div>
          <span className="vehicle-verified"><Icon name="shield" size={13} /> تأییدشده</span>
        </div>
        <PlateDisplay plate={plate} />
        <div className="vehicle-card-stats">
          <span><small>بیمهٔ شخص ثالث</small><strong>۱۲۰ روز</strong></span>
          <span><small>معاینهٔ فنی</small><strong>۹۰ روز</strong></span>
          <span><small>کارت سوخت</small><strong>فعال</strong></span>
        </div>
      </section>

      {editing && (
        <form
          className="panel-card vehicle-edit"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(vehicleType, plate, model);
            setEditing(false);

          }}
        >
          <SectionTitle title="ویرایش خودرو" caption="تغییرات بلافاصله در پروفایل ناوگان اعمال می‌شود." />
          <div className="vehicle-edit-grid">
            <label className="form-field">
              <span className="field-label">نوع خودرو</span>
              <span className="field-control">
                <input list="vehicle-suggestions-edit" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} placeholder="مثلاً نیسان آبی" />
                <Icon name="car" size={15} />
              </span>
              <datalist id="vehicle-suggestions-edit">
                {vehicleSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
              </datalist>
            </label>
            <label className="form-field"><span className="field-label">مدل خودرو</span><span className="field-control"><input value={model} onChange={(event) => setModel(event.target.value)} placeholder="مثلاً ایویکو یدک‌کش" /></span></label>
            <IranPlate value={plate} onChange={setPlate} />
          </div>
          <button className="primary-button" type="submit">ذخیرهٔ خودرو <Icon name="check" size={16} /></button>
        </form>
      )}

      <div className="vehicle-docs-grid">
        <section className="panel-card vehicle-doc">
          <span className="vehicle-doc-icon"><Icon name="shield" size={20} /></span>
          <div><strong>بیمه‌نامهٔ ناوگان</strong><small>معتبر تا ۱۴ اسفند ۱۴۰۴</small></div>
          <button type="button" onClick={() => onToast("فایل بیمه‌نامه نمایش داده می‌شود")}><Icon name="eye" size={16} /></button>
        </section>
        <section className="panel-card vehicle-doc">
          <span className="vehicle-doc-icon vehicle-doc-icon--blue"><Icon name="document" size={20} /></span>
          <div><strong>کارت سوخت</strong><small>متصل به پلاک ناوگان</small></div>
          <button type="button" onClick={() => onToast("اطلاعات کارت سوخت نمایش داده می‌شود")}><Icon name="eye" size={16} /></button>
        </section>
        <section className="panel-card vehicle-doc">
          <span className="vehicle-doc-icon vehicle-doc-icon--green"><Icon name="calendar" size={20} /></span>
          <div><strong>معاینهٔ فنی</strong><small>اعتبار تا ۲۲ آذر ۱۴۰۴</small></div>
          <button type="button" onClick={() => onToast("گواهی معاینهٔ فنی نمایش داده می‌شود")}><Icon name="eye" size={16} /></button>
        </section>
      </div>

      <p className="history-note"><Icon name="shield" size={18} /><span>برای دریافت بارهای سنگین، بیمهٔ بدنه و معاینهٔ فنی خودرو باید معتبر باشد.</span></p>
    </div>
  );
}

const DOCUMENTS = [
  { id: "national", title: "کارت ملی / شناسنامه", note: "ثبت‌شده هنگام ثبت‌نام", icon: "document" as const, ready: true },
  { id: "license", title: "گواهینامه پایه یک", note: "برای حمل خودرو و بار سنگین", icon: "shield" as const, ready: false },
  { id: "insurance", title: "بیمه‌نامهٔ خودروی امدادی", note: "شخص ثالث و بدنه", icon: "car" as const, ready: true },
  { id: "inspection", title: "گواهی معاینهٔ فنی", note: "اعتبار یک‌ساله", icon: "calendar" as const, ready: false },
];

export function DocumentsView({
  session,
  onBack,
  onToast,
}: {
  session: DriverSession;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [saved, setUploaded] = useState<Record<string, boolean>>({});
  const uploaded: Record<string, boolean> = { ...saved, national: saved.national || !!session.documentName };
  const [busy, setBusy] = useState(false);
  const completed = DOCUMENTS.filter((document) => uploaded[document.id]).length;
  const percent = Math.round((completed / DOCUMENTS.length) * 100);

  async function uploadIdentity(file: File, id: string) {
    if (id !== "national") { onToast("ثبت این نوع مدرک هنوز در سرور فعال نشده است."); return; }
    if (busy) return;
    setBusy(true);
    try {
      const reference = await uploadDocument(file);
      await api("/me/identity-document", { method: "POST", body: reference });
      updateSessionUser(await api<User>("/me"));
      setUploaded(current => ({ ...current, national: true }));
      onToast("مدرک هویتی در سرور ثبت شد.");
    } catch (error) { onToast(errorMessage(error)); }
    finally { setBusy(false); }
  }
  async function downloadIdentity(id: string) {
    const documentId = getSession()?.user.identityDocumentId;
    if (id !== "national" || !documentId) { onToast("مدرکی برای نمایش در سرور ثبت نشده است."); return; }
    try {
      const file = await api<Blob>(`/documents/${documentId}`, { responseType: "blob" });
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "identity-document"; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { onToast(errorMessage(error)); }
  }
  return (
    <div className="subpage">
      <PageTitle title="مدارک و احراز هویت" subtitle="تکمیل مدارک، دریافت بارهای ویژه را فعال می‌کند" onBack={onBack} />

      <section className="doc-progress-card">
        <div className="doc-progress-head">
          <span className="doc-progress-icon"><Icon name="shield" size={24} /></span>
          <div><small>وضعیت احراز هویت ناوگان</small><strong>{faDigits(String(completed))} از {faDigits(String(DOCUMENTS.length))} مدرک ثبت شد</strong></div>
          <b>{percent.toLocaleString("fa-IR")}٪</b>
        </div>
        <div className="doc-progress-bar"><span style={{ width: `${percent}%` }} /></div>
        <p>{percent === 100 ? "همهٔ مدارک ثبت شده‌اند؛ حساب ناوگان تو کامل است." : "برای فعال‌شدن همهٔ بارها، مدارک باقی‌مانده را بارگذاری کن."}</p>
      </section>

      <section className="panel-card document-list">
        <SectionTitle title="مدارک من" caption="تصویر JPG یا PNG مدرک را بارگذاری کن." />
        {DOCUMENTS.map((document) => {
          const isReady = uploaded[document.id];
          return (
            <article className="document-row" key={document.id}>
              <span className={`document-icon${isReady ? " is-ready" : ""}`}><Icon name={document.icon} size={19} /></span>
              <div className="document-copy">
                <strong>{document.title}</strong>
                <small>{document.note}{document.id === "national" && session.documentName ? ` · ${session.documentName}` : ""}</small>
              </div>
              {isReady ? (
                <span className="status-pill status-pill--done"><i />ثبت‌شده</span>
              ) : (
                <label className="document-upload">
                  <input
                    type="file"
                    accept="image/png,image/jpeg" disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (!file) return;
                      void uploadIdentity(file, document.id);
                    }}
                  />
                  <Icon name="upload" size={14} /> بارگذاری
                </label>
              )}
              <button className="row-more" type="button" onClick={() => void downloadIdentity(document.id)} aria-label="گزینه‌های مدرک"><Icon name="more" size={18} /></button>
            </article>
          );
        })}
      </section>

      <div className="doc-privacy"><Icon name="shield" size={18} /><p>تصاویر مدارک فقط برای احراز هویت ناوگان استفاده می‌شوند، رمزنگاری می‌شوند و در اختیار هیچ شخص ثالثی قرار نمی‌گیرند.</p></div>
    </div>
  );
}

export function TrainingView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const completed = courses.filter((course) => course.progress === 100).length;
  const overall = Math.round(courses.reduce((total, course) => total + course.progress, 0) / courses.length);

  return (
    <div className="subpage">
      <PageTitle title="آموزش امداد" subtitle="دوره‌های حرفه‌ای امدادگران و سفیران خودرو چاره" onBack={onBack} />

      <section className="training-hero">
        <div className="training-hero-copy">
          <span className="training-hero-tag"><Icon name="book" size={14} /> آکادمی ناوگان</span>
          <h2>حرفه‌ای‌تر بار بگیر.</h2>
          <p>بارگیری ایمن، کمک‌های اولیه و ارتباط با مشتری؛ دوره‌ها کوتاه و کاربردی‌اند.</p>
          <div className="training-progress">
            <span><b>{faDigits(String(completed))}</b> دورهٔ تکمیل‌شده</span>
            <span><b>{overall.toLocaleString("fa-IR")}٪</b> پیشرفت کلی</span>
          </div>
        </div>
        <div className="training-hero-badge">
          <Icon name="star" size={26} />
          <span>گواهی دیجیتال</span>
          <small>پس از پایان هر دوره</small>
        </div>
      </section>

      <div className="training-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <div className="course-head">
              <span className="course-icon"><Icon name={course.icon} size={21} /></span>
              <span className="course-level">{course.level}</span>
            </div>
            <h3>{course.title}</h3>
            <div className="course-meta"><span><Icon name="clock" size={13} /> {course.duration}</span><span><Icon name="book" size={13} /> ویدیو + آزمون</span></div>
            <div className="course-progress"><span style={{ width: `${course.progress}%` }} /></div>
            <div className="course-foot">
              <small>{course.progress === 100 ? "تکمیل شده" : course.progress === 0 ? "شروع نشده" : `${course.progress.toLocaleString("fa-IR")}٪ پیشرفت`}</small>
              <button type="button" onClick={() => onToast(course.progress === 100 ? `گواهی دورهٔ ${course.title} نمایش داده می‌شود` : `دورهٔ ${course.title} باز شد`)}>
                {course.progress === 100 ? "دیدن گواهی" : course.progress === 0 ? "شروع دوره" : "ادامه"} <Icon name="arrow-left" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="history-note"><Icon name="sparkles" size={18} /><span>تکمیل دوره‌های تخصصی، شانس دریافت بارهای ویژه و امتیاز ناوگان را افزایش می‌دهد.</span></p>
    </div>
  );
}

export function InviteView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  async function copyCode() {
    try {
      await navigator.clipboard.writeText("CHAREH-SAFIR");
      onToast("کد دعوت کپی شد.");
    } catch {
      onToast("کد دعوت شما: CHAREH-SAFIR");
    }
  }

  return (
    <div className="subpage">
      <PageTitle title="دعوت از همکاران" subtitle="با هم، ناوگان قوی‌تری می‌سازیم." onBack={onBack} />
      <section className="invite-hero">
        <div className="invite-text">
          <span className="invite-eyebrow"><Icon name="gift" size={15} /> هدیه‌ای برای تو و همکارت</span>
          <h2>همکارت را دعوت کن،<br /><em>چاره را شریک شو!</em></h2>
          <p>با هر دعوت موفق و تأیید مدرک همکارت، هر دو از اعتبار خرید قطعات و اولویت بار بهره‌مند می‌شوید.</p>
          <div className="invite-code">
            <span><small>کد دعوت اختصاصی تو</small><b dir="ltr">CHAREH-SAFIR</b></span>
            <button type="button" onClick={copyCode}><Icon name="tag" size={17} /> کپی کد</button>
          </div>
          <button className="invite-share" type="button" onClick={() => onToast("لینک دعوت برای اشتراک‌گذاری آماده شد.")}><Icon name="send" size={17} /> دعوت از همکاران</button>
        </div>
        <div className="invite-art">
          <span className="invite-art-circle"><Icon name="users" size={74} /></span>
          <span className="invite-spark invite-spark--one"><Icon name="sparkles" size={17} /></span>
          <span className="invite-spark invite-spark--two"><Icon name="sparkles" size={22} /></span>
          <span className="invite-confetti" />
        </div>
      </section>
      <div className="invite-steps">
        <div><b>۰۱</b><strong>کدت را بفرست</strong><small>کد دعوت را با همکارت به اشتراک بگذار.</small></div>
        <div><b>۰۲</b><strong>همکارت ثبت‌نام کند</strong><small>مدارک و خودرویش را در ناوگان ثبت کند.</small></div>
        <div><b>۰۳</b><strong>پاداش بگیرید</strong><small>اعتبار خرید قطعات برای هر دو فعال می‌شود.</small></div>
      </div>
    </div>
  );
}

export function SupportView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <div className="subpage">
      <PageTitle title="پشتیبانی ناوگان" subtitle="هر سؤالی داری، تیم ناوگان با خوشحالی پاسخ می‌دهد." onBack={onBack} />
      <section className="support-hero">
        <span className="support-orbit"><Icon name="support" size={32} /></span>
        <div><span>همیشه کنار امدادگران</span><h2>چطور می‌توانیم کمکت کنیم؟</h2><p>پاسخ‌گویی ۲۴ ساعته، مخصوص ناوگان امداد و سفیران.</p></div>
        <button type="button" onClick={() => onToast("تماس با پشتیبانی ناوگان: ۰۲۱-۹۱۰۰-۱۲۰۰")}><Icon name="phone" size={17} /> تماس با ما</button>
      </section>
      <div className="support-columns">
        <section className="panel-card faq-panel">
          <SectionTitle title="سؤال‌های پرتکرار" caption="شاید پاسخ سؤالت اینجا باشد." />
          <details><summary>چطور بار آزاد بگیرم؟ <span>+</span></summary><p>آمادگی را فعال کن و در تالار ایرانشهر بارهای آزاد همکاران را ببین؛ با تأیید بار، مأموریت در «بارهای من» ثبت می‌شود.</p></details>
          <details><summary>چرا باری به من نشان داده نمی‌شود؟ <span>+</span></summary><p>اگر آمادگی غیرفعال باشد، اپلیکیشن باری نشان نمی‌دهد. محدودهٔ خدمت و ساعت شیفت را هم بررسی کن.</p></details>
          <details><summary>تسویهٔ بار چطور انجام می‌شود؟ <span>+</span></summary><p>پس از تحویل بار، مبلغ به کیف پول ناوگان اضافه می‌شود و در روزهای تسویه قابل برداشت است.</p></details>
          <details><summary>مدارک لازم برای تأیید ناوگان چیست؟ <span>+</span></summary><p>کارت ملی یا شناسنامه، گواهینامهٔ متناسب با نوع خودرو، بیمه‌نامه و معاینهٔ فنی.</p></details>
        </section>
        <section className="panel-card support-message">
          <div className="support-message-icon"><Icon name="chat" size={22} /></div>
          <h2>پیامت را برای ناوگان بفرست</h2>
          <p>کارشناسان ناوگان در کوتاه‌ترین زمان پاسخ می‌دهند.</p>
          <form onSubmit={(event) => { event.preventDefault(); if (!message.trim()) return; setMessage(""); onToast("پیامت برای پشتیبانی ناوگان ارسال شد."); }}>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="پیامت را اینجا بنویس…" required />
            <button className="primary-button" type="submit">ارسال پیام <Icon name="arrow-left" size={16} /></button>
          </form>
        </section>
      </div>
    </div>
  );
}

export function NotificationsView({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const notices = [
    { title: "بار آزاد جدید در محدودهٔ تو", description: "امیرحسین سعادتی یک بار از سعادت‌آباد به مرزداران ثبت کرده است.", time: "۵ دقیقه پیش", art: "roadside" as const, unread: true },
    { title: "یادآور سرویس روغن", description: "تا سرویس بعدی ۱٬۶۰۰ کیلومتر باقی مانده است.", time: "۱ ساعت پیش", art: "oil" as const, unread: true },
    { title: "بیمه‌نامهٔ ناوگان تمدید شد", description: "بیمهٔ شخص ثالث خودروی امدادی تا اسفند ۱۴۰۴ معتبر است.", time: "دیروز", art: "insurance" as const, unread: false },
    { title: "دورهٔ جدید آکادمی ناوگان", description: "دورهٔ «کمک‌های اولیه در تصادف» برای تو باز شد.", time: "۲ روز پیش", art: "training" as const, unread: false },
  ];

  return (
    <div className="subpage">
      <PageTitle
        title="اعلان‌ها"
        subtitle="بارهای تازه، یادآورها و خبرهای ناوگان"
        onBack={onBack}
        action={<button className="text-link" type="button" onClick={() => onToast("همهٔ اعلان‌ها خوانده شدند.")}>خواندن همه</button>}
      />
      <section className="panel-card notification-list">
        {notices.map((notice) => (
          <article className={`notification-row${notice.unread ? " is-unread" : ""}`} key={notice.title}>
            <ServiceIllustration type={notice.art} size="sm" />
            <div><strong>{notice.title}</strong><p>{notice.description}</p><small><Icon name="clock" size={13} />{notice.time}</small></div>
            {notice.unread && <i className="notification-unread" />}
          </article>
        ))}
      </section>
      <p className="history-note"><Icon name="bell" size={18} /><span>اعلان بارهای جدید فقط وقتی آمادگی‌ات فعال باشد ارسال می‌شود.</span></p>
    </div>
  );
}
