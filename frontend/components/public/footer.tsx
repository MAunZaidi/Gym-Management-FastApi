import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publicNav } from "@/lib/public-content";

export function Footer() {
  return (
    <footer className="public-footer">
      <div className="public-container public-footer__top">
        <div>
          <Link href="/" className="public-footer__brand">ADAPT<span>.</span></Link>
          <p>Train for what comes next.</p>
        </div>
        <div className="public-footer__links">
          <div><span className="public-eyebrow">Explore</span>{publicNav.slice(1, 5).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
          <div><span className="public-eyebrow">Connect</span>{publicNav.slice(5).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/class-booking">Class booking</Link></div>
        </div>
        <Link href="/contact" className="public-footer__contact">Let&apos;s talk <ArrowUpRight size={22} /></Link>
      </div>
      <div className="public-container public-footer__bottom"><span>© {new Date().getFullYear()} ADAPT. Built for the work ahead.</span><Link href="/login">Management login</Link></div>
    </footer>
  );
}
