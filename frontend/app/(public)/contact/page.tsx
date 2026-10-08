import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the ADAPT team about classes, memberships, and training." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string; class?: string; service?: string }> }) {
  const params = await searchParams;
  const interest = params.class ? `the ${params.class} class` : params.plan ? `the ${params.plan} membership` : params.service ? `${params.service} training` : undefined;
  return <><header className="public-page-header public-container" data-reveal><span className="public-eyebrow">06 / Contact</span><h1>LET&apos;S<br /><em>CONNECT.</em></h1><p>Questions about training, classes, or memberships? Tell us what&apos;s on your mind.</p></header><section className="public-section public-section--panel"><div className="public-container public-contact-grid"><div data-reveal><span className="public-eyebrow">Start a conversation</span><h2>WE&apos;RE HERE<br />FOR YOUR NEXT STEP.</h2><p>Every training journey starts somewhere. Share what you&apos;re looking for and we&apos;ll help you find your way.</p><div className="public-contact-grid__aside"><span className="public-eyebrow">A note on visiting</span><p>Location, hours, and phone details are being prepared. Please contact the team before planning a visit.</p></div></div><ContactForm interest={interest} /></div></section></>;
}
