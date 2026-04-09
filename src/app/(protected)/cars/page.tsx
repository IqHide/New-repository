"use client";

import CarsForm from "@/forms/cars.form";
import EditCarForm from "@/forms/edit-car.form";
import { useCarsStore } from "@/store/cars.store";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { Button, Checkbox, Slider } from "@heroui/react";
import TrashIcon from "@/components/UI/icons/TrashIcon";
import PencilIcon from "@/components/UI/icons/PencilIcon";
import CompareIcon from "@/components/UI/icons/CompareIcon";
=======
import { Button, Checkbox, Slider } from "@heroui/react";
import TrashIcon from "@/components/UI/icons/TrashIcon";
import PencilIcon from "@/components/UI/icons/PencilIcon";
>>>>>>> d66959d226b920147c80d47858aedacf14ee9c34
import CustomModal from "@/components/common/modal";

const CarsPage = () => {
  const { cars, isLoading, error, loadCars, removeCar, selectedCar, setSelectedCar } = useCarsStore();
<<<<<<< HEAD
  const router = useRouter();
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
=======
>>>>>>> d66959d226b920147c80d47858aedacf14ee9c34
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [accelerationRange, setAccelerationRange] = useState<[number, number]>([2, 10]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

<<<<<<< HEAD
  const handleCompare = (id: string) => {
    if (comparisonIds.includes(id)) {
      setComparisonIds(comparisonIds.filter((c) => c !== id));
      return;
    }
    if (comparisonIds.length === 0) {
      setComparisonIds([id]);
      return;
    }
    router.push(`/comparison?car1=${comparisonIds[0]}&car2=${id}`);
    setComparisonIds([]);
  };

=======
>>>>>>> d66959d226b920147c80d47858aedacf14ee9c34
  const brands = Array.from(new Set(cars.map((car) => car.brand)));

  const filteredCars = cars
    .filter((car) => (activeBrand ? car.brand === activeBrand : true))
    .filter((car) => (onlyWithPhoto ? !!car.imageUrl : true))
    .filter((car) => {
      const val = parseFloat(car.timeToOneHundred);
      if (isNaN(val)) return true;
      return val >= accelerationRange[0] && val <= accelerationRange[1];
    });

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold">Мои автомобили</h1>

      <CarsForm />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && <p>Загрузка...</p>}

      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Список всех автомобилей</h2>

        <div className="flex gap-4 items-start">
          {/* Кнопка "Фильтры" */}
          <div className="shrink-0">
            <Button
              size="sm"
              variant={filtersOpen ? "solid" : "bordered"}
              onPress={() => setFiltersOpen((prev) => !prev)}
            >
              Фильтры
            </Button>

            {/* Панель фильтров */}
            {filtersOpen && (
              <div className="mt-2 w-48 border rounded-lg p-4 shadow-md flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Марка</p>
                  <div className="flex flex-col gap-1">
                    <button
                      className={`text-left text-sm px-2 py-1 rounded ${activeBrand === null ? "bg-primary text-white" : "hover:bg-default-100"}`}
                      onClick={() => setActiveBrand(null)}
                    >
                      Все
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        className={`text-left text-sm px-2 py-1 rounded ${activeBrand === brand ? "bg-primary text-white" : "hover:bg-default-100"}`}
                        onClick={() => setActiveBrand(brand)}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider
                  label="0–100 км/ч (сек)"
                  step={0.5}
                  minValue={2}
                  maxValue={10}
                  value={accelerationRange}
                  onChange={(val) => setAccelerationRange(val as [number, number])}
                  getValue={(val) => {
                    const [min, max] = val as [number, number];
                    return `${min}с — ${max}с`;
                  }}
                  size="sm"
                  className="w-full"
                />

                <Checkbox
                  isSelected={onlyWithPhoto}
                  onValueChange={setOnlyWithPhoto}
                  size="sm"
                >
                  Только с фото
                </Checkbox>
              </div>
            )}
          </div>

          {/* Карточки */}
          <div className="flex-1">
            {filteredCars.length === 0 ? (
              <p>Нет добавленных автомобилей</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="border rounded-lg p-4 shadow-md relative"
                  >
<<<<<<< HEAD
                    <div className="absolute top-2 left-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant={comparisonIds.includes(car.id) ? "solid" : "light"}
                        color="primary"
                        onPress={() => handleCompare(car.id)}
                        aria-label="Сравнить автомобиль"
                      >
                        <CompareIcon />
                      </Button>
                    </div>
=======
>>>>>>> d66959d226b920147c80d47858aedacf14ee9c34
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        onPress={() => setSelectedCar(car)}
                        aria-label="Редактировать автомобиль"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeCar(car.id)}
                        aria-label="Удалить автомобиль"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
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
      </div>

      <CustomModal
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
        title="Редактировать автомобиль"
        size="lg"
      >
        {selectedCar && (
          <EditCarForm car={selectedCar} onClose={() => setSelectedCar(null)} />
        )}
      </CustomModal>
    </div>
  );
};

export default CarsPage;
