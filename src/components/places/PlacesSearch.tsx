"use client";

import { useState, useEffect, useRef } from "react";
import { Place, PlacesSearchResponse } from "@/types/places";

interface Props {
  onSelect: (place: Place) => void;
}

export default function PlacesSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
        const data: PlacesSearchResponse = await res.json();

        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.places);
          setIsOpen(true);
        }
      } catch {
        setError("Ошибка при поиске");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (place: Place) => {
    setQuery(place.name);
    setIsOpen(false);
    onSelect(place);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск мест..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400 transition-colors bg-transparent"
      />
      {isLoading && (
        <span className="absolute right-3 top-2.5 text-sm text-gray-400">Поиск...</span>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <p className="font-medium text-sm">{place.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{place.formatted_address}</p>
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg px-4 py-3">
          <p className="text-sm text-gray-500">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
