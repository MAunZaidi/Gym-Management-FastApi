import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogMessage, ClassCard } from "@/components/public/catalog-cards";
import { getPublicClasses, getPublicTrainers } from "@/lib/public-api";

export const metadata: Metadata = { title: "Classes", description: "Browse ADAPT classes, training times, coaches, and class details." };
export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const [classes, trainers] = await Promise.all([getPublicClasses(), getPublicTrainers()]);
  const trainerNames = new Map(trainers.items.map((trainer) => [trainer.id, trainer.name]));
  return <><header className="public-page-header public-page-header--classes public-container" data-reveal><span className="public-eyebrow">03 / Classes</span><h1>FIND YOUR<br /><em>FLOW.</em></h1><p>A class is a chance to show up, move with intention, and leave stronger. Explore the current ADAPT schedule below.</p></header><section className="public-section public-section--panel"><div className="public-container">{classes.items.length ? <div className="public-class-grid">{classes.items.map((gymClass) => <ClassCard key={gymClass.id} gymClass={gymClass} trainerName={trainerNames.get(gymClass.trainerId)} />)}</div> : <CatalogMessage unavailable={classes.unavailable} noun="classes" />}<p className="public-catalog-note">Class capacity is the maximum group size. Live availability is not published by the current API.</p></div></section><section className="public-cta public-container" data-reveal><span className="public-eyebrow">Ready to join in?</span><h2>MAKE YOUR<br /><em>NEXT MOVE.</em></h2><p>Choose a class and see the available booking options.</p><div><Link href="/class-booking" className="public-button">Class booking <ArrowUpRight size={18} /></Link></div></section></>;
}
