"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { signOut, type OfficerSession } from "@/lib/officer-auth";

const NAV = [
  { href: "/petugas/demo", label: "Dashboard" },
  { href: "/petugas/demo/tiket", label: "Tiket" },
];

export function OfficerShell({
  session,
  children,
}: {
  session: OfficerSession;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return href === "/petugas/demo" ? pathname === href : pathname.startsWith(href);
  }

  function logout() {
    signOut();
    router.replace("/petugas/login");
  }

  return (
    <div className="officer-frame">
      <aside className="officer-sidebar" aria-label="Menu petugas">
        <div className="officer-sidebar-brand">
          LAPOR<span>BALIK</span>
        </div>
        <p className="officer-sidebar-label">RUANG KERJA</p>
        <nav className="officer-sidebar-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="officer-sidebar-footer">
          <strong>{session.name}</strong>
          <span>{session.email}</span>
          <button type="button" className="officer-logout" onClick={logout}>
            Keluar
          </button>
        </div>
      </aside>
      <nav className="officer-mobile-nav" aria-label="Menu petugas">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <button type="button" onClick={logout}>
          Keluar
        </button>
      </nav>
      <section className="officer-sheet">{children}</section>
    </div>
  );
}
