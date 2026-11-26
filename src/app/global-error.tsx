"use client";
import {AppFailure} from '@/components/AppFailure';
export default function GlobalError(){return <html lang="fa" dir="rtl"><body style={{margin:0}}><AppFailure retry={()=>window.location.reload()}/></body></html>;}
