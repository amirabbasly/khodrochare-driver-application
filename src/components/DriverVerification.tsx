"use client";
import {useRouter} from 'next/navigation';
import {useAuthenticatedUser} from '@/lib/use-backend';
import {useRef,useState} from 'react';
import {api,errorMessage,updateSessionUser,type User} from '@/lib/api';
import {PendingFeatureDialog} from './PendingFeature';
export const verificationPendingText='احراز هویت شما در صف بررسی قرار دارد. اگر مشکلی در اطلاعات یا مدارک باشد، اپراتور با شماره تماس ثبت‌شده شما تماس می‌گیرد.';
export function PendingVerificationDialog({onClose,onCompleteVerification}:{onClose:()=>void;onCompleteVerification?:()=>void}){
 const user=useAuthenticatedUser(),router=useRouter();
 const correction=user?.verificationStatus==='NEEDS_CORRECTION';
 return <PendingFeatureDialog onClose={onClose} titleText={correction?'احراز هویت نیازمند اصلاح است':'احراز هویت در صف بررسی'} descriptionText={correction?(user?.verificationNote||'برای تکمیل مدارک احراز هویت به پروفایل مراجعه کنید.'):verificationPendingText} actionLabel={correction?'تکمیل احراز هویت':undefined} onConfirm={correction?()=>{onClose();if(onCompleteVerification)onCompleteVerification();else router.push('/home?view=documents');}:undefined}/>;
}
export function VerificationNotices({user,onCompleteVerification}:{user:User|null;onCompleteVerification:()=>void}){
 const busy=useRef(false);
 const [dismissed,setDismissed]=useState<string[]>([]);
 const [error,setError]=useState('');
 const kind=user?.verificationStatus==='NEEDS_CORRECTION'?'correction':user?.verificationStatus==='APPROVED'&&user.verificationNoticeSeenAt===null?'approval':user?.registrationNoticeSeenAt===null?'registration':null;
 const key=user&&kind?`${user.id}:${kind}:${kind==='correction'?(user.verificationReviewedAt||user.verificationNote||''):''}`:'';
 if(!kind||!user||dismissed.includes(key))return null;
 async function close(){
  if(kind==='correction'){setDismissed(items=>[...items,key]);return;}
  if(busy.current)return;busy.current=true;setError('');
  try{
   let updated=await api<User>(`/me/verification-notices/${kind}`,{method:'POST'});
   if(kind==='approval'&&updated.registrationNoticeSeenAt===null)updated=await api<User>('/me/verification-notices/registration',{method:'POST'});
   setDismissed(items=>[...items,key]);updateSessionUser(updated);window.dispatchEvent(new CustomEvent('khodrochare:user',{detail:updated}));
  }catch(e){setError(errorMessage(e));}finally{busy.current=false;}
 }
 if(kind==='correction')return <PendingFeatureDialog onClose={()=>void close()} titleText="احراز هویت نیازمند اصلاح است" descriptionText={user.verificationNote||'مدارک احراز هویت را تکمیل کنید؛ در صورت نیاز با پشتیبانی تماس بگیرید.'} actionLabel="تکمیل احراز هویت" onConfirm={()=>{void close();onCompleteVerification();}}/>;
 return <PendingFeatureDialog onClose={()=>void close()} titleText={kind==='approval'?'به خانواده ۳۰ هزارنفری خودروچاره خوش آمدید':'ثبت‌نام شما با موفقیت ثبت شد'} descriptionText={(kind==='approval'?'احراز هویت شما تکمیل و تأیید شد. اکنون می‌توانید بار بگیرید و از ماژول‌ها استفاده کنید.':'ثبت‌نام شما در صف بررسی قرار دارد و تا ۲۴ ساعت آینده تأیید می‌شود. اگر مشکلی باشد، اپراتور با شماره تماس ثبت‌شده شما تماس می‌گیرد.')+(error?` ${error}؛ برای ثبت مشاهده پیام دوباره تلاش کنید.`:'')}/>;
}
