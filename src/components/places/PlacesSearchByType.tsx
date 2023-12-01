/* 'use client';

import { useState, useEffect, useRef } from 'react';
import { TypedPlace, TypedPlaceGroup, TypedPlacesResponse } from '@/types/places';

interface Props {
  onSelect: (place: TypedPlace) => void;
}

export default function PlacesSearchByType({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<TypedPlaceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setGroups([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/places/search-typed?q=${encodeURIComponent(query)}`);
        const data: TypedPlacesResponse = await res.json();

        if (data.error) {
          setError(data.error);
          setGroups([]);
        } else {
          setGroups(data.groups);
          setIsOpen(true);
        }
      } catch {
        setError('Ошибка при поиске');
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (place: TypedPlace) => {
    setQuery(place.name);
    setIsOpen(false);
    onSelect(place);
  };

  const hasResults = groups.some((g) => g.places.length > 0);

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

      {isOpen && hasResults && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide border-b border-gray-100 dark:border-zinc-800">
                {group.label}
              </p>
              <ul>
                {group.places.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelect(place)}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {place.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {place.formatted_address}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {isOpen && !hasResults && !isLoading && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg px-4 py-3">
          <p className="text-sm text-gray-500">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
 */
