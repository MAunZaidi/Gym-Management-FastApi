"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Clock3, UsersRound } from "lucide-react";
import type { PublicClass, PublicTrainer } from "@/lib/public-api";
import { formatClassTime } from "@/lib/public-api";

export function BookingExperience({ classes, trainers, initialClassId }: { classes: PublicClass[]; trainers: PublicTrainer[]; initialClassId?: number }) {
  const [selectedId, setSelectedId] = useState<number | null>(initialClassId && classes.some((item) => item.id === initialClassId) ? initialClassId : null);
  const selected = useMemo(() => classes.find((item) => item.id === selectedId), [classes, selectedId]);
  const trainer = trainers.find((item) => item.id === selected?.trainerId);

  return <div className="public-booking">
    <div className="public-booking__steps" aria-label="Booking steps"><span className="is-active">01 <b>Explore</b></span><span className={selected ? "is-active" : ""}>02 <b>Choose</b></span><span>03 <b>Confirm with ADAPT</b></span></div>
    {selected ? <div className="public-booking__selection" role="region" aria-label="Selected class"><button type="button" onClick={() => setSelectedId(null)} className="public-text-link"><ArrowLeft size={17} /> All classes</button><div className="public-booking__selection-grid"><div><span className="public-eyebrow">Your selected class</span><h2>{selected.name}</h2><p>{trainer ? `Led by ${trainer.name}` : "Coach to be confirmed"}</p></div><div className="public-booking__facts"><span><CalendarDays size={18} /> {selected.day}</span><span><Clock3 size={18} /> {formatClassTime(selected.startTime)} · {selected.durationMinutes} min</span><span><UsersRound size={18} /> Group capacity {selected.capacity}</span></div></div><div className="public-booking__notice"><Check size={20} /><div><strong>Ready for the next step?</strong><p>Online booking is not available through the public site yet. ADAPT staff can confirm availability and register you for this class.</p><Link href={`/contact?class=${encodeURIComponent(selected.name)}`} className="public-button">Ask about this class <ArrowUpRight size={17} /></Link></div></div></div> : <div><div className="public-section-heading"><div><span className="public-eyebrow">Select a session</span><h2>FIND YOUR NEXT CLASS.</h2><p>Choose a class to see its schedule and the next step.</p></div></div><div className="public-class-grid">{classes.map((gymClass) => <button className="public-booking__class" key={gymClass.id} type="button" onClick={() => setSelectedId(gymClass.id)}><span className="public-eyebrow">Class / {String(gymClass.id).padStart(2, "0")}</span><h3>{gymClass.name}</h3><span>{gymClass.day} · {formatClassTime(gymClass.startTime)}</span><span>{gymClass.durationMinutes} min · Capacity {gymClass.capacity}</span><span className="public-text-link">Select class <ArrowUpRight size={17} /></span></button>)}</div></div>}
  </div>;
}
