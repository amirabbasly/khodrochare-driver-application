"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {api,errorMessage} from '@/lib/api';
type Checkout={id:string;status:string;mode:string;amountToman:number;refId:string|null};
export function PaymentReturn(){
  const[data,setData]=useState<Checkout|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get('checkout');if(!id)return;const controller=new AbortController();api<Checkout>(`/payments/checkouts/${encodeURIComponent(id)}`,{signal:controller.signal}).then(setData).catch(e=>{if(!controller.signal.aborted)setError(errorMessage(e));});return()=>controller.abort();},[]);
  async function verify(){if(!data||busy)return;setBusy(true);setError('');try{setData(await api<Checkout>(`/payments/checkouts/${data.id}/verify`,{method:'POST',body:{}}));}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
  const success=data?.status==='VERIFIED';
  return <main className="auth-page" dir="rtl"><section className="auth-card"><h1>نتیجه پرداخت زرین‌پال</h1>{error&&<p className="form-error" role="alert">{error}</p>}{!data&&!error&&<p>در حال بررسی نتیجه پرداخت…</p>}{data&&<><p role="status">{success?data.mode==='sandbox'?'پرداخت آزمایشی موفق بود؛ وجه واقعی دریافت نشده است.':'پرداخت با موفقیت تأیید شد.':data.status==='CANCELLED'?'پرداخت لغو شد.':['DUPLICATE_PAYMENT','REFUND_REQUIRED'].includes(data.status)?'این پرداخت نیاز به پیگیری پشتیبانی دارد.':'تأیید پرداخت هنوز دریافت نشده است.'}</p><p>مبلغ: {data.amountToman.toLocaleString('fa-IR')} تومان</p>{data.refId&&<p>کد پیگیری: {data.refId}</p>}{!success&&!['DUPLICATE_PAYMENT','REFUND_REQUIRED'].includes(data.status)&&<button className="primary-button" disabled={busy} onClick={verify}>{busy?'در حال بررسی…':'بررسی دوباره پرداخت'}</button>}</>}<Link className="primary-button" href="/home">بازگشت به اپلیکیشن</Link></section></main>;
}
