"use client";

import Image from "next/image";
import "./upload-controls.css";
import "./registration-verification.css";
import {DriverAffiliation} from "./DriverAffiliation";
import type {Session} from "@/lib/api";
import { useSessionState } from "@/lib/session";
import "@/components/driver/service-picker.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, clearSession, latinDigits, login, register, saveSession, normalizePhone, uploadDocument, errorMessage } from "@/lib/api";
import { BrandLogo, Icon } from "@/components/Icons";
import { ServiceIllustration } from "@/components/ServiceIllustration";
import { IranFlag, providerServices, vehicleSuggestions } from "@/components/driver/shared";

const PLATE_LETTERS = ["ب", "ج", "د", "س", "ص", "ط", "ع", "ق", "ل", "م", "ن", "و", "ه", "ی"];


function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeNationalCode(value: string) {
  return toLatinDigits(value).replace(/\D/g, "").slice(0, 10);
}

function isValidNationalCode(code: string) {
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false;
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  return (remainder < 2 ? remainder : 11 - remainder) === Number(code[9]);
}

function AuthVisual({ variant = "login" }: { variant?: "login" | "register" }) {
  if (variant === "register") {
    return (
      <aside className="auth-visual auth-visual--driver" aria-label="ناوگان امداد و سفیران خودرو چاره">
        <Image
          src="/slides/driver/hero-ready.jpg"
          alt="امدادگر خودرو چاره کنار ون امداد"
          fill
          sizes="(max-width: 900px) 100vw, 580px"
          priority
          className="auth-driver-photo"
        />
        <span className="auth-driver-veil" aria-hidden="true" />
        <div className="auth-driver-logo">
          <Image
            src="/khodrochare-wordmark.png"
            alt="لوگوی خودرو چاره"
            width={2172}
            height={724}
            sizes="(max-width: 640px) 175px, 215px"
            priority
            className="auth-logo-image"
          />
        </div>
        <div className="auth-driver-copy">
          <span className="auth-kicker auth-kicker--driver"><i className="status-dot" /> عضو ناوگان امداد و سفیران</span>
          <h2>مسیرهای سخت را<br />با هم آسان می‌کنیم.</h2>
          <p>با ثبت خودرو و مدارک، بارهای آزاد ناوگان، تسویهٔ آنی و خدمات ویژهٔ همکاران برایت فعال می‌شود.</p>
          <ul className="auth-driver-points">
            <li><Icon name="check" size={14} /> مشاهدهٔ بارهای اعلام‌شده</li>
            <li><Icon name="check" size={14} /> آمادگی و شیفت دلخواه</li>
            <li><Icon name="check" size={14} /> خرید قطعات با قیمت همکار</li>
          </ul>
        </div>
        <div className="auth-driver-orbit auth-driver-orbit--one" aria-hidden="true" />
        <div className="auth-driver-orbit auth-driver-orbit--two" aria-hidden="true" />
        <span className="auth-driver-credit">امداد ناوگان خودرو چاره · همیشه در راه</span>
      </aside>
    );
  }

  return (
    <aside className="auth-visual" aria-label="پیام خودرو چاره">
      <div className="auth-logo-frame">
        <Image
          src="/khodrochare-wordmark.png"
          alt="لوگوی خودرو چاره"
          width={2172}
          height={724}
          sizes="(max-width: 640px) 262px, 420px"
          priority
          className="auth-logo-image"
        />
      </div>
      <span className="auth-visual-orbit auth-visual-orbit--one" aria-hidden="true" />
      <span className="auth-visual-orbit auth-visual-orbit--two" aria-hidden="true" />
    </aside>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  minLength,
  maxLength,
  ltr = false,
  showToggle = false,
  onToggle,
  visible = false,
  pattern,
  hint,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "search" | "url" | "none" | "decimal";
  minLength?: number;
  maxLength?: number;
  ltr?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  visible?: boolean;
  pattern?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="form-field" htmlFor={name}>
      <span className="field-label">
        {label}
        {!required && <small className="field-optional">اختیاری</small>}
      </span>
      <span className={`field-control${ltr ? " field-control--ltr" : ""}`}>
        <input
          id={name}
          name={name}
          type={showToggle && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          required={required}
          dir={ltr ? "ltr" : "rtl"}
        />
        {showToggle && (
          <button className="field-toggle" type="button" onClick={onToggle} aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}>
            <Icon name={visible ? "eye-off" : "eye"} size={17} />
          </button>
        )}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function PlateField({
  value,
  onChange,
}: {
  value: { two: string; letter: string; three: string; province: string };
  onChange: (next: { two: string; letter: string; three: string; province: string }) => void;
}) {
  const onlyDigits = (raw: string, size: number) =>
    toLatinDigits(raw).replace(/\D/g, "").slice(0, size);

  return (
    <div className="form-field plate-field">
      <span className="field-label">پلاک خودرو</span>
      <div className="plate-shell" dir="ltr">
        <span className="plate-iran" aria-hidden="true">
          <small>IR</small>
          <IranFlag className="plate-flag" />
          <b>ایران</b>
        </span>
        <input
          className="plate-part plate-part--two"
          aria-label="دو رقم پلاک"
          inputMode="numeric"
          autoComplete="off"
          value={value.two}
          onChange={(event) => onChange({ ...value, two: onlyDigits(event.target.value, 2) })}
          placeholder="۱۲"
          maxLength={2}
        />
        <select
          className="plate-letter"
          aria-label="حرف پلاک"
          value={value.letter}
          onChange={(event) => onChange({ ...value, letter: event.target.value })}
        >
          {PLATE_LETTERS.map((letter) => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>
        <input
          className="plate-part plate-part--three"
          aria-label="سه رقم پلاک"
          inputMode="numeric"
          autoComplete="off"
          value={value.three}
          onChange={(event) => onChange({ ...value, three: onlyDigits(event.target.value, 3) })}
          placeholder="۳۴۵"
          maxLength={3}
        />
        <span className="plate-province-wrap" title="کد استان">
          <small>کد استان</small>
          <input
            aria-label="کد استان پلاک"
            inputMode="numeric"
            autoComplete="off"
            value={value.province}
            onChange={(event) => onChange({ ...value, province: onlyDigits(event.target.value, 2) })}
            placeholder="۶۷"
            maxLength={2}
          />
        </span>
      </div>
      <span className="field-hint plate-hint">
        <Icon name="shield" size={12} /> پلاک باید به نام خودت یا ناوگان ثبت‌شده باشد.
      </span>
    </div>
  );
}

function DocumentUpload({
  label="تصویر کارت ملی",
  fileName,
  preview,
  onPick,
  onClear,
}: {
  label?:string;
  fileName: string;
  preview: string;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onPick(file);
  }

  return (
    <div className="form-field">
      <span className="field-label">{label} <b className="field-required">*</b></span>
      <div
        className={`doc-dropzone${dragging ? " is-dragging" : ""}${fileName ? " has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        aria-label={`بارگذاری ${label}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          hidden
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={`پیش‌نمایش ${label}`} className="doc-preview-image" />
            <span className="doc-file-chip">
              <Icon name="check" size={13} />
              <span>{fileName}</span>
            </span>
            <button
              className="doc-clear"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
              aria-label="حذف تصویر"
            >
              <Icon name="close" size={15} />
            </button>
          </>
        ) : fileName ? (
          <>
            <span className="doc-upload-icon"><Icon name="document" size={22} /></span>
            <strong>{fileName}</strong>
            <small>فایل انتخاب شد و برای احراز هویت ارسال می‌شود.</small>
            <span className="doc-file-chip doc-file-chip--inline">
              <Icon name="check" size={13} />
              <span>آمادهٔ ارسال</span>
            </span>
            <button
              className="doc-clear"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
              aria-label="حذف فایل"
            >
              <Icon name="close" size={15} />
            </button>
          </>
        ) : (
          <>
            <span className="doc-upload-icon"><Icon name="upload" size={22} /></span>
            <strong>تصویر مدرک را اینجا رها کن</strong>
            <small>یا برای انتخاب فایل کلیک کن · JPG یا PNG تا ۵ مگابایت</small>
            <span className="doc-upload-cta">انتخاب فایل <Icon name="plus" size={13} /></span>
          </>
        )}
      </div>
      <span className="field-hint">این تصویر فقط برای احراز هویت ناوگان استفاده می‌شود و محرمانه می‌ماند.</span>
    </div>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const {authenticate} = useSessionState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setNotice(""); setBusy(true);
    try {
      const session = await login(username, password, remember);
      saveSession(session, remember);
      authenticate(session.user);
      router.replace("/home");
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page" dir="rtl">
      <div className="auth-layout">
        <section className="auth-form-panel" aria-labelledby="login-heading">
          <div className="auth-mobile-brand"><BrandLogo /></div>
          <div className="auth-heading">
            <span className="auth-kicker auth-kicker--light">خودرو چاره، همیشه کنارته</span>
            <h1 id="login-heading">خوش برگشتی</h1>
            <p>برای ادامه، وارد حساب کاربری‌ات شو.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <Field label="شماره تماس" name="username" value={username} onChange={setUsername} placeholder="۰۹۱۲۳۴۵۶۷۸۹" autoComplete="username" inputMode="tel" minLength={3} maxLength={32} ltr />
            <Field label="رمز عبور" name="password" type="password" value={password} onChange={setPassword} placeholder="رمز عبورت را وارد کن" autoComplete="current-password" minLength={6} showToggle visible={passwordVisible} onToggle={() => setPasswordVisible((current) => !current)} />
            <div className="form-options">
              <label className="check-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span className="custom-check"><Icon name="check" size={12} /></span><span>مرا به خاطر بسپار</span></label>
              <button type="button" className="auth-inline-link" onClick={() => router.push("/login-otp")}>ورود با کد یک بار مصرف</button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <button className="primary-button auth-submit" type="submit" disabled={busy} aria-busy={busy}>ورود به حساب <Icon name="arrow-left" size={18} /></button>
          </form>
          <p className="auth-switch"><Link href="/forgot-password">فراموشی رمز عبور</Link></p><p className="auth-switch">حساب کاربری نداری؟ <Link href="/register">ثبت‌نام ناوگان</Link></p>
          <p className="auth-legal">با ورود، <a href="#terms">قوانین و مقررات خودرو چاره</a> را می‌پذیری.</p>
        </section>
        <AuthVisual />
      </div>
    </main>
  );
}

function ExtraDocumentUpload({label,file,onChange}:{label:string;file:File|null;onChange:(file:File|null)=>void}){
 const [preview,setPreview]=useState(''),url=useRef('');
 useEffect(()=>()=>{if(url.current)URL.revokeObjectURL(url.current);},[]);
 function choose(file:File|null){if(url.current)URL.revokeObjectURL(url.current);url.current=file?URL.createObjectURL(file):'';setPreview(url.current);onChange(file);}
 return <DocumentUpload label={label} fileName={file?.name||''} preview={preview} onPick={choose} onClear={()=>choose(null)}/>;
}

export function RegisterScreen() {
  const [registered,setRegistered]=useState<Session|null>(null);
  const router = useRouter();
  const {authenticate} = useSessionState();
  const [challenge, setChallenge] = useState<{challengeId:string;phone:string;retryAt:number}|null>(null);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [codeNotice, setCodeNotice] = useState("");
  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [noDrivingLicense,setNoDrivingLicense]=useState(false);
  const [activityCity,setActivityCity]=useState("");
  const [activityDistrict,setActivityDistrict]=useState("");
  const [plate, setPlate] = useState({ two: "", letter: "ب", three: "", province: "" });
  const [nationalCode, setNationalCode] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState("");
  const [extraDocs,setExtraDocs]=useState<Record<string,File|null>>({birthCertificate:null,drivingLicense:null,vehicleOwnershipDocument:null});
  const [vehicleEvidenceType,setVehicleEvidenceType]=useState('VEHICLE_CARD');
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (docPreview.startsWith("blob:")) URL.revokeObjectURL(docPreview);
    };
  }, [docPreview]);

  function pickDocument(file: File) {
    if (!["image/jpeg", "image/png"].includes(file.type)) { setError("فقط تصویر JPG یا PNG قابل ارسال است."); return; }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم تصویر مدرک نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }
    if (docPreview.startsWith("blob:")) URL.revokeObjectURL(docPreview);
    setError("");
    setDocFile(file);
    setDocPreview(file.type === "application/pdf" ? "" : URL.createObjectURL(file));
  }

  function clearDocument() {
    if (docPreview.startsWith("blob:")) URL.revokeObjectURL(docPreview);
    setDocFile(null);
    setDocPreview("");
  }

  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    if (name.trim().split(/\s+/).filter(Boolean).length < 2) {
      setError("نام و نام خانوادگی را کامل وارد کن.");
      return;
    }
    if (activityCity.trim().length < 2) { setError("شهر محل فعالیت را وارد کنید."); return; }
    if (!vehicleType.trim()) {
      setError("نوع خودرو را وارد کن؛ مثلاً نیسان آبی.");
      return;
    }
    if (services.length === 0) {
      setError("دست‌کم یک خدمت قابل ارائه را انتخاب کن.");
      return;
    }
    if (!/^\d{2}$/.test(plate.province) || !/^\d{2}$/.test(plate.two) || !/^\d{3}$/.test(plate.three)) {
      setError("پلاک خودرو را کامل وارد کن؛ مثلاً ۱۲ ب ۳۴۵ - ۶۷.");
      return;
    }
    if (!isValidNationalCode(nationalCode)) {
      setError("کد ملی واردشده معتبر نیست. ۱۰ رقم کد ملی را بررسی کن.");
      return;
    }
    if (!docFile||(!noDrivingLicense&&!extraDocs.drivingLicense)) {
      setError("شناسنامه یا کارت ملی و گواهینامه را بارگذاری کنید، یا گزینه «گواهینامه ندارم» را بزنید.");
      return;
    }
    const normalizedPhone = normalizePhone(phone);
    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("شماره تماس معتبر وارد کن؛ مانند ۰۹۱۲۳۴۵۶۷۸۹.");
      return;
    }
    if (password.length < 8) {
      setError("رمز عبور باید دست‌کم ۸ کاراکتر باشد.");
      return;
    }

    setBusy(true);
    try {
      if (!challenge || challenge.phone !== normalizedPhone || !/^\d{6}$/.test(latinDigits(code))) throw new Error("کد تأیید شماره همراه را دریافت و وارد کنید.");
      const files=[docFile,...(!noDrivingLicense&&extraDocs.drivingLicense?[extraDocs.drivingLicense]:[]),...(extraDocs.vehicleOwnershipDocument?[extraDocs.vehicleOwnershipDocument]:[])];
      for(const file of files)if(!['image/jpeg','image/png'].includes(file.type)||file.size===0||file.size>5*1024*1024)throw new Error('هر مدرک باید تصویر JPG یا PNG و حداکثر ۵ مگابایت باشد.');
      const identityDocument=await uploadDocument(docFile);
      const drivingLicense=!noDrivingLicense&&extraDocs.drivingLicense?await uploadDocument(extraDocs.drivingLicense):undefined;
      const vehicleOwnershipDocument=extraDocs.vehicleOwnershipDocument?await uploadDocument(extraDocs.vehicleOwnershipDocument):undefined;
      const codes: Record<string, string> = { repair: "REPAIR", transport: "TOWING", carwash: "MOBILE_CARWASH", maintenance: "PERIODIC_SERVICE", inspection: "INSPECTION" };
      const session = await register({ activityCity:activityCity.trim(),activityDistrict:activityDistrict.trim(),challengeId: challenge!.challengeId, code: latinDigits(code), fullName: name.trim(), phone: normalizedPhone, password, nationalId: nationalCode, vehicleType: vehicleType.trim(), vehiclePlate: `${plate.two} ${plate.letter} ${plate.three} - ${plate.province}`, services: services.map(id => codes[id]), identityDocument,noDrivingLicense,drivingLicense,vehicleOwnershipDocument,vehicleEvidenceType });
      saveSession(session, true);
      setRegistered(session);
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  if(registered)return <main className="auth-page" dir="rtl"><DriverAffiliation onDone={()=>{authenticate(registered.user);router.replace("/home");}}/></main>;
  return (
    <main className="auth-page auth-page--register" dir="rtl">
      <div className="auth-layout auth-layout--register">
        <section className="auth-form-panel auth-form-panel--register" aria-labelledby="register-heading">
          <div className="auth-mobile-brand"><BrandLogo /></div>
          <div className="auth-heading auth-heading--register">
            <span className="auth-kicker auth-kicker--light">ثبت‌نام ناوگان امداد و سفیران</span>
            <h1 id="register-heading">به ناوگان بپیوند، <span>بار بگیر!</span></h1>
            <p>مشخصات هویتی و خودرویت را ثبت کن تا بارهای آزاد و خدمات همکاران برایت فعال شود.</p>
          </div>

          <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
            <section className="register-section">
              <div className="register-section-head">
                <span className="register-step">۱</span>
                <div><strong>مشخصات هویتی</strong><small>همان‌طور که در کارت ملی درج شده است.</small></div>
              </div>
              <div className="register-grid">
                <Field label="نام و نام خانوادگی" name="full-name" value={name} onChange={setName} placeholder="مثلاً امیرحسین سعادتی" autoComplete="name" minLength={3} maxLength={60} />
                <Field label="شهر محل فعالیت" name="activity-city" value={activityCity} onChange={setActivityCity} placeholder="مثلاً تهران" autoComplete="address-level2" minLength={2} maxLength={100} />
                <Field label="بخش / منطقه محل فعالیت" name="activity-district" value={activityDistrict} onChange={setActivityDistrict} placeholder="مثلاً بخش مرکزی یا منطقه ۲" maxLength={150} required={false} hint="این اطلاعات فقط در پروفایل نمایش داده می‌شود و روی دریافت بار تأثیری ندارد." />
                <Field label="کد ملی" name="national-code" value={nationalCode} onChange={(value) => setNationalCode(normalizeNationalCode(value))} placeholder="۱۰ رقم کد ملی" inputMode="numeric" minLength={10} maxLength={10} ltr hint="کد ملی ۱۰ رقمی، بدون خط تیره." />
              </div>
            </section>

            <section className="register-section">
              <div className="register-section-head">
                <span className="register-step">۲</span>
                <div><strong>خودروی امداد</strong><small>پلاک و نوع خودرویی که با آن بار می‌گیری.</small></div>
              </div>
              <div className="register-grid">
                <label className="form-field" htmlFor="vehicle-type">
                  <span className="field-label">نوع خودرو</span>
                  <span className="field-control">
                    <input
                      id="vehicle-type"
                      list="vehicle-suggestions"
                      value={vehicleType}
                      onChange={(event) => setVehicleType(event.target.value)}
                      placeholder="مثلاً نیسان آبی"
                      autoComplete="off"
                      maxLength={40}
                    />
                    <Icon name="car" size={15} className="field-control-icon" />
                  </span>
                  <datalist id="vehicle-suggestions">
                    {vehicleSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
                  </datalist>
                  <span className="field-hint">اسم خودرو را تایپ کن؛ از پیشنهادها هم می‌توانی انتخاب کنی.</span>
                </label>
                <PlateField value={plate} onChange={setPlate} />
              </div>
            </section>

            <section className="register-section">
              <div className="register-section-head">
                <span className="register-step">۳</span>
                <div><strong>خدمات قابل ارائه</strong><small>هر خدمتی که می‌دهی را انتخاب کن (چند مورد مجاز است).</small></div>
                <span className="register-picked">{services.length.toLocaleString("fa-IR")} انتخاب</span>
              </div>
              <div className="service-picker" role="group" aria-label="خدمات قابل ارائه">
                {providerServices.map((service) => {
                  const active = services.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`service-picker-item${active ? " is-active" : ""}`}
                      aria-pressed={active}
                      onClick={() => setServices((current) => active
                        ? current.filter((id) => id !== service.id)
                        : [...current, service.id])}
                    >
                      <span className="service-picker-art"><ServiceIllustration type={service.art} size="sm" /></span>
                      <span className="service-picker-copy"><strong>{service.name}</strong><small>{service.note}</small></span>
                      <span className="service-picker-check"><Icon name="check" size={12} /></span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="register-section">
              <div className="register-section-head">
                <span className="register-step">۴</span>
                <div><strong>احراز هویت</strong><small>شناسنامه یا کارت ملی الزامی است؛ مدرک خودرو اختیاری است.</small></div>
              </div>
              <p className="verification-intro">فقط دو مرحلهٔ اصلی؛ مرحلهٔ سوم اختیاری است.</p>
              <div className="verification-required-grid">
                <section className="verification-upload-step" aria-label="مرحله اول احراز هویت">
                  <header><span>۱ از ۲</span><strong>مدرک هویتی</strong></header>
                  <DocumentUpload label="شناسنامه یا کارت ملی" fileName={docFile?.name ?? ""} preview={docPreview} onPick={pickDocument} onClear={clearDocument} />
                </section>
                <section className="verification-upload-step" aria-label="مرحله دوم احراز هویت">
                  <header><span>۲ از ۲</span><strong>وضعیت گواهینامه</strong></header>
                  <label className="license-declaration"><input type="checkbox" checked={noDrivingLicense} onChange={e=>{setNoDrivingLicense(e.target.checked);if(e.target.checked)setExtraDocs(old=>({...old,drivingLicense:null}));}}/>گواهینامه ندارم</label>
                  {!noDrivingLicense?<ExtraDocumentUpload label="گواهینامه" file={extraDocs.drivingLicense} onChange={file=>setExtraDocs(old=>({...old,drivingLicense:file}))}/>:<p className="verification-declared">وضعیت گواهینامه مشخص شد؛ نیازی به بارگذاری نیست.</p>}
                </section>
              </div>
              <details className="verification-optional">
                <summary><span>مرحله ۳ · مدرک خودرو</span><b>اختیاری</b></summary>
                <p>در صورت تمایل، یکی از مدارک خودرو را اضافه کنید.</p>
                <label className="form-field"><span className="field-label">نوع مدرک خودرو</span><select className="vehicle-evidence-select" aria-label="نوع مدرک خودرو" value={vehicleEvidenceType} onChange={e=>setVehicleEvidenceType(e.target.value)}><option value="VEHICLE_CARD">کارت ماشین</option><option value="INSURANCE">بیمه‌نامه</option><option value="TECHNICAL_INSPECTION">گواهی معاینه فنی</option></select></label>
                <ExtraDocumentUpload label="مدرک خودرو" file={extraDocs.vehicleOwnershipDocument} onChange={file=>setExtraDocs(old=>({...old,vehicleOwnershipDocument:file}))}/>
              </details>
            </section>

            <section className="register-section register-section--account">
              <div className="register-section-head">
                <span className="register-step">۵</span>
                <div><strong>اطلاعات ورود</strong><small>با این شماره و رمز، وارد حساب می‌شوی.</small></div>
              </div>
              <div className="register-grid">
                <Field label="شماره تماس" name="phone" type="tel" value={phone} onChange={setPhone} placeholder="۰۹۱۲۳۴۵۶۷۸۹" autoComplete="tel" inputMode="tel" minLength={10} maxLength={16} ltr />
                <Field label="رمز عبور" name="new-password" type="password" value={password} onChange={setPassword} placeholder="حداقل ۸ کاراکتر" autoComplete="new-password" minLength={8} showToggle visible={passwordVisible} onToggle={() => setPasswordVisible((current) => !current)} />
              </div>
              <button type="button" className="auth-inline-link" disabled={sendingCode || busy} onClick={async () => {
                if (sendingCode) return;
                if (challenge && Date.now() < challenge.retryAt) { setError("برای ارسال دوباره یک دقیقه صبر کنید."); return; }
                setSendingCode(true); setError("");
                try { const normalized = normalizePhone(phone); const result = await api<{challengeId:string;retryAfterSeconds:number}>("/auth/drivers/otp/request", {auth:false, method:"POST", body:{phone:normalized,purpose:"REGISTER"}}); setChallenge({challengeId:result.challengeId,phone:normalized,retryAt:Date.now()+result.retryAfterSeconds*1000}); setCode(""); setCodeNotice("کد تأیید ارسال شد و ۵ دقیقه اعتبار دارد."); }
                catch (error) { setError(errorMessage(error)); } finally { setSendingCode(false); }
              }}>{sendingCode ? "در حال ارسال…" : challenge ? "ارسال دوباره کد تأیید" : "دریافت کد فعال‌سازی"}</button>
              {codeNotice && <p role="status">{codeNotice}</p>}
              <Field label="کد فعال‌سازی" name="registration-code" value={code} onChange={v => setCode(latinDigits(v).replace(/\D/g, "").slice(0,6))} placeholder="کد ۶ رقمی" autoComplete="one-time-code" inputMode="numeric" minLength={6} maxLength={6} ltr />
              <label className="check-label register-consent">
                <input type="checkbox" defaultChecked required />
                <span className="custom-check"><Icon name="check" size={12} /></span>
                <span>قوانین ناوگان و <a href="#terms">حریم خصوصی خودرو چاره</a> را می‌پذیرم.</span>
              </label>
            </section>

            {error && <p className="form-error register-error" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit" disabled={busy} aria-busy={busy}>تکمیل ثبت‌نام و ورود <Icon name="arrow-left" size={18} /></button>
          </form>
          <p className="auth-switch">قبلاً ثبت‌نام کرده‌ای؟ <Link href="/">وارد شو</Link></p>
        </section>
        <AuthVisual variant="register" />
      </div>
    </main>
  );
}

export function DriverOtpScreen({ reset = false }: { reset?: boolean }) {
 const router = useRouter(), { authenticate } = useSessionState();
 const [phone,setPhone]=useState(""),[code,setCode]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[challenge,setChallenge]=useState<{challengeId:string;retryAfterSeconds:number}|null>(null),[retryAt,setRetryAt]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState(""),[done,setDone]=useState(false);
 async function send() { if(busy)return; if(Date.now()<retryAt){setError("برای ارسال دوباره یک دقیقه صبر کنید.");return;} setBusy(true);setError("");try{const result=await api<{challengeId:string;retryAfterSeconds:number}>("/auth/drivers/otp/request",{auth:false,method:"POST",body:{phone:normalizePhone(phone),purpose:reset?"RESET_PASSWORD":"LOGIN"}});setChallenge(result);setCode("");setRetryAt(Date.now()+result.retryAfterSeconds*1000);}catch(e){setError(errorMessage(e));}finally{setBusy(false);} }
 async function submit(event:FormEvent){event.preventDefault();if(!challenge){await send();return;}if(busy)return;if(reset&&password!==confirm){setError("رمز عبور و تکرار آن یکسان نیستند.");return;}setBusy(true);setError("");try{if(reset){await api("/auth/drivers/password/reset",{auth:false,method:"POST",body:{challengeId:challenge.challengeId,code:latinDigits(code),password}});clearSession();window.dispatchEvent(new Event("khodrochare:unauthorized"));setPassword("");setConfirm("");setCode("");setDone(true);}else{const session=await api<import("@/lib/api").Session>("/auth/drivers/otp/verify",{auth:false,method:"POST",body:{challengeId:challenge.challengeId,code:latinDigits(code),remember:true}});saveSession(session,true);authenticate(session.user);router.replace("/home");}}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 return <main className="auth-page" dir="rtl"><div className="auth-layout"><section className="auth-form-panel"><h1>{reset?"فراموشی رمز عبور":"ورود با کد فعال‌سازی"}</h1><p>ابتدا باید ثبت‌نام ناوگان را تکمیل کرده باشید.</p>{done?<p role="status">رمز عبور با موفقیت تغییر کرد.</p>:<form className="auth-form" onSubmit={submit}>
 {!challenge?<Field label="شماره همراه" name="otp-phone" value={phone} onChange={setPhone} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="tel" autoComplete="tel" ltr/>:<><p dir="ltr">{normalizePhone(phone)}</p><button type="button" className="auth-inline-link" disabled={busy} onClick={()=>{setChallenge(null);setCode("");setError("");}}>ویرایش شماره</button><Field label="کد فعال‌سازی" name="otp-code" value={code} onChange={v=>setCode(latinDigits(v).replace(/\D/g,"").slice(0,6))} placeholder="کد ۶ رقمی" inputMode="numeric" autoComplete="one-time-code" minLength={6} maxLength={6} ltr/>{reset&&<><Field label="رمز عبور جدید" name="new-password" type="password" value={password} onChange={setPassword} placeholder="حداقل ۸ کاراکتر" minLength={8} autoComplete="new-password"/><Field label="تکرار رمز عبور" name="confirm-password" type="password" value={confirm} onChange={setConfirm} placeholder="تکرار رمز عبور جدید" minLength={8} autoComplete="new-password"/></>}<p>کد تأیید ۵ دقیقه اعتبار دارد.</p><button type="button" className="auth-inline-link" disabled={busy} onClick={()=>void send()}>ارسال دوباره کد</button></>}
 {error&&<p className="form-error" role="alert">{error}</p>}<button className="primary-button auth-submit" disabled={busy} type="submit">{busy?"در حال بررسی…":!challenge?"دریافت کد تأیید":reset?"ذخیره رمز عبور":"تأیید و ورود"}</button></form>}<p className="auth-switch"><Link href="/">ورود با رمز عبور</Link> · <Link href="/register">ثبت‌نام ناوگان</Link></p></section><AuthVisual/></div></main>;
}
