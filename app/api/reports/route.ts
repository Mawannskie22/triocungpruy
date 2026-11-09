import { checkRateLimit } from "@/lib/rate-limit";
import { validateAddress, validateCategory, validateDescription } from "@/lib/validation";
import type { ReportCategory } from "@/types/report";

type ReportPayload = {
  description?: unknown;
  category?: unknown;
  address?: unknown;
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return Response.json(
      {
        error: `Kamu sudah melaporkan ${limit.limit} kali untuk hari ini. Lapor lagi besok.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: ReportPayload;
  try {
    payload = (await request.json()) as ReportPayload;
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  if (typeof payload.description !== "string" || typeof payload.address !== "string") {
    return Response.json({ error: "Data laporan tidak lengkap." }, { status: 400 });
  }

  const category = typeof payload.category === "string" ? (payload.category as ReportCategory) : "";
  const message =
    validateDescription(payload.description) ??
    validateCategory(category) ??
    validateAddress(payload.address);

  if (message) {
    return Response.json({ error: message }, { status: 400 });
  }

  return Response.json({ ok: true, ip, remaining: limit.remaining });
}
