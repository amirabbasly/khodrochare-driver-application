"use client";
import {useEffect,useState} from 'react';
import {api} from './api';
export type Wallet={balanceToman:number;sandboxBalanceToman:number;mode:'sandbox'|'live';entries:{id:string;amountToman:number;mode:'sandbox'|'live';createdAt:string}[]};
export function useWallet(){
  const[data,setData]=useState<Wallet|null>(null),[error,setError]=useState('');
  useEffect(()=>{const controller=new AbortController();const load=()=>{api<Wallet>('/wallet',{signal:controller.signal}).then(value=>{setData(value);setError('');}).catch(()=>{if(!controller.signal.aborted)setError('دریافت کیف پول ممکن نیست؛ دوباره تلاش کنید.');});};load();window.addEventListener('focus',load);return()=>{controller.abort();window.removeEventListener('focus',load);};},[]);
  return{data,error};
}
export async function startGateway(path:string,body:object){
  const result=await api<{url:string|null;mode:string}>(path,{method:'POST',body});
  if(!result.url)throw new Error('این پرداخت قبلاً انجام شده است.');
  const url=new URL(result.url);
  if(!['sandbox.zarinpal.com','payment.zarinpal.com','www.zarinpal.com'].includes(url.hostname)||url.protocol!=='https:'||!url.pathname.startsWith('/pg/StartPay/'))throw new Error('نشانی درگاه معتبر نیست.');
  window.location.assign(url.href);
}
