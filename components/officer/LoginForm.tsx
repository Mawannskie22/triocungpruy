"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getSession, OFFICER_EMAIL, OFFICER_PASSWORD, signIn } from "@/lib/officer-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getSession()) {
      router.replace("/petugas/dashboard");
      return;
    }
    setChecking(false);
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = signIn(email, password);
    if (!session) {
      setError("Email atau password salah. Coba lagi.");
      return;
    }
    router.replace("/petugas/dashboard");
  }

  if (checking) {
    return <p className="officer-login-loading">Memeriksa sesi...</p>;
  }

  return (
    <div className="officer-login-card">
      <span className="officer-login-brand">
        LAPOR<span>BALIK</span>
      </span>
      <span className="eyebrow">RUANG PETUGAS</span>
      <h1>Masuk untuk mulai.</h1>
      <p>Gunakan akun petugas demo untuk membuka dashboard.</p>
      <form onSubmit={submit}>
        <label className="field-label" htmlFor="officer-email">
          Email
        </label>
        <input
          id="officer-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          required
        />
        <label className="field-label" htmlFor="officer-password">
          Password
        </label>
        <input
          id="officer-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          required
        />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button button-primary">
          Masuk ke dashboard <span aria-hidden="true">↗</span>
        </button>
      </form>
      <div className="officer-login-hint">
        <strong>AKUN DEMO</strong>
        <span>
          {OFFICER_EMAIL} / {OFFICER_PASSWORD}
        </span>
      </div>
      <Link href="/" className="officer-login-back">
        ← Kembali ke halaman warga
      </Link>
    </div>
  );
}
