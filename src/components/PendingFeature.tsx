"use client";
import {useEffect,useId,useRef} from "react";
import {Icon} from "./Icons";
import "./pending-feature.css";

export function PendingFeatureDialog({onClose,titleText,descriptionText}: {onClose: () => void;titleText?:string;descriptionText?:string}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId(), description = useId();
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({preventScroll: true});
    };
  }, []);
  return <dialog ref={dialog} className="pending-feature-dialog" aria-labelledby={title} aria-describedby={description}
    onCancel={event => {event.preventDefault(); onClose();}}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    <button className="pending-feature-close" type="button" onClick={onClose} aria-label="بستن پنجره"><Icon name="close" size={20}/></button>
    <span className="pending-feature-icon" aria-hidden="true"><Icon name="clock" size={30}/></span>
    <h2 id={title}>{titleText||"ماژول در حال تکمیل است"}</h2>
    <p id={description}>{descriptionText||"این بخش به‌زودی فعال می‌شود."}</p>
    <button className="pending-feature-confirm" type="button" onClick={onClose}>متوجه شدم</button>
  </dialog>;
}
