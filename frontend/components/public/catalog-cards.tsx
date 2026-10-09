import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, Clock3, UsersRound } from "lucide-react";
import type { PublicClass, PublicPlan, PublicTrainer } from "@/lib/public-api";
import { formatClassTime } from "@/lib/public-api";
import type { services } from "@/lib/public-content";

const trainerPhotos: Record<string, { src: string; position: string }> = {
  "alex carter": { src: "/images/trainers/alex-carter.jpg", position: "center 34%" },
  "maya patel": { src: "/images/trainers/maya-patel.jpg", position: "center 40%" },
  "noah kim": { src: "/images/trainers/noah-kim.jpg", position: "center 35%" }
};

const planPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const Icon = service.icon;
  return <Link href={`/contact?service=${encodeURIComponent(service.name)}`} className={`public-service-card ${service.image ? "" : "public-service-card--text-only"}`} aria-label={`Ask about ${service.name}`} data-scroll="card">
    {service.image ? <div className="public-service-card__visual" aria-hidden="true"><Image src={service.image} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 25vw" style={{ objectPosition: service.imagePosition }} /></div> : null}
    <div className="public-service-card__top"><span>{service.number} / 07</span><Icon size={26} strokeWidth={1.4} aria-hidden="true" /></div>
    <div className="public-service-card__content"><h3>{service.name}</h3><p>{service.detail}</p></div>
    <ArrowUpRight size={20} className="public-service-card__arrow" aria-hidden="true" />
  </Link>;
}

export function PlanCard({ plan, featured = false }: { plan: PublicPlan; featured?: boolean }) {
  return <article className={`public-plan-card ${featured ? "public-plan-card--featured" : ""}`} data-scroll="card">
    <div className="public-plan-card__top"><span className="public-eyebrow">Membership / {String(plan.id).padStart(2, "0")}</span>{featured ? <span className="public-plan-card__tag">Most selected</span> : null}</div>
    <h3>{plan.name}</h3><p className="public-plan-card__description">{plan.description || "A way to train that fits your goals."}</p>
    <div className="public-plan-card__price"><strong>{planPriceFormatter.format(plan.price)}</strong><span>plan price<br />{plan.duration}</span></div>
    <div className="public-plan-card__divider" />
    <p className="public-plan-card__included"><Check size={16} aria-hidden="true" /> Plan details confirmed with our team</p>
    <Link href={`/contact?plan=${encodeURIComponent(plan.name)}`} className="public-button public-button--outline">Enquire about this plan <ArrowUpRight size={17} /></Link>
  </article>;
}

export function ClassCard({ gymClass, trainerName }: { gymClass: PublicClass; trainerName?: string }) {
  return <article className="public-class-card" data-scroll="card">
    <div className="public-class-card__top"><span className="public-eyebrow">Class / {String(gymClass.id).padStart(2, "0")}</span><ArrowUpRight size={19} aria-hidden="true" /></div>
    <h3>{gymClass.name}</h3><p className="public-class-card__trainer">{trainerName ? `With ${trainerName}` : "Coach to be confirmed"}</p>
    <div className="public-class-card__meta"><span><Clock3 size={16} /> {gymClass.day} · {formatClassTime(gymClass.startTime)}</span><span>{gymClass.durationMinutes} min</span><span><UsersRound size={16} /> Capacity {gymClass.capacity}</span></div>
    <Link className="public-text-link" href={`/class-booking?class=${gymClass.id}`}>View booking options <ArrowUpRight size={17} /></Link>
  </article>;
}

export function TrainerCard({ trainer, index }: { trainer: PublicTrainer; index: number }) {
  const photo = trainerPhotos[trainer.name.trim().replace(/\s+/g, " ").toLowerCase()];
  const initials = trainer.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "A";
  return <article className="public-trainer-card" data-scroll="card"><div className="public-trainer-card__portrait">{photo ? <Image src={photo.src} alt={`Portrait of ${trainer.name}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" className="public-trainer-card__image" style={{ objectPosition: photo.position }} /> : <div className="public-trainer-card__initials" aria-hidden="true">{initials}</div>}<span className="public-trainer-card__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div><div className="public-trainer-card__info"><span className="public-eyebrow">Coach / {String(index + 1).padStart(2, "0")}</span><h3>{trainer.name}</h3><p>{trainer.specialization}</p></div></article>;
}

export function CatalogMessage({ unavailable, noun }: { unavailable: boolean; noun: string }) {
  return <div className="public-catalog-message" role="status" data-scroll="card"><span className="public-eyebrow">{unavailable ? "Temporarily unavailable" : "Coming soon"}</span><p>{unavailable ? `We can’t load ${noun} right now. Please check back shortly or contact our team.` : `There are no ${noun} published yet. Check back soon.`}</p><Link className="public-text-link" href="/contact">Contact ADAPT <ArrowUpRight size={17} /></Link></div>;
}
