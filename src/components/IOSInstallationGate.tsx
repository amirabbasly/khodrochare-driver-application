"use client";
import Image from 'next/image';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {iosInstallMode,type IOSInstallMode} from '@/lib/ios-install';
import './ios-install.css';
const DISMISSED='khodrochare_ios_install_web_session_v1';
function ShareIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M7 9H5v12h14V9h-2M12 15V2m-5 5 5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function MoreIcon(){return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>;}
function AddIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7v10M7 12h10" strokeLinecap="round"/></svg>;}
export function IOSInstallationGate({children}:{children:ReactNode}){
 const pathname=usePathname(),continued=useRef(false);
 const[mode,setMode]=useState<IOSInstallMode|'checking'>('checking'),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false);
 useEffect(()=>{
  function update(){
   const detected=iosInstallMode();
   let dismissed=continued.current;
   try{dismissed ||= sessionStorage.getItem(DISMISSED)==='1';}catch{}
   const paymentReturn=pathname.startsWith('/payment/')||pathname==='/hall/payment';
   setMode(detected==='pass'||dismissed||paymentReturn?'pass':detected);
  }
  update();
  const media=['standalone','minimal-ui','fullscreen','window-controls-overlay'].map(mode=>window.matchMedia(`(display-mode: ${mode})`));
  media.forEach(query=>query.addEventListener?.('change',update));
  window.addEventListener('pageshow',update);window.addEventListener('deviceready',update);window.addEventListener('capacitorNativeReady',update);document.addEventListener('visibilitychange',update);
  const installed=()=>{continued.current=true;try{sessionStorage.setItem(DISMISSED,'1');}catch{}setMode('pass');};window.addEventListener('appinstalled',installed);
  return()=>{media.forEach(query=>query.removeEventListener?.('change',update));window.removeEventListener('pageshow',update);window.removeEventListener('deviceready',update);window.removeEventListener('capacitorNativeReady',update);document.removeEventListener('visibilitychange',update);window.removeEventListener('appinstalled',installed);};
 },[pathname]);
 function continueWeb(){continued.current=true;try{sessionStorage.setItem(DISMISSED,'1');}catch{}setMode('pass');}
 async function copyAddress(){setCopyError(false);try{await navigator.clipboard.writeText(window.location.href);setCopied(true);}catch{setCopyError(true);}}
 if(mode==='checking')return <div className="ios-install-check" aria-busy="true" aria-label="در حال آماده‌سازی خودرو چاره"/>;
 if(mode==='pass')return children;
 return <main className="ios-install-page" dir="rtl"><div className="ios-install-shell">
  <header className="ios-install-brand"><Image src="/khodrochare-wordmark.png" alt="لوگوی اصلی خودرو چاره" width={2172} height={724} sizes="220px" priority unoptimized/><span>همراه شما، در هر مسیر</span></header>
  <div className="ios-install-layout"><section className="ios-install-content" aria-labelledby="ios-welcome-title">
   <span className="ios-install-eyebrow"><span aria-hidden="true"/>نسخه آیفون و آیپد</span>
   <h1 id="ios-welcome-title">به خانوادهٔ <strong>۴۰۰٬۰۰۰ نفری</strong><br/>خودرو چاره خوش آمدید</h1>
   <p className="ios-install-intro">یک قدم تا دسترسی به تمامی خدمات خودرویی</p>
   <div className="ios-install-guide"><h2>نصب وب‌اپلیکیشن خودرو چاره روی آیفون</h2><p>فقط چند لمس، تا همیشه کنار شما باشیم.</p>
    {mode==='ios-browser'&&<div className="ios-install-safari-note"><strong>ابتدا این صفحه را در Safari باز کنید.</strong><p>نشانی همین صفحه را کپی کنید و در مرورگر Safari آیفون باز کنید.</p><button type="button" onClick={()=>void copyAddress()}>{copied?'نشانی کپی شد':'کپی نشانی برای Safari'}</button>{copied&&<p role="status">نشانی صفحه کپی شد.</p>}{copyError&&<p role="alert">کپی خودکار انجام نشد؛ نشانی صفحه را از نوار مرورگر کپی کنید.</p>}</div>}
    <ol className="ios-install-steps">
     <li><span className="ios-install-step-icon"><MoreIcon/></span><div><strong>روی آیکون سه‌نقطه <bdi>…</bdi> بزنید</strong><p>در نوار مرورگر Safari، منوی سه‌نقطه را باز کنید.</p></div></li>
     <li><span className="ios-install-step-icon"><ShareIcon/></span><div><strong>گزینهٔ <bdi lang="en">Share</bdi> را انتخاب کنید</strong><p>در بعضی نسخه‌های Safari، آیکون اشتراک‌گذاری مستقیماً در نوار مرورگر دیده می‌شود.</p></div></li>
     <li><span className="ios-install-step-icon"><AddIcon/></span><div><strong><bdi lang="en">Add to Home Screen</bdi></strong><p>گزینهٔ «افزودن به صفحهٔ اصلی» را در فهرست پیدا کنید.</p></div></li>
     <li><span className="ios-install-step-number">۴</span><div><strong>در پایان، <bdi lang="en">Add</bdi> را بزنید</strong><p>اگر گزینهٔ <bdi lang="en">Open as Web App</bdi> را می‌بینید، آن را روشن نگه دارید.</p></div></li>
    </ol>
   </div>
   <p className="ios-install-open-note">پس از نصب، خودرو چاره را از آیکون آن در صفحهٔ اصلی گوشی باز کنید.</p>
   <button type="button" className="ios-install-continue" onClick={continueWeb}>فعلاً ادامه در نسخه وب <span aria-hidden="true">←</span></button>
  </section>
  <aside className="ios-install-preview" aria-label="تصویر راهنمای افزودن خودرو چاره به صفحه اصلی"><div className="ios-install-phone" aria-hidden="true"><div className="ios-install-island"/><div className="ios-install-phone-content"><div className="ios-install-app-icon"><Image src="/khodrochare-symbol.png" alt="" width={150} height={150} unoptimized/></div><span className="ios-install-phone-brand">خودرو چاره</span><p>همه‌چیز برای ماشینت،<br/>یک‌جا.</p><div className="ios-install-preview-sheet"><span className="ios-install-sheet-handle"/><div><AddIcon/><strong lang="en">Add to Home Screen</strong><span>+</span></div><small>افزودن به صفحهٔ اصلی</small></div></div><div className="ios-install-browser-bar"><span>‹</span><span className="ios-install-address">خودرو چاره</span><span className="ios-install-more-highlight"><MoreIcon/></span></div><div className="ios-install-home-indicator"/></div><p className="ios-install-preview-caption">یک آیکون روی گوشی؛<br/><strong>یک همراه برای تمام مسیرها.</strong></p></aside>
  </div><footer className="ios-install-footer">خودرو چاره؛ یک تماس، یک چاره</footer>
 </div></main>;
}
