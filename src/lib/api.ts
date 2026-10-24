import { io } from "socket.io-client";
import { APP_ROLE } from "./role";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.khodrochare.ir/api/v1").replace(/\/$/, "");
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || new URL(API_BASE_URL).origin;
const SESSION_KEY = `khodrochare_${APP_ROLE.toLowerCase()}_session_v2`;
export type Place = { province?: string; id: string; label: string; city: string; street: string; latitude: number; longitude: number };
export type VehicleModel = { id: string; name: string; groupId: string; group: { id: string; title: string; nissanBaseToman: number | null; nissanPerKmToman: number | null; flatbedBaseToman: number | null; flatbedPerKmToman: number | null } };
export type Payment = { id: string; status: "AWAITING_TRANSFER" | "SUBMITTED" | "VERIFIED" | "REJECTED"; cardNumber: string; accountName: string; serviceToman: number; partsToman: number; amountToman: number; commissionPercent: number; commissionToman: number; driverShareToman: number; attempts: { bankReference: string; status: string; reviewNote?: string }[] };
export type ServiceCode = "REPAIR" | "TOWING" | "MOBILE_CARWASH" | "PERIODIC_SERVICE" | "INSPECTION";
export type Vehicle = { id: string; name: string; plate: string };
export type User = { id: string; role: "CUSTOMER" | "DRIVER"; fullName: string; phone: string; nationalId: string; vehiclePlate?: string; vehicleType?: string; services: ServiceCode[]; identityDocumentId?: string; vehicles?: Vehicle[] };
export type Session = { token: string; expiresAt: string; user: User };
export type PricingBreakdown = { service: ServiceCode; baseToman: number | null; perKmToman?: number | null; distanceChargeToman?: number | null; surchargePercent?: number; totalToman: number | null; requiresAgreement: boolean; partsPricing?: string; vehicleGroup?: string; transportKind?: string };
export type AssistanceRequest = { operationsStartedAt?: string | null; payment?: { status: Payment["status"] } | null; id: string; customerId: string; driverId: string | null; service: ServiceCode; status: "PENDING" | "ACCEPTED" | "ARRIVED" | "COMPLETED" | "CANCELLED"; vehicleName: string; vehiclePlate: string; originAddress?: string | null; destinationAddress?: string | null; partsQuoteToman?: number | null; partsQuoteVersion?: number; partsApprovedToman?: number | null; problem: string | null; originLat: number; originLng: number; destinationLat: number | null; destinationLng: number | null; distanceMeters: number | null; distanceMethod: string | null; priceToman: number | null; pricingBreakdown?: PricingBreakdown | null; createdAt: string; updatedAt: string };
export type Tracking = { driver: { latitude: number; longitude: number; recordedAt: string } | null; stale?: boolean; distanceToOriginMeters?: number; distanceMethod?: string };
export type DocumentRef = { id: string; token: string };

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export const latinDigits = (v: string) => v.replace(/[۰-۹٠-٩]/g, d => String("۰۱۲۳۴۵۶۷۸۹".includes(d) ? "۰۱۲۳۴۵۶۷۸۹".indexOf(d) : "٠١٢٣٤٥٦٧٨٩".indexOf(d)));
export function normalizePhone(v: string) {
  const digits = latinDigits(v).replace(/\D/g, "");
  if (digits.startsWith("0098")) return `0${digits.slice(4)}`;
  if (digits.startsWith("98")) return `0${digits.slice(2)}`;
  return digits.length === 10 && digits.startsWith("9") ? `0${digits}` : digits;
}
export function validNationalId(v: string) {
  const code = latinDigits(v);
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false;
  const remainder = [...code.slice(0, 9)].reduce((n, d, i) => n + Number(d) * (10 - i), 0) % 11;
  return Number(code[9]) === (remainder < 2 ? remainder : 11 - remainder);
}
export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(SESSION_KEY);
    storage.removeItem("khodrochare_session_v1");
    storage.removeItem("khodrochare_users_v1");
  }
}
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (session.user?.role !== APP_ROLE || !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now()) return null;
    return session;
  } catch { return null; }
}
export function saveSession(session: Session, remember: boolean) {
  if (session.user.role !== APP_ROLE) throw new ApiError("نوع حساب برای این اپلیکیشن معتبر نیست.", 403);
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
}
export function updateSessionUser(user: User) {
  const session = getSession();
  if (session) saveSession({ ...session, user }, !!localStorage.getItem(SESSION_KEY));
}
function serverMessage(status: number, data: { error?: string; issues?: { path: (string | number)[] }[] }) {
  if (status === 400 && data.issues?.length) {
    const fields: Record<string, string> = { fullName: "نام و نام خانوادگی", phone: "شماره تماس", password: "رمز عبور (حداقل ۸ کاراکتر)", nationalId: "کد ملی", vehiclePlate: "پلاک خودرو", origin: "مبدأ", destination: "مقصد", problem: "مشکل خودرو", services: "خدمات", identityDocument: "مدرک هویتی" };
    return `اطلاعات ${fields[String(data.issues[0].path[0])] || "فرم"} معتبر نیست.`;
  }
  const known: Record<string, string> = {
    "Approved parts quote required before operations": "ابتدا هزینه قطعات باید ثبت و توسط مشتری تأیید شود.",
    "Operations and verified payment required before completion": "ابتدا عملیات را شروع کنید و منتظر تأیید واریز بمانید.",
    "Address search unavailable": "جست‌وجوی آدرس موقتاً در دسترس نیست؛ دوباره تلاش کنید.",
    "Address selection expired; search again": "اعتبار آدرس انتخاب‌شده تمام شده؛ دوباره جست‌وجو کنید.",
    "Vehicle model not found": "مدل خودرو پیدا نشد؛ دوباره از فهرست انتخاب کنید.",
    "Parts quote must be approved before payment": "ابتدا امدادگر باید هزینه قطعات را پس از بررسی ثبت کند و شما آن را تأیید کنید.",
    "Final service amount requires agreement": "ابتدا مبلغ نهایی خدمت باید مشخص و توافق شود.",
    "Bank reference already used": "این شماره پیگیری قبلاً ثبت شده است.",
    "Contact support for payment refund before cancellation": "واریز شما ثبت شده است؛ برای لغو و پیگیری وجه با پشتیبانی تماس بگیرید.",
    "Parts quote requires inspection": "ثبت هزینه قطعات پس از رسیدن امدادگر و بررسی خودرو مجاز است.",
    "Parts quote changed; reload": "هزینه قطعات تغییر کرده؛ مبلغ جدید را بررسی کنید.",
    "Payment amount is already locked": "اطلاعات پرداخت صادر شده و تغییر مبلغ ممکن نیست؛ با پشتیبانی تماس بگیرید.",
    "Invalid phone or password": "شماره تماس یا رمز عبور درست نیست.",
    "Phone or national ID already registered for this role": "شماره تماس یا کد ملی قبلاً برای این نقش ثبت شده است.",
    "Request unavailable or unsupported service": "درخواست دیگر قابل پذیرش نیست یا با خدمات شما مطابقت ندارد.",
    "Driver already has an active request": "شما یک مأموریت فعال دارید.",
    "Send a fresh GPS location before accepting": "ابتدا موقعیت فعلی را با اجازه دسترسی به GPS ارسال کنید.",
    "Routing service unavailable or no drivable route": "محاسبه مسیر ممکن نشد؛ مبدأ و مقصد را بررسی و دوباره تلاش کنید.",
    "Invalid status transition": "تغییر وضعیت در این مرحله مجاز نیست.",
    "GPS timestamp is stale or in the future": "موقعیت قدیمی است؛ ساعت دستگاه و دسترسی GPS را بررسی کنید.",
  };
  if (data.error && known[data.error]) return known[data.error];
  return ({ 400: "اطلاعات ارسالی معتبر نیست.", 401: "نشست شما پایان یافته است؛ دوباره وارد شوید.", 403: "دسترسی به این عملیات مجاز نیست.", 404: "اطلاعات موردنظر پیدا نشد.", 409: "اطلاعات تغییر کرده است؛ دوباره بررسی کنید.", 429: "درخواست‌های زیادی ارسال شده؛ کمی صبر کنید.", 503: "سرویس موقتاً در دسترس نیست؛ دوباره تلاش کنید." } as Record<number, string>)[status] || "ارتباط با سرور با خطا روبه‌رو شد.";
}
export async function api<T>(route: string, options: { method?: string; body?: unknown; auth?: boolean; signal?: AbortSignal; responseType?: "blob" } = {}): Promise<T> {
  const { auth = true, method = "GET", body, signal } = options;
  const session = auth ? getSession() : null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_BASE_URL}${route}`, { method, cache: "no-store", credentials: "include", headers: { "X-App-Role": APP_ROLE, "X-Session-Persistence": localStorage.getItem(SESSION_KEY) ? "persistent" : session ? "browser" : "persistent", ...(body instanceof FormData ? {} : body === undefined ? {} : { "Content-Type": "application/json" }), ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}) }, body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body), signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal });
    const data = response.status === 204 ? undefined : response.ok && options.responseType === "blob" ? await response.blob() : await response.json();
    if (!response.ok) {
      if (response.status === 401 && auth && getSession()?.token === session?.token) {
        clearSession();
        window.dispatchEvent(new Event("khodrochare:unauthorized"));
      }
      throw new ApiError(serverMessage(response.status, data || {}), response.status);
    }
    if (auth && response.ok) {
      const expiresAt = response.headers.get("X-Session-Expires-At");
      if (route === "/me" && data?.role === APP_ROLE) {
        saveSession({ token: session?.token || "", user: data, expiresAt: expiresAt || session?.expiresAt || new Date(Date.now() + 90 * 86400000).toISOString() }, !session || !!localStorage.getItem(SESSION_KEY));
      } else if (session && expiresAt) saveSession({ ...session, expiresAt }, !!localStorage.getItem(SESSION_KEY));
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError || signal?.aborted) throw error;
    throw new ApiError(controller.signal.aborted ? "زمان اتصال به سرور تمام شد؛ وضعیت درخواست را پیش از ارسال مجدد بررسی کنید." : "اتصال به سرور برقرار نشد؛ اینترنت خود را بررسی کنید.", 0);
  } finally { clearTimeout(timeout); }
}
export function login(phone: string, password: string, remember = true) {
  return api<Session>(`/auth/${APP_ROLE === "CUSTOMER" ? "customers" : "drivers"}/login`, { method: "POST", auth: false, body: { phone: normalizePhone(phone), password, remember } });
}
export function register(body: unknown) {
  return api<Session>(`/auth/${APP_ROLE === "CUSTOMER" ? "customers" : "drivers"}/register`, { method: "POST", auth: false, body });
}
export async function uploadDocument(file: File): Promise<DocumentRef> {
  if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) throw new ApiError("مدرک باید تصویر JPG یا PNG با حجم حداکثر ۵ مگابایت باشد.", 400);
  const form = new FormData(); form.append("file", file);
  const { id, token } = await api<DocumentRef>("/documents", { method: "POST", auth: false, body: form });
  return { id, token };
}
export async function logout() {
  try { await api("/auth/logout", { method: "POST" }); } finally { clearSession(); }
}
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : "عملیات انجام نشد؛ دوباره تلاش کنید.";
export const requestStatus = (s: AssistanceRequest["status"]) => ({ PENDING: "در انتظار امدادگر", ACCEPTED: "امدادگر در مسیر شماست", ARRIVED: "امدادگر به مبدأ رسیده است", COMPLETED: "درخواست انجام شد", CANCELLED: "درخواست لغو شد" })[s];
export function openSocket() {
  const socket = io(SOCKET_URL, { autoConnect: false, withCredentials: true, auth: cb => cb({ token: getSession()?.token, role: APP_ROLE }) });
  socket.connect();
  return socket;
}
export function currentPosition(): Promise<{ latitude: number; longitude: number; recordedAt: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("موقعیت‌یابی در این مرورگر در دسترس نیست."));
    navigator.geolocation.getCurrentPosition(p => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, recordedAt: new Date(p.timestamp).toISOString() }), () => reject(new Error("برای پذیرش درخواست، دسترسی موقعیت مکانی را فعال کنید.")), { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
  });
}
