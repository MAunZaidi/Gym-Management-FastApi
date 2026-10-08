import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceCard } from "@/components/public/catalog-cards";
import { services } from "@/lib/public-content";

export const metadata: Metadata = { title: "Services", description: "Explore strength, personal coaching, group training, conditioning, mobility, and nutrition support at ADAPT." };

export default function ServicesPage() {
  return <><header className="public-page-header public-container" data-reveal><span className="public-eyebrow">01 / Services</span><h1>EVERY WAY<br />TO <em>MOVE FORWARD.</em></h1><p>Training is personal. Our services give you room to explore, build confidence, and keep showing up for yourself.</p></header><section className="public-section public-section--panel"><div className="public-container public-service-grid">{services.map((service) => <ServiceCard key={service.number} service={service} />)}</div></section><section className="public-cta public-container" data-reveal><span className="public-eyebrow">Find your fit</span><h2>LET&apos;S BUILD<br /><em>YOUR ROUTINE.</em></h2><p>Pair your goals with a membership that gives you space to grow.</p><div><Link href="/memberships" className="public-button">Explore memberships <ArrowUpRight size={18} /></Link><Link href="/contact" className="public-button public-button--outline">Ask a question <ArrowUpRight size={18} /></Link></div></section></>;
}
