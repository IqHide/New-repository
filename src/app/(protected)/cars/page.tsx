"use client";

import CarsForm from "@/forms/cars.form";
import { useCarsStore } from "@/store/cars.store";
import { useEffect } from "react";
import { Button } from "@heroui/react";
import TrashIcon from "@/components/UI/icons/TrashIcon";

const CarsPage = () => {
  const { cars, isLoading, error, loadCars, removeCar } = useCarsStore();

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold">Мои автомобили</h1>

      <CarsForm />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading && <p>Загрузка...</p>}

      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Список всех автомобилей</h2>
        {cars.length === 0 ? (
          <p>Нет добавленных автомобилей</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="border rounded-lg p-4 shadow-md relative"
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  className="absolute top-2 right-2"
                  onPress={() => removeCar(car.id)}
                  aria-label="Удалить автомобиль"
                >
                  <TrashIcon />
                </Button>
                <div className="w-full h-48 rounded mb-2 overflow-hidden bg-default-100">
                  {car.imageUrl && (
                    <img
                      src={`/image-proxy?url=${encodeURIComponent(car.imageUrl)}`}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {car.brand} {car.model}
                </h3>
                <p>0-100 км/ч: {car.timeToOneHundred} сек</p>
                <p>1/4 мили: {car.timeToQuater} сек</p>
                <p>Нюрбургринг: {car.nurburgringTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;

