"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BrandLogo, Icon } from "@/components/Icons";

const USERS_KEY = "khodrochare_users_v1";
const SESSION_KEY = "khodrochare_session_v1";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Chareh1404!";

type LocalUser = {
  name: string;
  username: string;
  phone?: string;
  password: string;
};

function normalizePhone(value: string) {
  let digits = value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/\D/g, "");
  if (digits.startsWith("0098")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("98")) digits = `0${digits.slice(2)}`;
  else if (digits.length === 10 && digits.startsWith("9")) digits = `0${digits}`;
  return digits;
}

function readUsers(): LocalUser[] {
  try {
    const value = localStorage.getItem(USERS_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? (parsed as LocalUser[]) : [];
  } catch {
    return [];
  }
}

function AuthVisual() {
  return (
    <aside className="auth-visual" aria-label="پیام خودرو چاره">
      <div className="auth-logo-frame">
        <Image
          src="/khodrochare-3d-logo.webp"
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
}) {
  return (
    <label className="form-field" htmlFor={name}>
      <span className="field-label">{label}</span>
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
          required
          dir={ltr ? "ltr" : "rtl"}
        />
        {showToggle && (
          <button className="field-toggle" type="button" onClick={onToggle} aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}>
            <Icon name={visible ? "eye-off" : "eye"} size={17} />
          </button>
        )}
      </span>
    </label>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const normalizedUsername = username.trim().toLowerCase();

    if (normalizedUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminSession = { name: "مدیر خودرو چاره", username: ADMIN_USERNAME, wallet: "۱۰٬۰۰۰٬۰۰۰", role: "admin" };
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
        localStorage.removeItem(SESSION_KEY);
      }
      router.push("/home");
      return;
    }

    const normalizedPhone = normalizePhone(username);
    const user = readUsers().find((item) => {
      const storedUsername = item.username.trim().toLowerCase();
      const storedPhone = normalizePhone(item.phone || item.username);
      const identifierMatches = storedUsername === normalizedUsername
        || (/^09\d{9}$/.test(normalizedPhone) && storedPhone === normalizedPhone);
      return identifierMatches && item.password === password;
    });
    if (!user) {
      setError("شماره تماس یا رمز عبور درست نیست. اگر حساب نداری، ثبت‌نام کن.");
      return;
    }
    const session = { name: user.name, username: user.username, phone: user.phone || (user.username.startsWith("09") ? user.username : ""), wallet: "۰" };
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.removeItem(SESSION_KEY);
    }
    router.push("/home");
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
              <button type="button" className="auth-inline-link" onClick={() => setNotice("ورود با کد یک بار مصرف به‌زودی فعال می‌شود.")}>ورود با کد یک بار مصرف</button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <button className="primary-button auth-submit" type="submit">ورود به حساب <Icon name="arrow-left" size={18} /></button>
          </form>
          <p className="auth-switch">حساب کاربری نداری؟ <Link href="/register">ثبت‌نام کن</Link></p>
          <p className="auth-legal">با ورود، <a href="#terms">قوانین و مقررات خودرو چاره</a> را می‌پذیری.</p>
        </section>
        <AuthVisual />
      </div>
    </main>
  );
}

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedPhone = normalizePhone(phone);
    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("شماره تماس معتبر وارد کن؛ مانند ۰۹۱۲۳۴۵۶۷۸۹.");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور باید دست‌کم ۶ کاراکتر باشد.");
      return;
    }
    const users = readUsers();
    if (users.some((item) => normalizePhone(item.phone || item.username) === normalizedPhone)) {
      setError("این شماره تماس قبلاً ثبت شده است.");
      return;
    }
    const user: LocalUser = {
      name: name.trim(),
      username: normalizedPhone,
      phone: normalizedPhone,
      password,
    };
    const session = { name: user.name, username: user.username, phone: user.phone, wallet: "۰" };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.removeItem(SESSION_KEY);
    router.push("/home");
  }

  return (
    <main className="auth-page" dir="rtl">
      <div className="auth-layout auth-layout--register">
        <section className="auth-form-panel auth-form-panel--register" aria-labelledby="register-heading">
          <div className="auth-mobile-brand"><BrandLogo /></div>
          <div className="auth-heading">
            <span className="auth-kicker auth-kicker--light">شروع یک تجربهٔ بهتر</span>
            <h1 id="register-heading">حساب بساز، <span>راه بیفت!</span></h1>
            <p>با یک حساب ساده، همهٔ خدمات خودرو چاره در دسترس توست.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <Field label="نام و نام خانوادگی" name="full-name" value={name} onChange={setName} placeholder="مثلاً آرمان رضایی" autoComplete="name" minLength={2} maxLength={50} />
            <Field label="شماره تماس" name="phone" type="tel" value={phone} onChange={setPhone} placeholder="۰۹۱۲۳۴۵۶۷۸۹" autoComplete="tel" inputMode="tel" minLength={10} maxLength={16} ltr />
            <Field label="رمز عبور" name="new-password" type="password" value={password} onChange={setPassword} placeholder="حداقل ۶ کاراکتر" autoComplete="new-password" minLength={6} showToggle visible={passwordVisible} onToggle={() => setPasswordVisible((current) => !current)} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit">ساخت حساب کاربری <Icon name="arrow-left" size={18} /></button>
          </form>
          <p className="auth-switch">قبلاً حساب ساخته‌ای؟ <Link href="/">وارد شو</Link></p>
          <p className="auth-legal">با ساخت حساب، قوانین و حریم خصوصی خودرو چاره را می‌پذیری.</p>
        </section>
        <AuthVisual />
      </div>
    </main>
  );
}
