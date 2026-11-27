// Runs before React so a missing bootstrap chunk can also recover after a deploy.
// Only failed code loads qualify; API errors and form submissions are never retried.
export const chunkRecoveryScript = `(()=>{
let scheduled=false;
function recover(){
 if(scheduled||navigator.onLine===false)return;
 try{const key='khodrochare:chunk-recovery',now=Date.now(),last=Number(sessionStorage.getItem(key)||0);if(now-last<60000)return;sessionStorage.setItem(key,String(now));}catch{return;}
 scheduled=true;setTimeout(()=>location.reload(),0);
}
addEventListener('error',event=>{
 const element=event.target;
 if(element instanceof HTMLScriptElement&&element.src){try{const url=new URL(element.src,location.href);if(url.origin===location.origin&&url.pathname.startsWith('/_next/static/'))recover();}catch{}}
},true);
addEventListener('unhandledrejection',event=>{
 const message=String(event.reason?.message||event.reason||'');
 if(/ChunkLoadError|Loading (?:CSS )?chunk .+failed|Failed to load chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(message))recover();
});
})();`;
