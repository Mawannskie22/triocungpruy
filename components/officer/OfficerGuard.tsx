"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { OfficerShell } from "@/components/officer/OfficerShell";
import { getSession, type OfficerSession } from "@/lib/officer-auth";

export function OfficerGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<OfficerSession | null>(null);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/petugas/login");
      return;
    }
    setSession(current);
  }, [router]);

  if (!session) {
    return <main className="officer-guard-loading">Memeriksa sesi...</main>;
  }

  return (
    <main className="officer-page">
      <OfficerShell session={session}>{children}</OfficerShell>
    </main>
  );
}
