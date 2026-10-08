import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogMessage, PlanCard } from "@/components/public/catalog-cards";
import { getPublicPlans } from "@/lib/public-api";

export const metadata: Metadata = { title: "Memberships", description: "Compare current ADAPT membership plans and find a training rhythm that fits." };
export const dynamic = "force-dynamic";

export default async function MembershipsPage() {
  const plans = await getPublicPlans();
  return <><header className="public-page-header public-container" data-reveal><span className="public-eyebrow">02 / Memberships</span><h1>YOUR PACE.<br /><em>YOUR PLAN.</em></h1><p>Make space for progress with a membership that fits your training goals. Current plans come directly from ADAPT.</p></header><section className="public-section public-section--panel"><div className="public-container">{plans.items.length ? <div className="public-plan-grid">{plans.items.map((plan, index) => <PlanCard key={plan.id} plan={plan} featured={index === 1} />)}</div> : <CatalogMessage unavailable={plans.unavailable} noun="membership plans" />}<p className="public-catalog-note">Dollar prices are shown as provided by ADAPT. Ask our team to confirm plan inclusions and enrollment details.</p></div></section><section className="public-cta public-container" data-reveal><span className="public-eyebrow">Need a hand choosing?</span><h2>START WITH A<br /><em>CONVERSATION.</em></h2><p>We can help you find the right place to begin.</p><div><Link href="/contact" className="public-button">Contact the team <ArrowUpRight size={18} /></Link></div></section></>;
}
