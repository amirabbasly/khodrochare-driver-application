"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "@/components/Icons";
import type { ArtId } from "@/components/ServiceIllustration";

export type View =
  | "home"
  | "wallet"
  | "shahr"
  | "profile"
  | "loads"
  | "readiness"
  | "job"
  | "parts"
  | "tech"
  | "vehicles"
  | "documents"
  | "training"
  | "maintenance"
  | "invite"
  | "support"
  | "notifications";

export type PartKey = "gearbox" | "engine" | "body" | "electrical";

export type DriverSession = {
  name?: string;
  username?: string;
  phone?: string;
  wallet?: string;
  role?: string;
  vehicleType?: string;
  plate?: string;
  nationalCode?: string;
  documentName?: string;
  vehicleModel?: string;
  services?: string[];
};

export type DriverService = {
  id: ArtId;
  name: string;
  note: string;
  category: "parts" | "tech" | "account";
  partKey?: PartKey;
  description?: string;
};

export type PartCategory = {
  key: PartKey;
  id: ArtId;
  name: string;
  note: string;
  priceFrom: string;
  accent: string;
};

export type LoadOffer = {
  service?: string;
  partsQuoteToman?: number | null;
  partsApprovedToman?: number | null;
  serverStatus?: "PENDING" | "ACCEPTED" | "ARRIVED" | "COMPLETED" | "CANCELLED";
  priceKnown?: boolean;
  id: string;
  customer: string;
  role: string;
  rating: number;
  tone: number;
  car: string;
  plate: string;
  from: string;
  to: string;
  distanceKm: number;
  price: number;
  when: string;
  weight: string;
  note: string;
  phone: string;
  status: "pending" | "active" | "done";
  lat: number;
  lng: number;
};

export type ChatMessage = { from: "me" | "them" | "system"; text: string; time: string };

export type Conversation = {
  id: string;
  name: string;
  role: string;
  tone: number;
  unread: number;
  last: string;
  time: string;
  messages: ChatMessage[];
};

export type DriverPost = {
  id: string;
  author: string;
  role: string;
  tone: number;
  time: string;
  car: string;
  from: string;
  to: string;
  price: number;
  when: string;
  weight: string;
  note: string;
  media?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
};

export type PartProduct = {
  id: string;
  part: PartKey;
  name: string;
  detail: string;
  price: string;
  oldPrice?: string;
  badge: string;
  art: ArtId;
  tone: string;
};

export const vehicleTypes = [
  "یدک‌کش / جرثقیل",
  "ون امداد سیار",
  "خودروی سواری امداد",
  "وانت حمل قطعات",
  "موتورسیکلت امداد",
  "ناوگان سنگین",
];

export const vehicleSuggestions = [
  "نیسان آبی",
  "ایویکو یدک‌کش",
  "بنز اکسور",
  "ون امداد سیار",
  "پژو ۲۰۷",
  "تویوتا کرولا",
  "سمند",
  "دنا پلاس",
  "تارا",
  "پراید",
  "وانت زامیاد",
];

export type ProviderService = {
  id: string;
  name: string;
  art: ArtId;
  note: string;
};

export const providerServices: ProviderService[] = [
  { id: "repair", name: "تعمیر در محل", art: "expert", note: "عیب‌یابی و تعمیر سیار" },
  { id: "transport", name: "حمل خودرو", art: "transport", note: "یدک‌کش و خودروبر" },
  { id: "carwash", name: "کارواش سیار", art: "carwash", note: "شست‌وشو در محل" },
  { id: "inspection", name: "کارشناسی خودرو", art: "inspection", note: "بازرسی فنی و بدنه" },
  { id: "maintenance", name: "سرویس دوره‌ای خودرو در محل", art: "maintenance", note: "روغن، فیلتر و سرویس" },
];

export const partCategories: PartCategory[] = [
  { key: "gearbox", id: "gearbox", name: "گیربکس", note: "گیربکس، کلاچ و انتقال قدرت", priceFrom: "۸٬۵۰۰٬۰۰۰", accent: "orange" },
  { key: "engine", id: "engine", name: "موتور", note: "موتور، سرسیلندر و قطعات فنی", priceFrom: "۳٬۲۰۰٬۰۰۰", accent: "navy" },
  { key: "body", id: "body", name: "بدنه و تزئینات", note: "بدنه، آپشن و لوازم ظاهری", priceFrom: "۴۵۰٬۰۰۰", accent: "mint" },
  { key: "electrical", id: "electrical", name: "برق و باتری", note: "باتری، دینام و روشنایی", priceFrom: "۱٬۸۰۰٬۰۰۰", accent: "blue" },
];

export const moreServices: DriverService[] = [
  {
    id: "insurance",
    name: "بیمهٔ ناوگان",
    note: "استعلام و تمدید",
    category: "tech",
    description: "بیمهٔ شخص ثالث و بدنهٔ خودروی امدادی‌ات را با تعرفهٔ همکاران تمدید کن. کارشناس بیمه تا صدور بیمه‌نامه همراهت است.",
  },
  {
    id: "diagnostic",
    name: "عیب‌یابی هوشمند",
    note: "دیاگ تخصصی خودرو",
    category: "tech",
    description: "با اتصال دستگاه عیب‌یاب، خطاهای موتور و گیربکس را قبل از اعزام بعدی بررسی کن. گزارش کامل در پروفایل خودرو ذخیره می‌شود.",
  },
  {
    id: "inspection",
    name: "بارهای کارشناسی خودرو",
    note: "بازرسی فنی و بدنه",
    category: "tech",
    description: "بارهای کارشناسی خودرو در محل را ببین و بپذیر؛ گزارش کامل شاسی، موتور و بدنه تحویل کارفرما می‌شود.",
  },
  {
    id: "carwash",
    name: "بارهای کارواش سیار",
    note: "شست‌وشو در محل",
    category: "tech",
    description: "بارهای کارواش سیار نزدیک محدودهٔ تو؛ شست‌وشو و نظافت خودرو در محل کارفرما انجام می‌شود.",
  },
  {
    id: "maintenance",
    name: "بارهای سرویس دوره‌ای خودرو در محل",
    note: "روغن، فیلتر و سرویس",
    category: "tech",
    description: "بارهای سرویس دوره‌ای در محل؛ تعویض روغن و فیلتر و سرویس‌های دوره‌ای خودرو در محل کارفرما.",
  },
  {
    id: "reminder",
    name: "یادآور سرویس",
    note: "هیچ‌چیز یادت نره",
    category: "tech",
    description: "بر اساس کیلومتر و تاریخ، سرویس بعدی روغن، لنت و فیلترها را یادآوری می‌کنیم.",
  },
  {
    id: "tripcheck",
    name: "چک قبل از مسیر",
    note: "بازرسی سریع ناوگان",
    category: "tech",
    description: "پیش از مأموریت‌های جاده‌ای، ۱۸ مورد ایمنی خودرو در کمتر از ۱۵ دقیقه بررسی می‌شود.",
  },
  {
    id: "fines",
    name: "جرائم و خلافی",
    note: "استعلام و پرداخت",
    category: "tech",
    description: "خلافی خودرو و ناوگانهات را استعلام کن و یک‌جا پرداخت کن؛ سابقه در گزارش ناوگان ثبت می‌شود.",
  },
  {
    id: "license",
    name: "نمرهٔ گواهینامه",
    note: "وضعیت رانندگی",
    category: "tech",
    description: "نمرهٔ گواهینامه، تخلفات و وضعیت اعتبار آن را ببین. برای رانندگان حرفه‌ای ضروری است.",
  },
  {
    id: "tolls",
    name: "عوارض جاده‌ای",
    note: "پرداخت یک‌جا",
    category: "tech",
    description: "عوارض آزادراه‌ها و طرح ترافیک خودروهای ناوگان را یک‌جا مدیریت کن.",
  },
  {
    id: "equipment",
    name: "تجهیزات امداد",
    note: "ابزار حرفه‌ای",
    category: "tech",
    description: "زنجیر، جک، چراغ هشدار، جعبهٔ کمک‌های اولیه و تجهیزات ایمنی مخصوص امدادگران، با قیمت همکار.",
  },
  {
    id: "expert",
    name: "ارتباط با کارشناس",
    note: "پاسخ تخصصی",
    category: "tech",
    description: "کارشناس فنی خودرو چاره در هر ساعت از شبانه‌روز کنار توست؛ برای عیب‌یابی تلفنی یا هماهنگی اعزام.",
  },
  {
    id: "training",
    name: "آموزش امداد",
    note: "مهارت حرفه‌ای",
    category: "account",
    description: "دوره‌های کوتاه بارگیری ایمن، کمک‌های اولیه و ارتباط با مشتری برای امدادگران و سفیران.",
  },
  {
    id: "fleet",
    name: "قرارداد ناوگان",
    note: "همکاری بلندمدت",
    category: "account",
    description: "اگر چند خودروی امدادی داری، قرارداد ناوگان با تسویهٔ هفتگی، پشتیبانی اختصاصی و تخفیف قطعات را فعال کن.",
  },
];

export const techServices = moreServices.filter((service) =>
  ["insurance", "diagnostic", "inspection", "carwash", "maintenance", "reminder", "tripcheck", "fines", "license", "tolls", "equipment", "fleet", "expert"]
    .includes(service.id),
);

export const seedLoads: LoadOffer[] = [
  {
    id: "load-1",
    customer: "امیرحسین سعادتی",
    role: "سفیر خودرو چاره",
    rating: 4.9,
    tone: 0,
    car: "تویوتا کرولا ۱۴۰۱",
    plate: "۱۲ ب ۳۴۵ - ۶۷",
    from: "سعادت‌آباد",
    to: "مرزداران",
    distanceKm: 12,
    price: 450000,
    when: "امروز · ۱۴:۲۰",
    weight: "حمل سبک",
    note: "خودرو روشن نمی‌شود و نیاز به یدک‌کش دارد. مسیر بدون محدودیت است.",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    status: "pending",
    lat: 35.7865,
    lng: 51.3752,
  },
  {
    id: "load-2",
    customer: "مریم کاظمی",
    role: "امدادگر ناوگان",
    rating: 4.7,
    tone: 1,
    car: "پژو ۲۰۷ پانوراما",
    plate: "۴۵ ج ۲۱۸ - ۱۱",
    from: "ونک",
    to: "پاسداران",
    distanceKm: 8,
    price: 380000,
    when: "امروز · ۱۳:۰۵",
    weight: "حمل سبک",
    note: "پنچری لاستیک جلو؛ خودرو در پارکینگ است و دسترسی آسان دارد.",
    phone: "۰۹۳۵۱۱۱۲۲۳۳",
    status: "pending",
    lat: 35.7575,
    lng: 51.4104,
  },
  {
    id: "load-3",
    customer: "رضا محمدی",
    role: "امدادگر ارشد",
    rating: 4.8,
    tone: 2,
    car: "دنا پلاس توربو",
    plate: "۷۸ ل ۵۶۲ - ۲۱",
    from: "تهرانپارس",
    to: "تجریش",
    distanceKm: 16,
    price: 620000,
    when: "امروز · ۱۱:۴۰",
    weight: "حمل متوسط",
    note: "خودرو پس از تصادف جزئی نیاز به حمل دارد. کلید تحویل مشتری است.",
    phone: "۰۹۱۲۹۸۷۶۵۴۳",
    status: "active",
    lat: 35.7305,
    lng: 51.4835,
  },
  {
    id: "load-4",
    customer: "سعید احمدی",
    role: "سفیر خودرو چاره",
    rating: 4.6,
    tone: 3,
    car: "تارا اتوماتیک ۱۴۰۳",
    plate: "۲۳ ص ۷۴۱ - ۶۸",
    from: "شهرک غرب",
    to: "فرودگاه مهرآباد",
    distanceKm: 22,
    price: 780000,
    when: "دیروز · ۱۸:۳۰",
    weight: "حمل سبک",
    note: "حمل به فرودگاه انجام شد؛ بار سالم تحویل داده شد.",
    phone: "۰۹۱۲۱۱۱۰۰۹۹",
    status: "done",
    lat: 35.735,
    lng: 51.29,
  },
];

export const seedPosts: DriverPost[] = [
  {
    id: "post-1",
    author: "امیرحسین سعادتی",
    role: "سفیر خودرو چاره",
    tone: 0,
    time: "۱۲ دقیقه پیش",
    car: "تویوتا کرولا ۱۴۰۱",
    from: "سعادت‌آباد",
    to: "مرزداران",
    price: 450000,
    when: "امروز · ۱۴:۲۰",
    weight: "حمل سبک",
    note: "بار آزاد دارم؛ خودرو روشن نمی‌شود و نیاز به یدک‌کش دارد. مسیر باز است، هر کسی نزدیک‌تره تأیید کنه.",
    media: "/slides/driver/hero-loads.jpg",
    likes: 24,
    comments: 6,
    shares: 2,
    liked: false,
  },
  {
    id: "post-2",
    author: "مریم کاظمی",
    role: "امدادگر ناوگان",
    tone: 1,
    time: "۴۰ دقیقه پیش",
    car: "پژو ۲۰۷ پانوراما",
    from: "ونک",
    to: "پاسداران",
    price: 380000,
    when: "امروز · ۱۳:۰۵",
    weight: "حمل سبک",
    note: "پنچری لاستیک جلو، خودرو داخل پارکینگ. اگر امدادگر پنچرگیری نزدیکه، هماهنگ کنه.",
    likes: 11,
    comments: 3,
    shares: 1,
    liked: true,
  },
  {
    id: "post-3",
    author: "رضا محمدی",
    role: "امدادگر ارشد",
    tone: 2,
    time: "۲ ساعت پیش",
    car: "دنا پلاس توربو",
    from: "تهرانپارس",
    to: "تجریش",
    price: 620000,
    when: "امروز · ۱۱:۴۰",
    weight: "حمل متوسط",
    note: "بار برگشت خالی از تجریش به شرق تهران دارم؛ اگر کسی بار نزدیک دارد، مسیر را هماهنگ کنیم.",
    media: "/slides/driver/banner-social.jpg",
    likes: 38,
    comments: 12,
    shares: 4,
    liked: false,
  },
  {
    id: "post-4",
    author: "سعید احمدی",
    role: "سفیر خودرو چاره",
    tone: 3,
    time: "دیروز · ۱۹:۱۰",
    car: "تارا اتوماتیک ۱۴۰۳",
    from: "شهرک غرب",
    to: "مهرآباد",
    price: 780000,
    when: "دیروز · ۱۸:۳۰",
    weight: "حمل سبک",
    note: "یک بار سالم به مهرآباد رسید. ممنون از هماهنگی تیم پشتیبانی ناوگان.",
    likes: 52,
    comments: 9,
    shares: 3,
    liked: false,
  },
];

export const seedConversations: Conversation[] = [
  {
    id: "chat-1",
    name: "مریم کاظمی",
    role: "امدادگر ناوگان",
    tone: 1,
    unread: 2,
    last: "بار ونک آزاد شد، می‌تونی بگیری؟",
    time: "۱۰:۲۴",
    messages: [
      { from: "them", text: "سلام، بارِ ونک تا پاسداران هنوز آزاده.", time: "۱۰:۱۸" },
      { from: "me", text: "سلام مریم جان، من نزدیک ونکم. مشخصات بار چیه؟", time: "۱۰:۲۰" },
      { from: "them", text: "پژو ۲۰۷، پنچری جلو، داخل پارکینگ. بار ونک آزاد شد، می‌تونی بگیری؟", time: "۱۰:۲۴" },
    ],
  },
  {
    id: "chat-2",
    name: "پشتیبانی ناوگان",
    role: "خودرو چاره",
    tone: 4,
    unread: 0,
    last: "تسویهٔ بار دیروز به کیف پولت اضافه شد.",
    time: "دیروز",
    messages: [
      { from: "system", text: "تسویهٔ بار «شهرک غرب به مهرآباد» انجام شد.", time: "دیروز · ۲۰:۰۲" },
      { from: "them", text: "تسویهٔ بار دیروز به کیف پولت اضافه شد. ممنون که با ناوگان همراهی.", time: "دیروز · ۲۰:۰۳" },
    ],
  },
  {
    id: "chat-3",
    name: "امیرحسین سعادتی",
    role: "سفیر خودرو چاره",
    tone: 0,
    unread: 0,
    last: "آدرس دقیق رو برات می‌فرستم.",
    time: "دیروز",
    messages: [
      { from: "me", text: "بار کرولا تأیید شد. آدرس دقیق کجاست؟", time: "دیروز · ۱۵:۱۰" },
      { from: "them", text: "آدرس دقیق رو برات می‌فرستم. سعادت‌آباد، خیابان سرو غربی، پلاک ۲۴.", time: "دیروز · ۱۵:۱۲" },
    ],
  },
];

export const partProducts: PartProduct[] = [
  { id: "p1", part: "gearbox", name: "گیربکس دستی پژو ۲۰۷", detail: "اورجینال · ۶ دنده · با ضمانت ۶ ماه", price: "۴۸٬۵۰۰٬۰۰۰", oldPrice: "۵۴٬۰۰۰٬۰۰۰", badge: "قیمت همکار", art: "gearbox", tone: "orange" },
  { id: "p2", part: "gearbox", name: "کیت کلاچ کامل سمند", detail: "دیسک، صفحه و بلبرینگ · OE", price: "۸٬۹۵۰٬۰۰۰", badge: "پرفروش", art: "gearbox", tone: "navy" },
  { id: "p3", part: "gearbox", name: "دیسک و صفحه کلاچ پراید", detail: "مناسب ناوگان سبک · ۶ ماه ضمانت", price: "۳٬۴۵۰٬۰۰۰", badge: "ارسال رایگان", art: "gearbox", tone: "mint" },
  { id: "p4", part: "engine", name: "واشر سرسیلندر تویوتا", detail: "اورجینال ژاپن · مناسب کرولا ۱۴۰۱", price: "۴٬۸۰۰٬۰۰۰", badge: "اصل", art: "engine", tone: "orange" },
  { id: "p5", part: "engine", name: "پمپ روغن موتور ۲۰۷", detail: "اصلی ایساکو · با فیلتر روغن", price: "۷٬۲۰۰٬۰۰۰", oldPrice: "۸٬۱۰۰٬۰۰۰", badge: "تخفیف ۱۱٪", art: "engine", tone: "navy" },
  { id: "p6", part: "engine", name: "کیت تسمه تایم کامل", detail: "تسمه، تسمه‌سفت‌کن و بلبرینگ", price: "۵٬۶۰۰٬۰۰۰", badge: "پیشنهاد فنی", art: "engine", tone: "mint" },
  { id: "p7", part: "body", name: "سپر جلو دنا پلاس", detail: "رنگ‌شده · مطابق رنگ اصلی", price: "۹٬۸۰۰٬۰۰۰", badge: "آمادهٔ ارسال", art: "body", tone: "orange" },
  { id: "p8", part: "body", name: "آینه بغل برقی تارا", detail: "با راهنما و گرم‌کن · جفت", price: "۶٬۳۰۰٬۰۰۰", badge: "اورجینال", art: "body", tone: "navy" },
  { id: "p9", part: "body", name: "چراغ جلوی کامل پژو", detail: "لنز شفاف · ضمانت ۱۲ ماه", price: "۴٬۲۰۰٬۰۰۰", oldPrice: "۴٬۹۰۰٬۰۰۰", badge: "تخفیف", art: "body", tone: "mint" },
  { id: "p10", part: "electrical", name: "باتری ۶۰ آمپر سپاهان", detail: "۱۸ ماه ضمانت تعویض", price: "۳٬۷۵۰٬۰۰۰", badge: "پرفروش", art: "electrical", tone: "orange" },
  { id: "p11", part: "electrical", name: "دینام ۹۰ آمپر سمند", detail: "بازسازی‌شده · با تست عملکرد", price: "۸٬۶۰۰٬۰۰۰", badge: "گارانتی", art: "electrical", tone: "navy" },
  { id: "p12", part: "electrical", name: "کویل جرقه اگزوز", detail: "جفت · مناسب موتور TU5", price: "۲٬۹۰۰٬۰۰۰", oldPrice: "۳٬۳۰۰٬۰۰۰", badge: "تخفیف", art: "electrical", tone: "mint" },
];

export const serviceLogs = [
  { id: "log-1", title: "تعویض روغن و فیلتر", date: "۲۴ مهر ۱۴۰۴", km: "۱۲۸٬۴۰۰", cost: "۱٬۸۵۰٬۰۰۰", art: "oil" as ArtId, tone: "green" },
  { id: "log-2", title: "تعویض لنت ترمز جلو", date: "۹ شهریور ۱۴۰۴", km: "۱۲۴٬۱۰۰", cost: "۲٬۳۰۰٬۰۰۰", art: "maintenance" as ArtId, tone: "orange" },
  { id: "log-3", title: "تنظیم موتور و تعویض شمع", date: "۲۱ مرداد ۱۴۰۴", km: "۱۱۹٬۸۰۰", cost: "۱٬۴۵۰٬۰۰۰", art: "engine" as ArtId, tone: "blue" },
];

export const courses = [
  { id: "course-1", title: "بارگیری ایمن خودرو", level: "پایه", duration: "۴۵ دقیقه", progress: 100, icon: "car" as const },
  { id: "course-2", title: "ایمنی در جاده و شب", level: "پایه", duration: "۳۵ دقیقه", progress: 100, icon: "shield" as const },
  { id: "course-3", title: "ارتباط حرفه‌ای با مشتری", level: "پیشرفته", duration: "۵۰ دقیقه", progress: 60, icon: "chat" as const },
  { id: "course-4", title: "کمک‌های اولیه در تصادف", level: "تخصصی", duration: "۱ ساعت", progress: 20, icon: "support" as const },
  { id: "course-5", title: "مسیریابی و محدودهٔ خدمت", level: "پایه", duration: "۳۰ دقیقه", progress: 0, icon: "route" as const },
];

export const heroSlides = [
  {
    id: "hero-loads",
    image: "/slides/driver/hero-loads.jpg",
    tag: "بارهای آزاد امروز",
    title: "بار بگیر، مسیر بساز.",
    description: "بارهای آزاد ناوگان و سفیران را در تالار ایرانشهر ببین و همان‌جا تأیید کن.",
    action: "دیدن بارها",
    target: "shahr" as View,
  },
  {
    id: "hero-ready",
    image: "/slides/driver/hero-ready.jpg",
    tag: "آمادگی ناوگان",
    title: "آماده باش، بارها منتظرته.",
    description: "با فعال کردن آمادگی، بارهای نزدیک محدودهٔ تو پیشنهاد می‌شود.",
    action: "تنظیم آمادگی",
    target: "readiness" as View,
  },
  {
    id: "hero-parts",
    image: "/slides/driver/hero-parts.jpg",
    tag: "لوازم یدکی با قیمت همکار",
    title: "قطعهٔ اصل، قیمت همکار.",
    description: "گیربکس، موتور و قطعات مصرفی با تخفیف ویژهٔ ناوگان امداد.",
    action: "خرید لوازم یدکی",
    target: "parts" as View,
  },
];

export const bannerSlides = [
  {
    id: "banner-social",
    image: "/slides/driver/banner-social.jpg",
    tag: "تالار ایرانشهر",
    title: "بار آزادت را با بقیه به اشتراک بگذار",
    description: "شبکهٔ اجتماعی امدادگران؛ بار بگیر، چت کن و مسیر بساز.",
    target: "shahr" as View,
  },
  {
    id: "banner-training",
    image: "/slides/driver/banner-training.jpg",
    tag: "آموزش امداد",
    title: "حرفه‌ای‌تر بار بگیر",
    description: "دوره‌های بارگیری ایمن، کمک‌های اولیه و ارتباط با مشتری.",
    target: "training" as View,
  },
  {
    id: "banner-insurance",
    image: "/slides/driver/banner-insurance.jpg",
    tag: "بیمهٔ ناوگان",
    title: "بیمهٔ خودروی امدادی‌ات را تمدید کن",
    description: "تعرفهٔ ویژهٔ همکاران، صدور سریع و پشتیبانی اختصاصی.",
    target: "tech" as View,
  },
  {
    id: "banner-parts",
    image: "/slides/driver/hero-parts.jpg",
    tag: "فروشگاه همکاران",
    title: "قطعات با تخفیف ناوگان",
    description: "گیربکس، موتور و برق خودرو؛ ارسال به محل مأموریت.",
    target: "parts" as View,
  },
];

export const digitFa = (value: string) => value.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

export function formatToman(value: number) {
  return `${Math.max(0, value).toLocaleString("fa-IR")} تومان`;
}

export function IranFlag({ className }: { className?: string }) {
  return (
    <span className={className ? `iran-flag ${className}` : "iran-flag"} aria-hidden="true">
      <Image src="/iran-flag.svg" alt="" width={36} height={21} unoptimized style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </span>
  );
}

export function Avatar({ name, tone = 0, size = "md" }: { name: string; tone?: number; size?: "sm" | "md" | "lg" }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "ک";
  return (
    <span className={`user-avatar driver-avatar driver-avatar--${size} driver-avatar--tone-${tone % 5}`} aria-hidden="true">
      {initials}
    </span>
  );
}

export function PageTitle({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack: () => void; action?: ReactNode }) {
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

export function SectionTitle({ title, caption, action }: { title: string; caption?: string; action?: ReactNode }) {
  return (
    <div className="section-title-row">
      <div><h2>{title}</h2>{caption && <p>{caption}</p>}</div>
      {action}
    </div>
  );
}
