"use client";
import "./upload-controls.css";
import {useRef,useState} from 'react';
export function OrangeUpload({label,onPick,disabled=false}:{label:string;onPick:(file:File|null)=>void;disabled?:boolean}){const input=useRef<HTMLInputElement>(null),[name,setName]=useState('');return <div className="orange-upload"><input hidden ref={input} type="file" aria-label={`بارگذاری ${label}`} accept="image/jpeg,image/png" disabled={disabled} onChange={e=>{const file=e.target.files?.[0]||null;setName(file?.name||'');onPick(file);e.target.value='';}}/><button type="button" className="primary-button" disabled={disabled} onClick={()=>input.current?.click()}>بارگذاری {label}</button>{name&&<small>{name}</small>}</div>;}
