"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout as backendLogout, errorMessage } from "@/lib/api";
import { useAuthenticatedUser } from "@/lib/use-backend";
import { useDriverFeed } from "@/lib/use-driver-feed";
import { BrandLogo, Icon, type IconName } from "@/components/Icons";
import { AiMascot } from "@/components/Artwork";
import { HomeView } from "@/components/driver/HomeView";
import { IranShahrView } from "@/components/driver/IranShahrView";
import { JobView, LoadsView, MaintenanceView, ReadinessView } from "@/components/driver/OpsViews";
import { PartsView, TechView } from "@/components/driver/StoreViews";
import { DocumentsView, InviteView, NotificationsView, ProfileView, SupportView, TrainingView, VehicleView } from "@/components/driver/AccountViews";
import {
  Avatar,
  PageTitle,
  SectionTitle,
  type DriverService,
  type DriverSession,
  type LoadOffer,
  type PartKey,
  type View,
} from "@/components/driver/shared";

const READY_KEY = "khodrochare_readiness_v2";

const bottomItems: { label: string; view: View; icon: IconName }[] = [
  { label: "خانه", view: "home", icon: "home" },
  { label: "کیف پول", view: "wallet", icon: "wallet" },
  { label: "تالار ایرانشهر", view: "shahr", icon: "chat" },
  { label: "پروفایل", view: "profile", icon: "user" },
];

const drawerGroups: { label: string; items: { label: string; view: View; icon: IconName }[] }[] = [
  {
    label: "دسترسی سریع",
    items: [
      { label: "خانه", view: "home", icon: "home" },
      { label: "کیف پول", view: "wallet", icon: "wallet" },
      { label: "تالار ایرانشهر", view: "shahr", icon: "chat" },
      { label: "پروفایل من", view: "profile", icon: "user" },
    ],
  },
  {
    label: "کار و بار",
    items: [
      { label: "بارهای من", view: "loads", icon: "briefcase" },
      { label: "آمادگی و شیفت", view: "readiness", icon: "power" },
      { label: "آخرین سرویس‌های من", view: "maintenance", icon: "refresh" },
    ],
  },
  {
    label: "خدمات ناوگان",
    items: [
      { label: "خرید لوازم یدکی", view: "parts", icon: "market" },
      { label: "خدمات فنی و بیمه", view: "tech", icon: "shield" },
      { label: "آموزش امداد", view: "training", icon: "book" },
    ],
  },
  {
    label: "حساب من",
    items: [
      { label: "خودرو و پلاک من", view: "vehicles", icon: "car" },
      { label: "مدارک و احراز هویت", view: "documents", icon: "document" },
      { label: "دعوت از همکاران", view: "invite", icon: "gift" },
      { label: "پشتیبانی ناوگان", view: "support", icon: "support" },
      { label: "اعلان‌ها", view: "notifications", icon: "bell" },
    ],
  },
];

const faL = (value: string) => value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/[٬،,\s]/g, "");

function formatMoney(value: number) {
  return `${Math.max(0, value).toLocaleString("fa-IR")} تومان`;
}

function WalletView({ balance, onAdd, onBack }: { balance: number; onAdd: (amount: number) => void; onBack: () => void }) {
  const [amount, setAmount] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(faL(amount));
    if (parsed < 10000) return;
    onAdd(parsed);
    setAmount("");
  }

  return (
    <div className="subpage">
      <PageTitle title="کیف پول" subtitle="تسویهٔ بارها و پرداخت سریع خدمات ناوگان" onBack={onBack} />
      <div className="wallet-layout">
        <section className="wallet-card">
          <div className="wallet-card-top"><span className="wallet-emblem"><Icon name="wallet" size={23} /></span><span className="wallet-secure"><Icon name="shield" size={14} /> کیف پول امن ناوگان</span></div>
          <span className="wallet-label">موجودی قابل استفاده</span>
          <strong className="wallet-balance">{formatMoney(balance)}</strong>
          <span className="wallet-card-foot">تسویهٔ بارها به‌صورت خودکار به این کیف پول اضافه می‌شود.</span>
          <div className="wallet-card-orbit" />
        </section>
        <section className="panel-card topup-card">
          <span className="panel-eyebrow">افزایش موجودی</span>
          <h2>کیف پولت را شارژ کن</h2>
          <p>مبلغ دلخواهت را وارد کن و ادامه بده.</p>
          <form className="topup-form" onSubmit={submit}>
            <label className="form-field"><span className="field-label">مبلغ شارژ (تومان)</span><span className="field-control"><input type="text" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="مثلاً ۵۰۰٬۰۰۰" required dir="rtl" /></span></label>
            <button type="submit" className="primary-button">ادامه به پرداخت <Icon name="arrow-left" size={17} /></button>
          </form>
        </section>
      </div>
      <section className="panel-card list-panel">
        <SectionTitle title="تراکنش‌های اخیر" caption="آخرین تغییرات کیف پول تو" />
        <div className="transaction-row"><span className="transaction-icon transaction-icon--green"><Icon name="plus" size={18} /></span><span className="transaction-info"><strong>تسویهٔ بار ناوگان</strong><small>امروز · ۱۰:۴۲</small></span><b className="money-positive">+ ۵۰۰٬۰۰۰ تومان</b></div>
        <div className="transaction-row"><span className="transaction-icon"><Icon name="market" size={18} /></span><span className="transaction-info"><strong>خرید لوازم یدکی</strong><small>۲۴ مهر · ۱۶:۲۰</small></span><b>− ۸۵۰٬۰۰۰ تومان</b></div>
      </section>
    </div>
  );
}

function AIChat({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: "سلام! من چاره‌یار ناوگانم. برای بار، قطعه یا خدمات خودروی امدادی‌ات چه کمکی می‌کنم؟" }]);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    const question = text.trim();
    setMessages((items) => [
      ...items,
      { from: "user", text: question },
      { from: "bot", text: "حتماً! برای راهنمایی دقیق‌تر از تالار ایرانشهر بار آزاد را ببین یا موضوعت را با کارشناس ناوگان در میان بگذار." },
    ]);
    setText("");
  }

  return (
    <>
      {open && (
        <section className="chat-window" aria-label="گفت‌وگو با چاره‌یار">
          <div className="chat-header">
            <span className="chat-avatar"><span>AI</span></span>
            <div><strong>چاره‌یار ناوگان</strong><small><i />همراه هوشمند امدادگران</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="بستن گفت‌وگو"><Icon name="close" size={19} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => <p key={`${message.from}-${index}`} className={`chat-bubble${message.from === "user" ? " chat-bubble--user" : ""}`}>{message.text}</p>)}
          </div>
          <form className="chat-input-row" onSubmit={send}>
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder="پیامت را بنویس…" aria-label="پیام شما" />
            <button type="submit" aria-label="ارسال پیام"><Icon name="send" size={17} /></button>
          </form>
          <div className="chat-demo-note">همراه هوشمند ناوگان امداد</div>
        </section>
      )}
      <button className={`ai-fab${open ? " ai-fab--open" : ""}`} type="button" onClick={() => setOpen(!open)} aria-label={open ? "بستن چاره‌یار" : "گفت‌وگو با هوش مصنوعی"}>
        <span className="ai-fab-mascot"><AiMascot /></span>
        <span className="ai-fab-copy">چاره‌یار <small>پشتیبانی هوشمند ناوگان</small></span>
        {open && <Icon name="close" size={18} />}
      </button>
    </>
  );
}

function CustomerSheet({ load, onClose, onToast }: { load: LoadOffer; onClose: () => void; onToast: (message: string) => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="customer-sheet-title" onClick={onClose}>
      <div className="modal-box driver-sheet" onClick={(event) => event.stopPropagation()}>
        <button className="driver-sheet-close" type="button" onClick={onClose} aria-label="بستن پروفایل"><Icon name="close" size={17} /></button>
        <Avatar name={load.customer} tone={load.tone} size="lg" />
        <h3 id="customer-sheet-title">{load.customer}</h3>
        <p className="driver-sheet-role"><Icon name="shield" size={13} /> {load.role} · عضو ناوگان خودرو چاره</p>
        <div className="driver-sheet-stats">
          <span><b>★ {load.rating.toLocaleString("fa-IR")}</b><small>امتیاز</small></span>
          <span><b>{load.status === "done" ? "۴۲" : "۳۱"}</b><small>بار انجام‌شده</small></span>
          <span><b>۱۴۰۲</b><small>شروع همکاری</small></span>
        </div>
        <div className="driver-sheet-route">
          <span><Icon name="route" size={15} /> {load.from} به {load.to}</span>
          <span><Icon name="car" size={15} /> {load.car}</span>
          <span dir="ltr"><Icon name="tag" size={15} /> {load.plate}</span>
        </div>
        <div className="driver-sheet-actions">
          <button className="primary-button" type="button" onClick={() => onToast(`تماس با ${load.customer} در حال برقراری است.`)}><Icon name="phone" size={15} /> تماس</button>
          <button className="load-reject" type="button" onClick={onClose}>بستن</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");
  const user = useAuthenticatedUser();
  const serviceIds = { REPAIR: "repair", TOWING: "transport", MOBILE_CARWASH: "carwash", PERIODIC_SERVICE: "maintenance", INSPECTION: "inspection" };
  const session: DriverSession = { name: user?.fullName || "سفیر خودرو چاره", username: user?.phone, phone: user?.phone, nationalCode: user?.nationalId, plate: user?.vehiclePlate, vehicleType: user?.vehicleType, services: user?.services.map(code => serviceIds[code]), documentName: user?.identityDocumentId ? "مدرک هویتی ثبت‌شده" : undefined };
  const [balance] = useState(0);
  const [ready, setReady] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const feed = useDriverFeed(ready, notify);
  const loads = feed.loads.filter(load => load.status !== "pending" || !rejectedIds.includes(load.id));
  const activeLoad = loads.find(load => load.id === selectedLoadId) || feed.active;
  const [partFilter, setPartFilter] = useState<PartKey | "all">("all");
  const [techServiceId, setTechServiceId] = useState<string>("insurance");
  const [customerSheet, setCustomerSheet] = useState<LoadOffer | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setReady(localStorage.getItem(READY_KEY) === "1"); } catch {}
    }, 0);
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

  function openPart(part: PartKey | "all") {
    setPartFilter(part);
    navigate("parts");
  }

  function openService(service: DriverService) {
    if (service.id === "training") {
      navigate("training");
      return;
    }
    setTechServiceId(service.id);
    navigate("tech");
  }

  function toggleReady() {
    const next = !ready;
    setReady(next);
    try {
      localStorage.setItem(READY_KEY, next ? "1" : "0");
    } catch {
      /* Ignore storage restrictions. */
    }
    notify(next ? "آمادگی فعال شد؛ بارهای جدید به تو پیشنهاد می‌شود." : "آمادگی غیرفعال شد؛ دیگر باری نمایش داده نمی‌شود.");
  }

  async function acceptLoad(load: LoadOffer) {
    if (await feed.accept(load)) { setSelectedLoadId(load.id); navigate("job"); notify("درخواست با موفقیت پذیرفته شد."); }
  }
  function rejectLoad(load: LoadOffer) {
    setRejectedIds(ids => [...ids, load.id]);
    notify("این درخواست از فهرست شما کنار گذاشته شد.");
  }
  async function completeLoad(load: LoadOffer) {
    await feed.status(load, "COMPLETED");
    setSelectedLoadId(null); navigate("loads"); notify("پایان مأموریت در سرور ثبت شد.");
  }
  function takePost() { notify("ثبت بار از تالار ایرانشهر هنوز در سرور فعال نشده است."); }
  function addBalance() { notify("پرداخت و کیف پول هنوز به سرور متصل نیست."); }
  function saveProfile() { notify("ویرایش اطلاعات حساب هنوز در سرور فعال نشده است."); }
  function saveVehicle() { notify("ویرایش خودروی امدادگر هنوز در سرور فعال نشده است."); }
  async function logout() {
    try { await backendLogout(); } catch (error) { notify(errorMessage(error)); }
    finally { router.replace("/"); }
  }

  const userName = session.name || "سفیر خودرو چاره";
  const pendingLoads = loads.filter((load) => load.status === "pending");
  const activeCount = loads.filter((load) => load.status === "active").length;

  let content: ReactNode;
  switch (view) {
    case "home":
      content = (
        <HomeView
          balance={balance}
          ready={ready}
          pendingLoads={pendingLoads}
          activeCount={activeCount}
          onNavigate={navigate}
          onToast={notify}
          onAcceptLoad={acceptLoad}
          onRejectLoad={rejectLoad}
          onOpenPart={openPart}
          onOpenService={openService}
        />
      );
      break;
    case "wallet": content = <WalletView balance={balance} onAdd={addBalance} onBack={() => navigate("home")} />; break;
    case "shahr": content = <IranShahrView userName={userName} onBack={() => navigate("home")} onToast={notify} onTakeLoad={takePost} />; break;
    case "profile":
      content = <ProfileView session={session} onSave={saveProfile} onBack={() => navigate("home")} onToast={notify} onNavigate={navigate} />;
      break;
    case "loads":
      content = (
        <LoadsView
          loads={loads}
          onBack={() => navigate("home")}
          onToast={notify}
          onAccept={acceptLoad}
          onReject={rejectLoad}
          onOpenJob={(load) => { setSelectedLoadId(load.id); navigate("job"); }}
          onProfile={(load) => setCustomerSheet(load)}
        />
      );
      break;
    case "readiness": content = <ReadinessView ready={ready} onToggle={toggleReady} onBack={() => navigate("home")} onToast={notify} />; break;
    case "job":
      content = activeLoad
        ? <JobView key={activeLoad.id} load={activeLoad} tracking={feed.tracking} onArrive={async load => { await feed.status(load, "ARRIVED"); }} onBack={() => navigate("loads")} onToast={notify} onComplete={completeLoad} onOpenChat={() => navigate("shahr")} />
        : <LoadsView loads={loads} onBack={() => navigate("home")} onToast={notify} onAccept={acceptLoad} onReject={rejectLoad} onOpenJob={(load) => { setSelectedLoadId(load.id); navigate("job"); }} onProfile={(load) => setCustomerSheet(load)} />;
      break;
    case "parts":
      content = <PartsView key={partFilter} initialPart={partFilter} onBack={() => navigate("home")} onToast={notify} />;
      break;
    case "tech":
      content = <TechView key={techServiceId} initialId={techServiceId} onBack={() => navigate("home")} onToast={notify} />;
      break;
    case "vehicles": content = <VehicleView session={session} onSave={saveVehicle} onBack={() => navigate("profile")} onToast={notify} />; break;
    case "documents": content = <DocumentsView session={session} onBack={() => navigate("profile")} onToast={notify} />; break;
    case "training": content = <TrainingView onBack={() => navigate("home")} onToast={notify} />; break;
    case "maintenance": content = <MaintenanceView onBack={() => navigate("home")} onToast={notify} />; break;
    case "invite": content = <InviteView onBack={() => navigate("home")} onToast={notify} />; break;
    case "support": content = <SupportView onBack={() => navigate("home")} onToast={notify} />; break;
    case "notifications": content = <NotificationsView onBack={() => navigate("home")} onToast={notify} />; break;
    default:
      content = (
        <HomeView
          balance={balance}
          ready={ready}
          pendingLoads={pendingLoads}
          activeCount={activeCount}
          onNavigate={navigate}
          onToast={notify}
          onAcceptLoad={acceptLoad}
          onRejectLoad={rejectLoad}
          onOpenPart={openPart}
          onOpenService={openService}
        />
      );
  }

  return (
    <div className="app-frame" dir="rtl">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="header-menu-wrap">
            <button className={`menu-button${drawerOpen ? " menu-button--active" : ""}`} type="button" onClick={() => setDrawerOpen(true)} aria-label="باز کردن منو"><span /><span /><span /></button>
            <span className="menu-word">منو</span>
          </div>
          <button className="header-brand-button" type="button" onClick={() => navigate("home")} aria-label="بازگشت به خانه"><BrandLogo compact /></button>
          <div className="header-meta">
            <button
              className={`header-ready-switch${ready ? " is-on" : ""}`}
              type="button"
              role="switch"
              aria-checked={ready}
              onClick={toggleReady}
              aria-label={ready ? "آمادگی دریافت بار روشن است؛ خاموش کردن" : "آمادگی دریافت بار خاموش است؛ روشن کردن"}
              title={ready ? "آمادگی دریافت بار: روشن" : "آمادگی دریافت بار: خاموش"}
            >
              <span className="header-ready-icon"><Icon name="power" size={19} /></span>
            </button>
            <button className="notification-button" type="button" onClick={() => navigate("notifications")} aria-label="اعلان‌ها"><Icon name="bell" size={20} /><i /></button>
          </div>
        </div>
      </header>

      <main className={`app-main${view === "home" ? " app-main--home" : ""}`} key={view}>{content}</main>

      <nav className="bottom-nav" aria-label="ناوبری اصلی">
        {bottomItems.map((item) => (
          <button
            className={`bottom-nav-item${view === item.view ? " is-active" : ""}${item.view === "shahr" ? " bottom-nav-item--shahr" : ""}`}
            key={item.view}
            type="button"
            onClick={() => navigate(item.view)}
            aria-current={view === item.view ? "page" : undefined}
          >
            <span className="bottom-nav-icon"><Icon name={item.icon} size={21} /></span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`drawer-backdrop${drawerOpen ? " is-visible" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={`app-drawer${drawerOpen ? " is-open" : ""}`} aria-label="منوی اصلی" aria-hidden={!drawerOpen}>
        <div className="drawer-header">
          <div className="drawer-user">
            <Avatar name={userName} tone={4} size="lg" />
            <div>
              <strong>{userName}</strong>
              <span>سفیر ناوگان امداد خودرو چاره</span>
              <small><Icon name="wallet" size={13} /> موجودی کیف پول <b>{balance.toLocaleString("fa-IR")} تومان</b></small>
            </div>
          </div>
          <button type="button" className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="بستن منو"><Icon name="close" size={18} /></button>
          <div className={`drawer-ready${ready ? " is-on" : ""}`}><i />{ready ? "آمادگی دریافت بار فعال است" : "آمادگی دریافت بار غیرفعال است"}</div>
          <div className="drawer-header-glow" />
        </div>
        <div className="drawer-content">
          {drawerGroups.map((group) => (
            <div className="drawer-group" key={group.label}>
              <span className="drawer-section-label">{group.label}</span>
              <nav className="drawer-nav">
                {group.items.map((item) => (
                  <button type="button" key={`${group.label}-${item.view}`} onClick={() => navigate(item.view)} className={view === item.view ? "is-current" : ""}>
                    <span className="drawer-nav-icon"><Icon name={item.icon} size={18} /></span>
                    <span>{item.label}</span>
                    <Icon name="chevron" size={15} className="drawer-arrow" />
                  </button>
                ))}
              </nav>
            </div>
          ))}
          <button className="drawer-logout" type="button" onClick={logout}><span><Icon name="logout" size={18} /></span>خروج از حساب</button>
          <div className="drawer-footer"><BrandLogo compact /><span>ناوگان امداد · نسخه ۲.۰.۰</span></div>
        </div>
      </aside>

      <AIChat open={chatOpen} setOpen={setChatOpen} />
      {customerSheet && <CustomerSheet load={customerSheet} onClose={() => setCustomerSheet(null)} onToast={notify} />}
      {toast && <div className="toast-message" role="status"><span><Icon name="check" size={17} /></span>{toast}<button type="button" onClick={() => setToast("")} aria-label="بستن پیام"><Icon name="close" size={15} /></button></div>}
    </div>
  );
}
