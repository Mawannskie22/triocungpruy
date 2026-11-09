const SESSION_KEY = "lapor-balik-officer-session-v1";

export const OFFICER_EMAIL = "petugas@laporbalik.id";
export const OFFICER_PASSWORD = "petugas123";
export const OFFICER_NAME = "Petugas Lapangan";

export type OfficerSession = {
  email: string;
  name: string;
  signedInAt: string;
};

export function signIn(email: string, password: string): OfficerSession | null {
  if (email.trim().toLowerCase() !== OFFICER_EMAIL || password !== OFFICER_PASSWORD) return null;

  const session: OfficerSession = {
    email: OFFICER_EMAIL,
    name: OFFICER_NAME,
    signedInAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return null;
  }

  return session;
}

export function getSession(): OfficerSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const value = JSON.parse(raw) as Partial<OfficerSession>;
    if (typeof value.email !== "string" || typeof value.name !== "string") return null;

    return {
      email: value.email,
      name: OFFICER_NAME,
      signedInAt: typeof value.signedInAt === "string" ? value.signedInAt : "",
    };
  } catch {
    return null;
  }
}

export function signOut(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage errors. The session simply stays closed.
  }
}
