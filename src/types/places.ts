export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlaceGeometry {
  location: PlaceLocation;
}

export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: PlaceGeometry;
  types: string[];
}

export interface PlaceGroup {
  label: string;
  places: Place[];
}

export interface PlacesSearchResponse {
  groups: PlaceGroup[];
  error?: string;
}

export interface TypedPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  result_type: string;
  geometry: {
    location: { lat: number; lng: number };
  };
}

export interface TypedPlaceGroup {
  label: string;
  places: TypedPlace[];
}

export interface TypedPlacesResponse {
  groups: TypedPlaceGroup[];
  error?: string;
}
