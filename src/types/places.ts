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

export interface PlacesSearchResponse {
  places: Place[];
  error?: string;
}
