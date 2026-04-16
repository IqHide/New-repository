import { NextRequest, NextResponse } from 'next/server';
import { Place, PlaceGroup } from '@/types/places';

interface GeoapifyFeature {
  properties: {
    place_id: string;
    name?: string;
    formatted: string;
    result_type?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

const GEOAPIFY_URL = 'https://api.geoapify.com/v1/geocode/search';

async function fetchPlaces(text: string, limit: number, apiKey: string): Promise<Place[]> {
  const url = new URL(GEOAPIFY_URL);
  url.searchParams.set('text', text);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  return (data.features ?? []).map((feature: GeoapifyFeature) => ({
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
}

async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ groups: [] });
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const [airports, hotels, general] = await Promise.all([
    fetchPlaces(`airport ${query}`, 3, apiKey),
    fetchPlaces(`hotel ${query}`, 2, apiKey),
    fetchPlaces(query, 10, apiKey),
  ]);

  const seenIds = new Set<string>();

  const dedupe = (places: Place[]): Place[] =>
    places.filter((p) => {
      if (seenIds.has(p.place_id)) return false;
      seenIds.add(p.place_id);
      return true;
    });

  const airportGroup = dedupe(airports.slice(0, 3));
  const hotelGroup = dedupe(hotels.slice(0, 2));
  const addressGroup = dedupe(general);

  const groups: PlaceGroup[] = [
    { label: 'Аэропорты', places: airportGroup },
    { label: 'Отели', places: hotelGroup },
    { label: 'Адреса', places: addressGroup },
  ].filter((g) => g.places.length > 0);

  return NextResponse.json({ groups });
}

export { GET };
