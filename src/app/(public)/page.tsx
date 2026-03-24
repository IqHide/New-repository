"use client";

import { useCarsStore } from "@/store/cars.store";
import { useEffect } from "react";
import React from "react";

export default function Home() {
  const { cars, isLoading, error, loadCars } = useCarsStore();

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const lastCars = cars.slice(-2).reverse();

  return (
    <>
      <div className="flex flex-col items-center gap-6 w-full">
        <h1 className="text-3xl font-bold">Последние автомобили</h1>


        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isLoading && <p>Загрузка...</p>}

        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold mb-4">Два последних автомобиля</h2>
          {lastCars.length === 0 ? (
            <p>Нет добавленных автомобилей для отображения</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastCars.map((car) => (
                <div key={car.id} className="border rounded-lg p-4 shadow-md">
                  {car.imageUrl && (
                    <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover rounded mb-2" />
                  )}
                  <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
                  <p>0-100 км/ч: {car.timeToOneHundred} сек</p>
                  <p>1/4 мили: {car.timeToQuater} сек</p>
                  <p>Нюрбургринг: {car.nurburgringTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
