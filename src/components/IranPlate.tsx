"use client";
import Image from 'next/image';
import { useState } from 'react';
import { latinDigits } from '@/lib/api';
import './iran-plate.css';
export function IranPlate({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const match = latinDigits(value).match(/^(\d{2})\s*([آ-ی])\s*(\d{3})\s*-?\s*(\d{2})$/);
  const [parts, setParts] = useState({ two: match?.[1] || '', letter: match?.[2] || 'ب', three: match?.[3] || '', code: match?.[4] || '' });
  function change(key: keyof typeof parts, raw: string) {
    const next = { ...parts, [key]: key === 'letter' ? raw : latinDigits(raw).replace(/\D/g, '').slice(0, key === 'three' ? 3 : 2) };
    setParts(next);
    onChange(/^\d{2}$/.test(next.two) && /^\d{3}$/.test(next.three) && /^\d{2}$/.test(next.code) ? `${next.two} ${next.letter} ${next.three} - ${next.code}` : '');
  }
  return <fieldset className="iran-plate-field"><legend>پلاک خودرو</legend><div className="iran-plate-input" dir="ltr">
    <span className="iran-plate-band"><Image src="/iran-flag.svg" width={24} height={15} alt="پرچم ایران" /><small>I.R.<br/>IRAN</small></span>
    <input aria-label="دو رقم پلاک" inputMode="numeric" autoComplete="off" placeholder="۱۲" value={parts.two} onChange={e => change('two', e.target.value)} pattern="[0-9]{2}" maxLength={2} required />
    <select aria-label="حرف پلاک" value={parts.letter} onChange={e => change('letter', e.target.value)}>{['ب','ج','د','س','ص','ط','ق','ل','م','ن','و','ه','ی','ت','ع','ف','ک'].map(letter => <option key={letter}>{letter}</option>)}</select>
    <input aria-label="سه رقم پلاک" inputMode="numeric" autoComplete="off" placeholder="۳۴۵" value={parts.three} onChange={e => change('three', e.target.value)} pattern="[0-9]{3}" maxLength={3} required />
    <label className="iran-plate-code"><span>ایران</span><input aria-label="کد ایران پلاک" inputMode="numeric" autoComplete="off" placeholder="۶۷" value={parts.code} onChange={e => change('code', e.target.value)} pattern="[0-9]{2}" maxLength={2} required /></label>
  </div><small>دو رقم، حرف، سه رقم و کد دو رقمی ایران را وارد کنید.</small></fieldset>;
}
