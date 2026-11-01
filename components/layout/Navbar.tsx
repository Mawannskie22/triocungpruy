"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#cara-melapor", label: "Cara Melapor" },
  { href: "/#tentang", label: "Tentang" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    if (pathname !== "/") return;

    let frame: number | null = null;
    function updatePosition() {
      const hero = document.getElementById("beranda");
      const header = document.querySelector(".site-header");
      setIsOverHero(
        Boolean(
          hero &&
          header &&
          hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom,
        ),
      );
      frame = null;
    }

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updatePosition);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const isTransparent = pathname === "/" && isOverHero;

  return (
    <header className={`site-header ${isTransparent ? "site-header--over-hero" : ""}`}>
      <nav className="container nav-inner" aria-label="Navigasi utama">
        <Link href="/" className="brand" onClick={() => setIsOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            L<span>↗</span>
          </span>
          <span>
            LAPOR<span className="brand-accent">BALIK</span>
          </span>
        </Link>
        <div className={`nav-links ${isOpen ? "is-open" : ""}`} id="mobile-navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/status" className="mobile-status" onClick={() => setIsOpen(false)}>
            Cek Status
          </Link>
        </div>
        <div className="nav-actions">
          <Link href="/lapor" className="button button-primary nav-cta">
            Lapor Sekarang <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
