import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { CatalogMessage, ClassCard, PlanCard, ServiceCard, TrainerCard } from "@/components/public/catalog-cards";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublicClasses, getPublicPlans, getPublicTrainers } from "@/lib/public-api";
import { principles, services } from "@/lib/public-content";

export const dynamic = "force-dynamic";

const tickerItems = ["STRONGER EVERY DAY", "MOVE WITH PURPOSE", "PROGRESS IS PERSONAL", "BUILT TO ADAPT"];

function TickerGroup({ duplicate = false }: { duplicate?: boolean }) {
  return <div className="public-ticker__group" aria-hidden={duplicate || undefined}>
    {tickerItems.map((item) => <span key={item}>{item}<i aria-hidden="true" /></span>)}
  </div>;
}

export default async function HomePage() {
  const [plans, classes, trainers] = await Promise.all([getPublicPlans(), getPublicClasses(), getPublicTrainers()]);
  const trainerNames = new Map(trainers.items.map((trainer) => [trainer.id, trainer.name]));

  return <>
    <section className="public-hero">
      <div className="public-hero__media" data-hero-media aria-hidden="true" />
      <div className="public-container public-hero__inner">
        <div className="public-hero__copy">
          <span className="public-eyebrow public-hero__eyebrow" data-hero-step><span className="public-status-dot" /> A different kind of gym</span>
          <h1 data-hero-step>BUILT TO <br className="public-hero__mobile-break" /><em>MOVE.</em><br />MADE TO <br className="public-hero__mobile-break" /><span>ADAPT.</span></h1>
          <p data-hero-step>Strength is a practice. Progress is personal. Find the space, coaching, and community to keep moving forward.</p>
          <div className="public-hero__actions" data-hero-step><Link href="/memberships" className="public-button">Find your membership <ArrowUpRight size={18} /></Link><Link href="/services" className="public-button public-button--outline">Explore what we do <ArrowUpRight size={18} /></Link></div>
          <div className="public-hero__foot" data-hero-step><span>01 / 04 — TRAIN WITH INTENT</span><a href="#discover" aria-label="Scroll to discover ADAPT"><ArrowDown size={18} /></a></div>
        </div>
        <span className="public-hero__side-note">NO FINISH LINE / JUST FORWARD</span>
      </div>
    </section>

    <div className="public-ticker" aria-label="ADAPT training values"><div className="public-ticker__track"><TickerGroup /><TickerGroup duplicate /></div></div>

    <section id="discover" className="public-section public-container public-intro"><div data-reveal><span className="public-eyebrow">The ADAPT approach</span><h2>THE WORK IS YOURS.<br /><span>THE SUPPORT IS OURS.</span></h2></div><div data-reveal><p>There is no single way to get stronger. ADAPT brings thoughtful coaching, varied training, and a welcoming community together so you can build a routine that lasts.</p><Link href="/about" className="public-text-link">Get to know ADAPT <ArrowUpRight size={17} /></Link></div></section>

    <section className="public-section public-section--panel"><div className="public-container"><SectionHeading eyebrow="01 / What we do" title="TRAINING FOR EVERY VERSION OF YOU." description="Find the kind of movement that meets you where you are." href="/services" linkLabel="All services" /><div className="public-service-grid">{services.slice(0, 4).map((service) => <ServiceCard key={service.number} service={service} />)}</div></div></section>

    <section className="public-story" aria-labelledby="public-story-title"><div className="public-container public-story__inner" data-reveal><span className="public-eyebrow">More than a workout</span><h2 id="public-story-title">SHOW UP FOR THE WORK.<br /><em>STAY FOR THE PEOPLE.</em></h2><p>Training is personal. Shared energy, thoughtful coaching, and a place to return to can make progress feel possible.</p><Link href="/about" className="public-button public-button--outline">The ADAPT approach <ArrowUpRight size={18} /></Link></div></section>

    <section className="public-section public-container"><SectionHeading eyebrow="02 / Memberships" title="A PLAN FOR YOUR NEXT STEP." description="Straightforward options for every stage of your training." href="/memberships" linkLabel="Compare memberships" />{plans.items.length ? <div className="public-plan-grid">{plans.items.slice(0, 3).map((plan, index) => <PlanCard key={plan.id} plan={plan} featured={index === 1} />)}</div> : <CatalogMessage unavailable={plans.unavailable} noun="membership plans" />}</section>

    <section className="public-section public-section--panel"><div className="public-container"><SectionHeading eyebrow="03 / Move together" title="SHOW UP. FIND YOUR FLOW." description="Discover a class, meet your coach, and make room for movement." href="/classes" linkLabel="Explore all classes" />{classes.items.length ? <div className="public-class-grid">{classes.items.slice(0, 3).map((gymClass) => <ClassCard key={gymClass.id} gymClass={gymClass} trainerName={trainerNames.get(gymClass.trainerId)} />)}</div> : <CatalogMessage unavailable={classes.unavailable} noun="classes" />}</div></section>

    <section className="public-section public-container"><SectionHeading eyebrow="04 / The people" title="GUIDANCE THAT GOES FURTHER." description="Real coaches who care about how you move and where you want to go." href="/trainers" linkLabel="Meet the team" />{trainers.items.length ? <div className="public-trainer-grid">{trainers.items.slice(0, 3).map((trainer, index) => <TrainerCard key={trainer.id} trainer={trainer} index={index} />)}</div> : <CatalogMessage unavailable={trainers.unavailable} noun="trainer profiles" />}</section>

    <section className="public-section public-principles"><div className="public-container"><SectionHeading eyebrow="The difference" title="A BETTER WAY TO BEGIN." /><div className="public-principles__grid">{principles.map((item) => <div key={item.number} data-reveal><span>{item.number}</span><MoveUpRight size={20} /><h3>{item.title}</h3><p>{item.text}</p></div>)}</div></div></section>

    <section className="public-cta public-container" data-reveal><span className="public-eyebrow">Your next move starts here</span><h2>READY TO<br /><em>BEGIN?</em></h2><p>Explore the training, people, and space that make progress possible.</p><div><Link href="/class-booking" className="public-button">Explore classes <ArrowUpRight size={18} /></Link><Link href="/contact" className="public-button public-button--outline">Talk to our team <ArrowUpRight size={18} /></Link></div></section>
  </>;
}
