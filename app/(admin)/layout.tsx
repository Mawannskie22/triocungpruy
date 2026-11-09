import type { ReactNode } from "react";
import { OfficerGuard } from "@/components/officer/OfficerGuard";

// The dashboard blocks on a client-side session check, so it cannot be
// prerendered into a static shell. Opt out of instant-navigation validation.
export const instant = false;

export default function OfficerLayout({ children }: { children: ReactNode }) {
  return <OfficerGuard>{children}</OfficerGuard>;
}
