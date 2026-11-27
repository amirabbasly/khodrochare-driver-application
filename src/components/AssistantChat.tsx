"use client";
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {api,errorMessage} from '@/lib/api';
import {Icon} from './Icons';
import {AiMascot} from './Artwork';
import './assistant-chat.css';

const unavailableMessage='دستیار موقتاً در دسترس نیست؛ لطفاً از گزینه تماس با پشتیبانی استفاده کنید.';
type Message={role:'user'|'assistant';content:string};
type Line=Message&{id:number};
function historyFor(lines:Line[],question:string):Message[]{
  const messages:Message[]=[...lines.filter(line=>line.id!==0).map(({role,content})=>({role,content})),{role:'user' as const,content:question}].slice(-20);
  while(messages.length>1&&(messages.reduce((n,m)=>n+m.content.length,0)>20000||new TextEncoder().encode(JSON.stringify({messages})).length>45000))messages.shift();
  return messages;
}

export function AssistantChat({open,setOpen,title='چاره‌یار',subtitle='راهنمای خودرو و خدمات خودرو چاره'}:{open:boolean;setOpen:(value:boolean)=>void;title?:string;subtitle?:string}){
  const [text,setText]=useState('');
  const [available,setAvailable]=useState<boolean|null>(null);
  const [messages,setMessages]=useState<Line[]>([{id:0,role:'assistant',content:'سلام! من دستیار تخصصی خودرو چاره هستم. درباره خودرو یا خدمات چه سؤالی دارید؟'}]);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[retryHistory,setRetryHistory]=useState<Message[]|null>(null),[phone,setPhone]=useState('09123022064');
  const count=useRef(1),sending=useRef(false),controller=useRef<AbortController|null>(null),list=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null);
  useEffect(()=>()=>controller.current?.abort(),[]);
  useEffect(()=>{
    if(!open)return;
    const c=new AbortController();
    void api<{supportPhone:string;enabled?:boolean}>('/assistant/config',{signal:c.signal}).then(data=>{if(!c.signal.aborted){if(/^0\d{7,14}$/.test(data.supportPhone))setPhone(data.supportPhone);setAvailable(data.enabled!==false);if(data.enabled===false)setError(unavailableMessage);else setError(current=>current===unavailableMessage?'':current);}}).catch(()=>{});
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    input.current?.focus({preventScroll:true});
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!document.querySelector('dialog[open]'))setOpen(false);};
    document.addEventListener('keydown',key);
    return()=>{c.abort();document.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[open,setOpen]);
  useEffect(()=>{if(list.current)list.current.scrollTop=list.current.scrollHeight;},[messages,busy,open]);
  async function complete(history:Message[]){
    if(sending.current||available===false)return;
    sending.current=true;setBusy(true);setError('');setRetryHistory(null);
    const c=new AbortController();controller.current=c;
    try{
      const result=await api<{reply:string}>('/assistant/chat',{method:'POST',body:{messages:history},signal:c.signal,timeoutMs:35000});
      if(typeof result.reply!=='string'||!result.reply.trim())throw new Error('پاسخی دریافت نشد؛ دوباره تلاش کنید.');
      setMessages(rows=>[...rows.slice(-99),{id:count.current++,role:'assistant',content:result.reply}]);
    }catch(e){if(!c.signal.aborted){setError(errorMessage(e));setRetryHistory(history);}}
    finally{sending.current=false;if(!c.signal.aborted)setBusy(false);}
  }
  function send(event:FormEvent){
    event.preventDefault();const question=text.trim();if(!question||sending.current||available===false)return;
    const history=historyFor(messages,question);
    setMessages(rows=>[...rows.slice(-99),{id:count.current++,role:'user',content:question}]);setText('');void complete(history);
  }
  return <>
    {open&&<section className="chat-window assistant-chat-window" role="dialog" aria-label="گفت‌وگو با چاره‌یار">
      <div className="chat-header"><span className="chat-avatar"><span>AI</span></span><div><strong>{title}</strong><small>{subtitle}</small></div><button type="button" onClick={()=>setOpen(false)} aria-label="بستن گفت‌وگو"><Icon name="close" size={19}/></button></div>
      <div className="chat-messages" ref={list} role="log" aria-live="polite">{messages.map(message=><p key={message.id} className={`chat-bubble${message.role==='user'?' chat-bubble--user':''}`}>{message.content}</p>)}{busy&&<p className="assistant-thinking" role="status">در حال دریافت پاسخ…</p>}</div>
      {error&&<div className="assistant-error"><p role="alert">{error}</p>{retryHistory&&<button type="button" disabled={busy||available===false} onClick={()=>void complete(retryHistory)}>تلاش دوباره</button>}</div>}
      <form className="chat-input-row" onSubmit={send}><input ref={input} value={text} onChange={event=>setText(event.target.value)} maxLength={4000} disabled={busy||available===false} placeholder="پرسشت درباره خودرو…" aria-label="پیام شما"/><button type="submit" disabled={busy||available===false||!text.trim()} aria-label="ارسال پیام"><Icon name="send" size={17}/></button></form>
      <div className="assistant-footer"><span>راهنمایی هوش مصنوعی</span><a href={`tel:${phone}`}><span>تماس با پشتیبانی</span> <b dir="ltr">{phone}</b></a></div>
    </section>}
    <button className={`ai-fab${open?' ai-fab--open':''}`} type="button" onClick={()=>setOpen(!open)} aria-label={open?'بستن چاره‌یار':'گفت‌وگو با هوش مصنوعی'} aria-expanded={open}><span className="ai-fab-mascot"><AiMascot/></span><span className="ai-fab-copy">چاره‌یار <small>راهنمای هوشمند خودرو</small></span>{open&&<Icon name="close" size={18}/>}</button>
  </>;
}
