"use client";
import {AppFailure} from '@/components/AppFailure';
export default function ErrorPage({retry}:{error:Error&{digest?:string};retry:()=>void}){return <AppFailure retry={retry}/>;}
