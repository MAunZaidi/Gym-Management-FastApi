import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, description, href, linkLabel }: { eyebrow: string; title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="public-section-heading" data-scroll="text">
      <div><span className="public-eyebrow">{eyebrow}</span><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
      {href && linkLabel ? <Link className="public-text-link" href={href}>{linkLabel}<ArrowUpRight size={17} aria-hidden="true" /></Link> : null}
    </div>
  );
}
