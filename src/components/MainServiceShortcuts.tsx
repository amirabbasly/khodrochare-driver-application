"use client";
import {Icon} from './Icons';
import './main-service-shortcuts.css';
export function MainServiceShortcuts({onImport,onSell,onMarket,sellHref}:{onImport:()=>void;onSell?:()=>void;onMarket:()=>void;sellHref?:string}){
 return <div className="main-service-shortcuts" aria-label="خدمات اصلی تکمیلی"><button type="button" onClick={onImport} aria-haspopup="dialog"><Icon name="car" size={24}/><strong>واردات خودرو</strong></button><button type="button" onClick={onImport} aria-haspopup="dialog"><Icon name="market" size={24}/><strong>واردات قطعات خاص</strong></button>{sellHref?<a href={sellHref} target="_blank" rel="noreferrer"><Icon name="auction" size={24}/><strong>فروش خودرو</strong></a>:<button type="button" onClick={onSell}><Icon name="auction" size={24}/><strong>فروش خودرو</strong></button>}<button type="button" onClick={onMarket}><Icon name="market" size={24}/><strong>جمعه بازار</strong></button></div>;
}
