import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogMessage, TrainerCard } from "@/components/public/catalog-cards";
import { getPublicClasses, getPublicTrainers } from "@/lib/public-api";

export const metadata: Metadata = { title: "Trainers", description: "Meet the active coaches and trainers at ADAPT." };
export const dynamic = "force-dynamic";

export default async function TrainersPage() {
  const [trainers, classes] = await Promise.all([getPublicTrainers(), getPublicClasses()]);
  return <><header className="public-page-header public-page-header--trainers public-container" data-reveal><span className="public-eyebrow">04 / Trainers</span><h1>PEOPLE WHO<br /><em>MOVE YOU.</em></h1><p>Thoughtful coaching makes a difference. Get to know the people who guide the work at ADAPT.</p></header><section className="public-section public-section--panel"><div className="public-container">{trainers.items.length ? <div className="public-trainer-grid">{trainers.items.map((trainer, index) => <div key={trainer.id}><TrainerCard trainer={trainer} index={index} />{classes.items.some((gymClass) => gymClass.trainerId === trainer.id) ? <div className="public-trainer-classes"><span className="public-eyebrow">Classes</span><p>{classes.items.filter((gymClass) => gymClass.trainerId === trainer.id).map((gymClass) => gymClass.name).join(" · ")}</p></div> : null}</div>)}</div> : <CatalogMessage unavailable={trainers.unavailable} noun="trainer profiles" />}</div></section><section className="public-cta public-container" data-reveal><span className="public-eyebrow">Find your training style</span><h2>THE RIGHT COACH.<br /><em>THE RIGHT START.</em></h2><p>Explore classes and find a session that fits.</p><div><Link href="/classes" className="public-button">Explore classes <ArrowUpRight size={18} /></Link></div></section></>;
}
