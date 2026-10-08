"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { publicNav } from "@/lib/public-content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = Math.max(0, window.scrollY);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const progress = maxScroll ? Math.min(1, scrollY / maxScroll) : 0;
      setScrolled(scrollY > 48);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1020px)");
    const onChange = () => { if (!mobile.matches) setOpen(false); };
    mobile.addEventListener("change", onChange);
    return () => mobile.removeEventListener("change", onChange);
  }, []);

  return (
    <header ref={headerRef} className={`public-nav ${scrolled ? "public-nav--scrolled" : ""}`}>
      <div className="public-container public-nav__inner">
        <Link href="/" className="public-logo" onClick={() => setOpen(false)} aria-label="ADAPT home">
          <span>ADAPT<span className="public-logo__dot">.</span></span>
        </Link>
        <nav className="public-nav__desktop" aria-label="Public navigation">
          {publicNav.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <Link className="public-nav__cta" href="/class-booking" aria-current={pathname === "/class-booking" ? "page" : undefined}>Book a class <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button ref={toggleRef} className="public-nav__toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="public-mobile-nav" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <span ref={progressRef} className="public-nav__progress" aria-hidden="true" />
      </div>
      <nav id="public-mobile-nav" className={`public-nav__mobile ${open ? "is-open" : ""}`} aria-label="Mobile navigation" inert={!open}>
        {publicNav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}<ArrowUpRight size={17} aria-hidden="true" /></Link>)}
        <Link className="public-nav__mobile-cta" href="/class-booking" onClick={() => setOpen(false)} aria-current={pathname === "/class-booking" ? "page" : undefined}>Book a class <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
