"use client";
import {useEffect,useRef} from 'react';
import './location-permission.css';

export function CommissionDebtNotice({balance,name,onPay}:{balance:number|null;name:string;onPay:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),shown=useRef(false);
 useEffect(()=>{
  if(balance===null)return;
  if(balance>=0){shown.current=false;dialog.current?.close();return;}
  if(!shown.current){shown.current=true;dialog.current?.showModal();}
 },[balance]);
 useEffect(()=>{
  let hidden=document.visibilityState==='hidden';
  const resume=()=>{if(document.visibilityState==='hidden'){hidden=true;return;}if(hidden){hidden=false;if(balance!==null&&balance<0)dialog.current?.showModal();}};
  window.addEventListener('pageshow',resume);document.addEventListener('visibilitychange',resume);
  return()=>{window.removeEventListener('pageshow',resume);document.removeEventListener('visibilitychange',resume);};
 },[balance]);
 return <dialog ref={dialog} className="location-permission" dir="rtl" aria-labelledby="commission-debt-title"><h2 id="commission-debt-title">پرداخت کمیسیون ناوگان</h2><p>{name} عزیز، لطفاً برای ادامه همکاری با ناوگان خودرو چاره و درآمدزایی بیشتر و گرفتن بارهای جدید، ابتدا با استفاده از دکمه زیر اقدام به پرداخت کمیسیون خود کنید.</p><p>بدهی کمیسیون: {Math.abs(balance??0).toLocaleString('fa-IR')} تومان</p><button type="button" className="primary-button" onClick={()=>{dialog.current?.close();onPay();}}>پرداخت کمیسیون</button><button type="button" className="location-permission-later" onClick={()=>dialog.current?.close()}>بعداً</button></dialog>;
}
