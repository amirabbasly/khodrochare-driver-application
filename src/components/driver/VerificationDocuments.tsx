"use client";
import {useState} from 'react';
import {useAuthenticatedUser} from '@/lib/use-backend';
import {api,uploadDocument,updateSessionUser,errorMessage,type User} from '@/lib/api';
import {Icon} from '../Icons';
import './verification-documents.css';
import {PageTitle,SectionTitle} from './shared';
const documents=[
 {kind:'NATIONAL_ID',title:'کارت ملی',note:'تصویر خوانا از کارت ملی؛ الزامی'},
 {kind:'BIRTH_CERTIFICATE',title:'شناسنامه',note:'تصویر صفحه مشخصات شناسنامه؛ الزامی'},
 {kind:'DRIVING_LICENSE',title:'گواهینامه',note:'تصویر گواهینامه معتبر؛ الزامی'},
 {kind:'VEHICLE_OWNERSHIP',title:'مدرک خودرو',note:'یکی از کارت ماشین، بیمه‌نامه یا گواهی معاینه فنی به نام خودتان؛ الزامی'},
];
const evidence=[['VEHICLE_CARD','کارت ماشین'],['INSURANCE','بیمه‌نامه'],['TECHNICAL_INSPECTION','گواهی معاینه فنی']];
function update(user:User){updateSessionUser(user);window.dispatchEvent(new CustomEvent('khodrochare:user',{detail:user}));}
export function VerificationDocuments({onBack,onToast}:{onBack:()=>void;onToast:(message:string)=>void}){
 const user=useAuthenticatedUser(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[vehicleType,setVehicleType]=useState(()=>user?.documents?.find(doc=>doc.verificationKind==='VEHICLE_OWNERSHIP')?.vehicleEvidenceType||'VEHICLE_CARD');
 const current=documents.map(item=>({...item,document:user?.documents?.find(doc=>doc.verificationKind===item.kind)}));
 const legacy=user?.documents?.find(doc=>doc.verificationKind==='LEGACY_IDENTITY');
 const count=current.filter(item=>item.document).length;
 async function upload(file:File,kind:string){if(busy)return;setBusy(true);setError('');try{const reference=await uploadDocument(file);await api('/me/verification-documents',{method:'POST',body:{kind,document:reference,...(kind==='VEHICLE_OWNERSHIP'?{vehicleEvidenceType:vehicleType}:{})}});update(await api<User>('/me'));onToast('مدرک ثبت شد؛ پس از تکمیل چهار بخش، ارسال برای بررسی را بزنید.');}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 async function submit(){if(busy)return;setBusy(true);setError('');try{update(await api<User>('/me/verification-documents/submit',{method:'POST',body:{}}));onToast('مدارک شما برای بررسی مجدد ارسال شد.');}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 async function view(id:string){try{const blob=await api<Blob>(`/documents/${id}`,{responseType:'blob'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='verification-document'+(blob.type==='image/png'?'.png':'.jpg');link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){setError(errorMessage(e));}}
 return <div className="subpage verification-documents"><PageTitle title="مدارک و احراز هویت" subtitle="چهار بخش الزامی را تکمیل و برای بررسی ارسال کنید" onBack={onBack}/>{error&&<p className="text-danger" role="alert">{error}</p>}
 <section className="doc-progress-card"><div className="doc-progress-head"><span className="doc-progress-icon"><Icon name="shield" size={24}/></span><div><small>مدارک ثبت‌شده</small><strong>{count.toLocaleString('fa-IR')} از ۴ بخش تکمیل شده</strong></div><b>{(count*25).toLocaleString('fa-IR')}٪</b></div><div className="doc-progress-bar"><span style={{width:`${count*25}%`}}/></div><p>{user?.verificationStatus==='NEEDS_CORRECTION'?`علت نیاز به اصلاح: ${user.verificationNote||'لطفاً مدارک را تکمیل کنید.'}`:user?.verificationStatus==='APPROVED'?'احراز هویت شما تأیید شده است؛ تغییر مدرک نیاز به بررسی مجدد دارد.':'تا تأیید پشتیبانی، پذیرش بار و استفاده از ماژول‌ها فعال نمی‌شود.'}</p></section>
 {legacy&&<section className="panel-card"><p>مدرک هویتی قبلی شما نگهداری شده است. کارت ملی و شناسنامه را در دو بخش جداگانه بارگذاری کنید.</p><button className="text-link" type="button" onClick={()=>void view(legacy.id)}>مشاهده مدرک قبلی</button></section>}
 <section className="panel-card document-list"><SectionTitle title="مدارک الزامی" caption="تصویر JPG یا PNG، حداکثر ۵ مگابایت برای هر مدرک"/>{current.map(item=><article className="document-row" key={item.kind}><span className={`document-icon${item.document?' is-ready':''}`}><Icon name={item.kind==='VEHICLE_OWNERSHIP'?'car':'document'} size={19}/></span><div className="document-copy"><strong>{item.title}</strong><small>{item.note}</small>{item.kind==='VEHICLE_OWNERSHIP'&&<label>نوع مدرک خودرو<select aria-label="نوع مدرک خودرو" value={vehicleType} disabled={busy} onChange={e=>setVehicleType(e.target.value)}>{evidence.map(([value,title])=><option key={value} value={value}>{title}</option>)}</select></label>}{item.document&&<small>ثبت‌شده{item.document.vehicleEvidenceType?' · '+evidence.find(([value])=>value===item.document?.vehicleEvidenceType)?.[1]:''}</small>}</div><label className="document-upload"><input type="file" aria-label={`بارگذاری ${item.title}`} accept="image/jpeg,image/png" disabled={busy} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void upload(file,item.kind);}}/><Icon name="upload" size={14}/>{item.document?'جایگزینی':'بارگذاری'}</label>{item.document&&<button className="row-more" type="button" aria-label={`مشاهده ${item.title}`} onClick={()=>void view(item.document!.id)}><Icon name="document" size={18}/></button>}</article>)}</section>
 <button type="button" className="primary-button" disabled={busy||count!==4||user?.verificationStatus==='APPROVED'} onClick={()=>void submit()}>{busy?'در حال ثبت…':user?.verificationStatus==='APPROVED'?'احراز هویت تأیید شده':'ارسال مدارک برای بررسی'}</button><p className="doc-privacy">کارت ماشین، بیمه‌نامه و معاینه فنی سه انتخاب برای یک بخش «مدرک خودرو» هستند. بررسی نام مالک با پشتیبانی است.</p></div>;
}
