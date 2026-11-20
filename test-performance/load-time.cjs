/* eslint-disable @typescript-eslint/no-require-imports -- Node-only harness transpiles and executes the existing TS mapper. */
const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),{performance}=require('node:perf_hooks'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/lib/use-driver-feed.ts'),'utf8');
function load(source){const exports={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:()=>({}),Intl,Date});return exports.toLoad;}
const current=load(source),previous=load(source.replace('Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }) : loadDateFormatter.format(createdAt)','new Date(request.createdAt).toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })'));
const row={id:'test',service:'REPAIR',status:'PENDING',vehicleName:'Test',originLat:35.7,originLng:51.4,priceToman:800000,createdAt:'2026-11-20T08:00:00Z'};
test('actual driver offer mapping keeps every field and exact Persian time across timezones, DST, year boundaries and invalid dates',()=>{
 const dates=['invalid','',null,undefined,'0001-01-01T00:00:00Z','2024-02-29T23:59:59Z','2021-03-21T19:59:59Z','2021-03-21T20:30:00Z'];for(let i=0;i<250;i++)dates.push(new Date(Date.UTC(2018+i%12,i%12,1+i%28,i%24,i%60,i%60)).toISOString());
 for(const createdAt of dates)assert.equal(JSON.stringify(current({...row,createdAt})),JSON.stringify(previous({...row,createdAt})),String(createdAt));
});
if(process.argv.includes('--benchmark')){const before=[],after=[];for(let s=0;s<7;s++)for(const [values,fn]of [[before,previous],[after,current]]){const start=performance.now();for(let i=0;i<1000;i++)fn(row);values.push(performance.now()-start);}const median=a=>[...a].sort((a,b)=>a-b)[3];console.log(JSON.stringify({loadsPerSample:1000,beforeMs:before,afterMs:after,beforeMedianMs:median(before),afterMedianMs:median(after)},null,2));}
