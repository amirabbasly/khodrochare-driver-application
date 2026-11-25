"use client";
import {useEffect,useState} from 'react';
import {api} from './api';
export type Wallet={balanceToman:number;sandboxBalanceToman:number;mode:'sandbox'|'live';entries:{kind?:string;id:string;amountToman:number;mode:'sandbox'|'live';createdAt:string}[]};
export function useWallet(){
  const[data,setData]=useState<Wallet|null>(null),[error,setError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    let running=false,queued=false;
    async function load(){
      if(controller.signal.aborted)return;
      if(running){queued=true;return;}
      running=true;
      try{
        const value=await api<Wallet>('/wallet',{signal:controller.signal});
        if(!controller.signal.aborted){setData(value);setError('');}
      }catch{
        if(!controller.signal.aborted)setError('دریافت کیف پول ممکن نیست؛ دوباره تلاش کنید.');
      }finally{
        running=false;
        // A focus during a pending read still gets one fresh trailing read.
        if(queued&&!controller.signal.aborted){queued=false;void load();}
      }
    }
    const focus=()=>{void load();};
    void load();window.addEventListener('focus',focus);window.addEventListener('khodrochare:wallet-refresh',focus);
    return()=>{controller.abort();window.removeEventListener('focus',focus);window.removeEventListener('khodrochare:wallet-refresh',focus);};
  },[]);
  return{data,error};
}
export async function startGateway(path:string,body:object){
  const result=await api<{url:string|null;mode:string}>(path,{method:'POST',body});
  if(!result.url)throw new Error('این پرداخت قبلاً انجام شده است.');
  const url=new URL(result.url);
  if(!['sandbox.zarinpal.com','payment.zarinpal.com','www.zarinpal.com'].includes(url.hostname)||url.protocol!=='https:'||!url.pathname.startsWith('/pg/StartPay/'))throw new Error('نشانی درگاه معتبر نیست.');
  window.location.assign(url.href);
}
