import type { Metadata } from "next";
import { BookingExperience } from "@/components/public/booking-experience";
import { CatalogMessage } from "@/components/public/catalog-cards";
import { getPublicClasses, getPublicTrainers } from "@/lib/public-api";

export const metadata: Metadata = { title: "Class Booking", description: "Select an ADAPT class and find out how to join it." };
export const dynamic = "force-dynamic";

export default async function ClassBookingPage({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const [params, classes, trainers] = await Promise.all([searchParams, getPublicClasses(), getPublicTrainers()]);
  const initialClassId = Number(params.class);
  return <><header className="public-page-header public-container" data-reveal><span className="public-eyebrow">Class booking</span><h1>MAKE ROOM<br /><em>TO MOVE.</em></h1><p>Explore the current class schedule, choose what moves you, and connect with ADAPT to confirm your place.</p></header><section className="public-section public-section--panel"><div className="public-container">{classes.items.length ? <BookingExperience classes={classes.items} trainers={trainers.items} initialClassId={Number.isFinite(initialClassId) ? initialClassId : undefined} /> : <CatalogMessage unavailable={classes.unavailable} noun="classes" />}</div></section></>;
}
