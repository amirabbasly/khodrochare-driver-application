"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";
import {
  Avatar,
  formatToman,
  PageTitle,
  seedPosts,
  type DriverPost,
} from "@/components/driver/shared";

function HallPostCard({
  post,
  mine,
  onTake,
  onComplete,
}: {
  post: DriverPost;
  mine: boolean;
  onTake: () => void;
  onComplete: () => void;
}) {
  return (
    <article className={`hall-post${mine ? " is-mine" : ""}`} aria-label={`بار ${post.author}`}>
      <header className="hall-post-head">
        <Avatar name={post.author} tone={post.tone} />
        <div className="hall-post-author">
          <strong>{post.author}</strong>
          <small>{post.time}</small>
        </div>
        {mine
          ? <span className="hall-mine-badge"><Icon name="user" size={11} /> بار شما</span>
          : <span className="hall-free-badge"><i /> بار آزاد</span>}
      </header>

      <p className="hall-post-note">{post.note}</p>

      <div className="hall-post-route">
        <span className="hall-route-stop"><i className="route-dot route-dot--from" /><span><small>مبدأ</small><b>{post.from}</b></span></span>
        <span className="hall-route-line"><Icon name="arrow-left" size={13} /></span>
        <span className="hall-route-stop"><i className="route-dot route-dot--to" /><span><small>مقصد</small><b>{post.to}</b></span></span>
        <span className="hall-post-price">{formatToman(post.price)}</span>
      </div>

      <div className="hall-post-meta">
        <span><Icon name="car" size={12} /> {post.car}</span>
        <span><Icon name="clock" size={12} /> {post.when}</span>
        <span><Icon name="briefcase" size={12} /> {post.weight}</span>
      </div>

      <footer className="hall-post-foot">
        {mine ? (
          <button className="hall-complete" type="button" onClick={onComplete}>
            <Icon name="check" size={15} /> بار تکمیل شد
          </button>
        ) : (
          <button className="hall-take" type="button" onClick={onTake}>
            تأیید بار <Icon name="arrow-left" size={14} />
          </button>
        )}
      </footer>
    </article>
  );
}

export function IranShahrView({
  userName,
  onBack,
  onToast,
  onTakeLoad,
}: {
  userName: string;
  onBack: () => void;
  onToast: (message: string) => void;
  onTakeLoad: (post: DriverPost) => void;
}) {
  const [posts, setPosts] = useState<DriverPost[]>(seedPosts);
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [car, setCar] = useState("");
  const [price, setPrice] = useState("");

  const myPosts = posts.filter((post) => post.author === userName).length;

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim() || !from.trim() || !to.trim()) {
      onToast("برای انتشار بار، توضیح، مبدأ و مقصد را کامل کن.");
      return;
    }
    const newPost: DriverPost = {
      id: `post-${Date.now()}`,
      author: userName,
      role: "سفیر خودرو چاره",
      tone: 4,
      time: "همین حالا",
      car: car.trim() || "خودروی امدادی",
      from: from.trim(),
      to: to.trim(),
      price: Number(price.replace(/\D/g, "")) || 0,
      when: "به‌زودی",
      weight: "بار آزاد",
      note: note.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };
    setPosts((current) => [newPost, ...current]);
    setNote("");
    setFrom("");
    setTo("");
    setCar("");
    setPrice("");
    onToast("بار آزادت در تالار ایرانشهر منتشر شد.");
  }

  function completePost(post: DriverPost) {
    setPosts((current) => current.filter((item) => item.id !== post.id));
    onToast("بار تکمیل شد و از تالار حذف شد.");
  }

  return (
    <div className="subpage">
      <PageTitle
        title="تالار ایرانشهر"
        subtitle="بار آزادت را منتشر کن و بارهای ناوگان را ببین"
        onBack={onBack}
        action={<span className="shahr-live"><i /> {posts.length.toLocaleString("fa-IR")} بار در تالار</span>}
      />

      <form className="hall-composer" onSubmit={publish}>
        <div className="composer-head">
          <Avatar name={userName} tone={4} />
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={`${userName.split(" ")[0]} جان، بار آزادت رو برای بچه‌های ناوگان بنویس…`}
            aria-label="متن بار آزاد"
            rows={2}
            maxLength={280}
          />
        </div>
        <div className="composer-fields">
          <label><Icon name="pin" size={13} /><input value={from} onChange={(event) => setFrom(event.target.value)} placeholder="مبدأ" aria-label="مبدأ" /></label>
          <label><Icon name="location" size={13} /><input value={to} onChange={(event) => setTo(event.target.value)} placeholder="مقصد" aria-label="مقصد" /></label>
          <label><Icon name="car" size={13} /><input value={car} onChange={(event) => setCar(event.target.value)} placeholder="نوع خودرو" aria-label="نوع خودرو" /></label>
          <label><Icon name="wallet" size={13} /><input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="کرایه (تومان)" inputMode="numeric" aria-label="کرایه" /></label>
        </div>
        <div className="composer-foot">
          <span><Icon name="shield" size={13} /> فقط بارهای تأییدشدهٔ ناوگان</span>
          <button type="submit">انتشار در تالار <Icon name="send" size={14} /></button>
        </div>
      </form>

      <div className="hall-board" aria-live="polite">
        <div className="hall-board-head">
          <strong>بارهای ناوگان</strong>
          <span>{myPosts.toLocaleString("fa-IR")} بار از شما · {posts.length.toLocaleString("fa-IR")} بار در مجموع</span>
        </div>

        {posts.length === 0 ? (
          <div className="hall-empty">
            <span><Icon name="route" size={22} /></span>
            <strong>هنوز باری در تالار نیست</strong>
            <p>اولین بار آزاد ناوگان را از فرم بالا منتشر کن.</p>
          </div>
        ) : (
          <div className="hall-list">
            {posts.map((post) => (
              <HallPostCard
                key={post.id}
                post={post}
                mine={post.author === userName}
                onTake={() => onTakeLoad(post)}
                onComplete={() => completePost(post)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
