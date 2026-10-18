"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";
import {
  Avatar,
  digitFa,
  formatToman,
  PageTitle,
  seedConversations,
  seedPosts,
  type Conversation,
  type DriverPost,
} from "@/components/driver/shared";

type Tab = "feed" | "chat";

function PostCard({
  post,
  onLike,
  onTake,
  onToast,
}: {
  post: DriverPost;
  onLike: () => void;
  onTake: () => void;
  onToast: (message: string) => void;
}) {
  return (
    <article className="feed-post">
      <header className="post-head">
        <Avatar name={post.author} tone={post.tone} />
        <div className="post-author">
          <strong>{post.author}</strong>
          <small><Icon name="shield" size={11} /> {post.role}</small>
        </div>
        <span className="post-time">{post.time}</span>
        <button className="post-more" type="button" aria-label="گزینه‌های بیشتر" onClick={() => onToast("گزینه‌های بیشتر پست به‌زودی فعال می‌شود")}>
          <Icon name="more" size={18} />
        </button>
      </header>

      <p className="post-note">{post.note}</p>

      <div className="post-route">
        <span className="post-route-stop"><i className="route-dot route-dot--from" />{post.from}</span>
        <span className="post-route-line"><Icon name="arrow-left" size={13} /></span>
        <span className="post-route-stop"><i className="route-dot route-dot--to" />{post.to}</span>
        <span className="post-price">{formatToman(post.price)}</span>
      </div>

      <div className="post-chips">
        <span><Icon name="car" size={12} /> {post.car}</span>
        <span><Icon name="clock" size={12} /> {post.when}</span>
        <span><Icon name="briefcase" size={12} /> {post.weight}</span>
      </div>

      {post.media && (
        <div className="post-media">
          <Image src={post.media} alt="تصویر بار آزاد" fill sizes="(max-width: 900px) 100vw, 640px" className="post-media-image" />
          <span className="post-media-tag"><Icon name="route" size={12} /> بار آزاد ناوگان</span>
        </div>
      )}

      <div className="post-actions">
        <button className={`post-action${post.liked ? " is-liked" : ""}`} type="button" onClick={onLike} aria-pressed={post.liked}>
          <Icon name="star" size={16} /> {digitFa(String(post.likes))}
        </button>
        <button className="post-action" type="button" onClick={() => onToast("گفت‌وگو زیر پست در نسخهٔ کامل فعال می‌شود")}>
          <Icon name="chat" size={16} /> {digitFa(String(post.comments))}
        </button>
        <button className="post-action" type="button" onClick={() => onToast("لینک بار برای همکارانت آمادهٔ ارسال شد")}>
          <Icon name="send" size={16} /> {digitFa(String(post.shares))}
        </button>
        <button className="post-take" type="button" onClick={onTake}>
          تأیید بار <Icon name="arrow-left" size={14} />
        </button>
      </div>
    </article>
  );
}

function FeedTab({ userName, onToast, onTakeLoad }: { userName: string; onToast: (message: string) => void; onTakeLoad: (post: DriverPost) => void }) {
  const [posts, setPosts] = useState<DriverPost[]>(seedPosts);
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [car, setCar] = useState("");
  const [price, setPrice] = useState("");

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

  function toggleLike(id: string) {
    setPosts((current) => current.map((post) => post.id === id
      ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
      : post));
  }

  return (
    <div className="shahr-feed">
      <form className="shahr-composer" onSubmit={publish}>
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

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => toggleLike(post.id)}
            onTake={() => onTakeLoad(post)}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  );
}

function ChatTab({ onToast }: { onToast: (message: string) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [draft, setDraft] = useState("");
  const active = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];

  function openConversation(id: string) {
    setActiveId(id);
    setConversations((current) => current.map((conversation) => conversation.id === id ? { ...conversation, unread: 0 } : conversation));
    setDraft("");
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const targetId = active.id;
    setConversations((current) => current.map((conversation) => conversation.id === targetId
      ? {
        ...conversation,
        last: text,
        time: "الان",
        messages: [...conversation.messages, { from: "me", text, time: "الان" }],
      }
      : conversation));
    setDraft("");
    window.setTimeout(() => {
      setConversations((current) => current.map((conversation) => conversation.id === targetId
        ? {
          ...conversation,
          last: "دریافت شد، هماهنگ می‌کنم و بهت خبر می‌دم.",
          time: "الان",
          messages: [...conversation.messages, { from: "them", text: "دریافت شد، هماهنگ می‌کنم و بهت خبر می‌دم.", time: "الان" }],
        }
        : conversation));
    }, 1300);
  }

  return (
    <div className="shahr-chat">
      <aside className="conversation-panel" aria-label="گفت‌وگوها">
        <div className="conversation-head">
          <strong>گفت‌وگوها</strong>
          <span className="conversation-online"><i /> {conversations.filter((item) => item.unread > 0).length.toLocaleString("fa-IR")} پیام جدید</span>
        </div>
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item${conversation.id === active.id ? " is-active" : ""}`}
              onClick={() => openConversation(conversation.id)}
            >
              <Avatar name={conversation.name} tone={conversation.tone} />
              <span className="conversation-copy">
                <span className="conversation-title"><strong>{conversation.name}</strong><small>{conversation.time}</small></span>
                <span className="conversation-role">{conversation.role}</span>
                <span className="conversation-last">{conversation.last}</span>
              </span>
              {conversation.unread > 0 && <span className="conversation-unread">{digitFa(String(conversation.unread))}</span>}
            </button>
          ))}
        </div>
        <button className="conversation-new" type="button" onClick={() => onToast("گفت‌وگوی جدید با همکاران به‌زودی فعال می‌شود")}>
          <Icon name="plus" size={15} /> گفت‌وگوی جدید
        </button>
      </aside>

      <section className="chat-thread" aria-label={`گفت‌وگو با ${active.name}`}>
        <header className="chat-thread-head">
          <Avatar name={active.name} tone={active.tone} size="sm" />
          <div>
            <strong>{active.name}</strong>
            <small><i /> آنلاین · {active.role}</small>
          </div>
          <div className="chat-thread-actions">
            <button type="button" onClick={() => onToast("تماس با همکار در نسخهٔ کامل فعال می‌شود")} aria-label="تماس"><Icon name="phone" size={16} /></button>
            <button type="button" onClick={() => onToast("اطلاعات پروفایل همکار نمایش داده می‌شود")} aria-label="پروفایل"><Icon name="user" size={16} /></button>
          </div>
        </header>

        <div className="chat-thread-body">
          {active.messages.map((message, index) => (
            <div key={`${active.id}-${index}`} className={`chat-bubble-row chat-bubble-row--${message.from}`}>
              {message.from === "system"
                ? <span className="chat-system">{message.text}</span>
                : (
                  <>
                    {message.from === "them" && <Avatar name={active.name} tone={active.tone} size="sm" />}
                    <div className="chat-bubble-new">
                      <p>{message.text}</p>
                      <small>{message.time}</small>
                    </div>
                  </>
                )}
            </div>
          ))}
        </div>

        <form className="chat-compose" onSubmit={send}>
          <button type="button" aria-label="پیوست" onClick={() => onToast("ارسال تصویر در نسخهٔ کامل فعال می‌شود")}><Icon name="plus" size={18} /></button>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="پیامت را بنویس…" aria-label="پیام شما" />
          <button type="submit" className="chat-send" aria-label="ارسال پیام"><Icon name="send" size={17} /></button>
        </form>
      </section>
    </div>
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
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="subpage">
      <PageTitle
        title="تالار ایرانشهر"
        subtitle="شبکهٔ اجتماعی امدادگران و سفیران؛ بار آزاد، گفت‌وگو و هماهنگی"
        onBack={onBack}
        action={<span className="shahr-live"><i /> ۳۸ بار آزاد امروز</span>}
      />

      <section className="shahr-hero">
        <Image src="/slides/driver/banner-social.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 1200px" className="shahr-hero-image" priority />
        <span className="shahr-hero-veil" aria-hidden="true" />
        <div className="shahr-hero-copy">
          <span className="shahr-hero-tag"><Icon name="users" size={14} /> تالار ایرانشهر</span>
          <h2>بار آزادت را با ناوگان به اشتراک بگذار.</h2>
          <p>همان‌جا ببین، تأیید کن و با همکارت چت کن. هماهنگی، بدون تماس تلفنی.</p>
        </div>
        <div className="shahr-hero-stats">
          <span><strong>۲٬۴۰۰</strong><small>عضو ناوگان</small></span>
          <span><strong>۳۸</strong><small>بار آزاد امروز</small></span>
          <span><strong>۱۲</strong><small>گفت‌وگوی فعال</small></span>
        </div>
      </section>

      <div className="filter-tabs shahr-tabs" role="tablist" aria-label="بخش‌های تالار ایرانشهر">
        <button type="button" role="tab" aria-selected={tab === "feed"} className={tab === "feed" ? "is-active" : ""} onClick={() => setTab("feed")}>
          <Icon name="route" size={14} /> بارهای آزاد
        </button>
        <button type="button" role="tab" aria-selected={tab === "chat"} className={tab === "chat" ? "is-active" : ""} onClick={() => setTab("chat")}>
          <Icon name="chat" size={14} /> گفت‌وگو
        </button>
      </div>

      {tab === "feed"
        ? <FeedTab userName={userName} onToast={onToast} onTakeLoad={onTakeLoad} />
        : <ChatTab onToast={onToast} />}
    </div>
  );
}
