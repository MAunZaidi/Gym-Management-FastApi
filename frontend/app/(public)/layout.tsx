import type { ReactNode } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { PublicShell } from "@/components/public/public-shell";
import { WavesBackground } from "@/components/public/waves-background";
import "./public.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="public-site"><WavesBackground /><a href="#main-content" className="public-skip-link">Skip to content</a><Navbar /><PublicShell><main id="main-content" tabIndex={-1}>{children}</main></PublicShell><Footer /></div>;
}
