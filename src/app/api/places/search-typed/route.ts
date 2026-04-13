import { NextRequest, NextResponse } from 'next/server';
import { TypedPlace, TypedPlaceGroup } from '@/types/places';

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

async function fetchByCategory(
  query: string,
  apiKey: string,
  options: { categories?: string; types?: string; limit: number },
): Promise<TypedPlace[]> {
  const url = new URL(GEOAPIFY_URL);
  url.searchParams.set('text', query);
  url.searchParams.set('limit', String(options.limit));
  url.searchParams.set('apiKey', apiKey);

  if (options.categories) url.searchParams.set('categories', options.categories);
  if (options.types) url.searchParams.set('type', options.types);

  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();

  return (data.features ?? []).map((feature: GeoapifyFeature) => ({
    place_id: feature.properties.place_id,
    name: feature.properties.name ?? feature.properties.formatted,
    formatted_address: feature.properties.formatted,
    result_type: feature.properties.result_type ?? 'unknown',
    geometry: {
      location: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
      },
    },
  }));
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ groups: [] });
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const [airports, hotels, addresses] = await Promise.all([
    fetchByCategory(query, apiKey, { categories: 'airport', limit: 3 }),
    fetchByCategory(query, apiKey, { categories: 'accommodation.hotel', limit: 3 }),
    fetchByCategory(query, apiKey, { types: 'street,city,suburb,postcode', limit: 5 }),
  ]);

  const seenIds = new Set<string>();
  const dedupe = (places: TypedPlace[]) =>
    places.filter((p) => {
      if (seenIds.has(p.place_id)) return false;
      seenIds.add(p.place_id);
      return true;
    });

  const groups: TypedPlaceGroup[] = [
    { label: 'Аэропорты', places: dedupe(airports) },
    { label: 'Отели', places: dedupe(hotels) },
    { label: 'Адреса', places: dedupe(addresses) },
  ].filter((g) => g.places.length > 0);

  return NextResponse.json({ groups });
}
