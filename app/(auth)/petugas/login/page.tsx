import type { Metadata } from "next";
import { LoginForm } from "@/components/officer/LoginForm";

export const metadata: Metadata = {
  title: "Masuk Petugas | Lapor Balik",
  robots: { index: false, follow: false },
};

export default function OfficerLoginPage() {
  return (
    <main className="officer-login-page">
      <LoginForm />
    </main>
  );
}
