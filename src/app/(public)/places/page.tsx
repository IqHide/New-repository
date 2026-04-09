"use client";

import { useState } from "react";
import PlacesSearch from "@/components/places/PlacesSearch";
import { Place } from "@/types/places";

export default function PlacesPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold">Places</h1>
      <PlacesSearch onSelect={setSelectedPlace} />

      {selectedPlace && (
        <div className="w-full max-w-xl border border-gray-200 dark:border-zinc-700 rounded-lg p-5 shadow-md">
          <h2 className="text-xl font-semibold">{selectedPlace.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{selectedPlace.formatted_address}</p>

          {selectedPlace.rating && (
            <p className="mt-2 text-sm">
              Рейтинг: <span className="font-medium">{selectedPlace.rating}</span>
              {selectedPlace.user_ratings_total && (
                <span className="text-gray-400"> ({selectedPlace.user_ratings_total} отзывов)</span>
              )}
            </p>
          )}

          {selectedPlace.types.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedPlace.types.slice(0, 4).map((type) => (
                <span
                  key={type}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-300"
                >
                  {type.replaceAll("_", " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
