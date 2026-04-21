'use client';

import { useState } from 'react';
import PlacesSearch from '@/components/places/PlacesSearch';
import { Place } from '@/types/places';

function PlacesPage() {
  const [, setSelectedPlace] = useState<Place | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold">Places</h1>
      <PlacesSearch onSelect={setSelectedPlace} />
    </div>
  );
}

export default PlacesPage;
