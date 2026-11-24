"use client";
import {useRef,useState} from 'react';
import {api,errorMessage,updateSessionUser,type User} from '@/lib/api';
import {PendingFeatureDialog} from './PendingFeature';
export const verificationPendingText='احراز هویت شما در صف بررسی قرار دارد. اگر مشکلی در اطلاعات یا مدارک باشد، اپراتور با شماره تماس ثبت‌شده شما تماس می‌گیرد.';
export function PendingVerificationDialog({onClose}:{onClose:()=>void}){
 return <PendingFeatureDialog onClose={onClose} titleText="احراز هویت در صف بررسی" descriptionText={verificationPendingText}/>;
}
export function VerificationNotices({user}:{user:User|null}){
 const busy=useRef(false);
 const [dismissed,setDismissed]=useState<string[]>([]);
 const [error,setError]=useState('');
 const kind=user?.verificationStatus==='APPROVED'&&user.verificationNoticeSeenAt===null?'approval':user?.registrationNoticeSeenAt===null?'registration':null;
 const key=user&&kind?`${user.id}:${kind}`:'';
 if(!kind||!user||dismissed.includes(key))return null;
 async function close(){
  if(busy.current)return;busy.current=true;setError('');
  try{
   let updated=await api<User>(`/me/verification-notices/${kind}`,{method:'POST'});
   if(kind==='approval'&&updated.registrationNoticeSeenAt===null)updated=await api<User>('/me/verification-notices/registration',{method:'POST'});
   setDismissed(items=>[...items,key]);updateSessionUser(updated);window.dispatchEvent(new CustomEvent('khodrochare:user',{detail:updated}));
  }catch(e){setError(errorMessage(e));}finally{busy.current=false;}
 }
 return <PendingFeatureDialog onClose={()=>void close()} titleText={kind==='approval'?'به خانواده ۳۰ هزارنفری خودروچاره خوش آمدید':'ثبت‌نام شما با موفقیت ثبت شد'} descriptionText={(kind==='approval'?'احراز هویت شما تکمیل و تأیید شد. اکنون می‌توانید بار بگیرید و از ماژول‌ها استفاده کنید.':'ثبت‌نام شما در صف بررسی قرار دارد و تا ۲۴ ساعت آینده تأیید می‌شود. اگر مشکلی باشد، اپراتور با شماره تماس ثبت‌شده شما تماس می‌گیرد.')+(error?` ${error}؛ برای ثبت مشاهده پیام دوباره تلاش کنید.`:'')}/>;
}
