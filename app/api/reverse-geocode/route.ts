type NominatimResponse = {
  display_name?: string;
  address?: Record<string, string | undefined>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return Response.json({ error: "Koordinat tidak valid." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", lat.toFixed(6));
  url.searchParams.set("lon", lng.toFixed(6));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "id");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "LaporBalik-Demo/1.0",
        "Accept-Language": "id",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Nominatim responded with ${response.status}`);

    const data = (await response.json()) as NominatimResponse;
    const parts = data.address ?? {};
    const seen = new Set<string>();
    const address = [
      parts.road ?? parts.pedestrian ?? parts.footway,
      parts.neighbourhood ?? parts.suburb ?? parts.village ?? parts.hamlet,
      parts.city_district ?? parts.district,
      parts.city ?? parts.town ?? parts.municipality ?? parts.county,
      parts.state,
    ]
      .filter((part): part is string => {
        if (!part || seen.has(part)) return false;
        seen.add(part);
        return true;
      })
      .join(", ");

    const result = address || data.display_name;
    if (!result) throw new Error("Address not found");

    return Response.json({ address: result });
  } catch {
    return Response.json({ error: "Alamat tidak ditemukan." }, { status: 502 });
  }
}
