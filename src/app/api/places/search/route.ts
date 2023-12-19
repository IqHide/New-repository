import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ places: [] });
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const url = new URL("https://api.geoapify.com/v1/geocode/search");
  url.searchParams.set("text", query);
  url.searchParams.set("limit", "7");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url.toString());


  if (!response.ok) {
    const errorData = await response.json();
    console.error("Geoapify error:", JSON.stringify(errorData));
    return NextResponse.json({ error: "Geoapify API error" }, { status: response.status });
  }

  const data = await response.json();

  const places = (data.features ?? []).map((feature: any) => ({
    place_id: feature.properties.place_id,
    name: feature.properties.name ?? feature.properties.formatted,
    formatted_address: feature.properties.formatted,
    geometry: {
      location: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
      },
    },
    types: [feature.properties.result_type],
    rating: undefined,
    user_ratings_total: undefined,
  }));

  return NextResponse.json({ places });
}
