'use client';

import CarsForm from '@/forms/cars.form';
import EditCarForm from '@/forms/edit-car.form';
import { useCarsStore } from '@/store/cars.store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Input, Slider } from '@heroui/react';
import TrashIcon from '@/components/UI/icons/TrashIcon';
import PencilIcon from '@/components/UI/icons/PencilIcon';
import CompareIcon from '@/components/UI/icons/CompareIcon';
import CustomModal from '@/components/common/modal';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import {
  applyPreset,
  toggleBrand,
  clearBrands,
  setAccelerationRange,
  setQuarterMileRange,
  setNurburgringRange,
  setOnlyWithPhoto,
  resetFilters,
} from '@/store/redux/filtersSlice';
import {
  useGetFilterPresetsQuery,
  useSaveFilterPresetMutation,
  useDeleteFilterPresetMutation,
} from '@/store/redux/api/filter-presets.api';

const CarsPage = () => {
  const { cars, isLoading, error, loadCars, removeCar, selectedCar, setSelectedCar } =
    useCarsStore();
  const router = useRouter();
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Redux: фильтры
  const dispatch = useAppDispatch();
  const { activeBrands, onlyWithPhoto, accelerationRange, quarterMileRange, nurburgringRange } =
    useAppSelector((state) => state.filters);

  // RTK Query: пресеты
  const { data: presets = [] } = useGetFilterPresetsQuery();
  const [saveFilterPreset, { isLoading: isSaving }] = useSaveFilterPresetMutation();
  const [deleteFilterPreset] = useDeleteFilterPresetMutation();

  useEffect(() => {
    loadCars();
  }, [loadCars]);

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

  const handleResetFilters = () => {
    dispatch(resetFilters());
  }

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;
    await saveFilterPreset({
      name: presetName.trim(),
      brand: activeBrands.length > 0 ? activeBrands.join(',') : null,
      onlyWithPhoto,
      accelerationMin: accelerationRange[0],
      accelerationMax: accelerationRange[1],
      quarterMileMin: quarterMileRange[0],
      quarterMileMax: quarterMileRange[1],
      nurburgringMin: nurburgringRange[0],
      nurburgringMax: nurburgringRange[1],
    });
    setPresetName('');
  };

  const brands = Array.from(new Set(cars.map((car) => car.brand)));

  const filteredCars = cars
    .filter((car) => (activeBrands.length > 0 ? activeBrands.includes(car.brand) : true))
    .filter((car) => (onlyWithPhoto ? !!car.imageUrl : true))
    .filter((car) => {
      const val = parseFloat(car.timeToOneHundred);
      if (isNaN(val)) return true;
      return val >= accelerationRange[0] && val <= accelerationRange[1];
    })
    .filter((car) => {
      const val = parseFloat(car.timeToQuater);
      if (isNaN(val)) return true;
      return val >= quarterMileRange[0] && val <= quarterMileRange[1];
    })
    .filter((car) => {
      const val = parseFloat(car.nurburgringTime);
      if (isNaN(val)) return true;
      return val >= nurburgringRange[0] && val <= nurburgringRange[1];
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
          {/* Левая колонка: фильтры + пресеты */}
          <div className="shrink-0 w-52 flex flex-col gap-3">
            <Button
              size="sm"
              variant={filtersOpen ? 'solid' : 'bordered'}
              onPress={() => setFiltersOpen((prev) => !prev)}
            >
              Фильтры
            </Button>

            {filtersOpen && (
              <div className="border rounded-lg p-4 shadow-md flex flex-col gap-4">
                {/* Марка */}
                <div>
                  <p className="text-sm font-semibold mb-2">Марка</p>
                  <div className="flex flex-col gap-1">
                    <button
                      className={`text-left text-sm px-2 py-1 rounded ${activeBrands.length === 0 ? 'bg-primary text-white' : 'hover:bg-default-100'}`}
                      onClick={() => dispatch(clearBrands())}
                    >
                      Все
                    </button>
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="flex items-center justify-between px-2 py-1 rounded hover:bg-default-100 cursor-pointer"
                        onClick={() => dispatch(toggleBrand(brand))}
                      >
                        <span className="text-sm">{brand}</span>
                        <Checkbox
                          isSelected={activeBrands.includes(brand)}
                          onValueChange={() => dispatch(toggleBrand(brand))}
                          size="sm"
                          classNames={{ wrapper: 'bg-white' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Slider
                  label="0–100 км/ч (сек)"
                  step={0.5}
                  minValue={2}
                  maxValue={10}
                  value={accelerationRange}
                  onChange={(val) => dispatch(setAccelerationRange(val as [number, number]))}
                  getValue={(val) => {
                    const [min, max] = val as [number, number];
                    return `${min}с — ${max}с`;
                  }}
                  size="sm"
                  className="w-full"
                />

                <Slider
                  label="1/4 мили (сек)"
                  step={0.5}
                  minValue={0}
                  maxValue={30}
                  value={quarterMileRange}
                  onChange={(val) => dispatch(setQuarterMileRange(val as [number, number]))}
                  getValue={(val) => {
                    const [min, max] = val as [number, number];
                    return `${min}с — ${max}с`;
                  }}
                  size="sm"
                  className="w-full"
                />

                <Slider
                  label="Нюрбургринг (мин)"
                  step={0.5}
                  minValue={0}
                  maxValue={30}
                  value={nurburgringRange}
                  onChange={(val) => dispatch(setNurburgringRange(val as [number, number]))}
                  getValue={(val) => {
                    const [min, max] = val as [number, number];
                    return `${min}м — ${max}м`;
                  }}
                  size="sm"
                  className="w-full"
                />

                <Checkbox
                  isSelected={onlyWithPhoto}
                  onValueChange={(val) => dispatch(setOnlyWithPhoto(val))}
                  size="sm"
                >
                  Только с фото
                </Checkbox>

                {/* Сбросить фильтры */}
                <div className='flex flex-col gap-2 pt-2'>
                  <Button
                    size="md"
                    variant="flat"
                    color="primary"
                    onPress={handleResetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </div>

                {/* Сохранить пресет */}
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <p className="text-sm font-semibold">Сохранить фильтр</p>
                  <Input
                    size="sm"
                    placeholder="Название"
                    value={presetName}
                    onValueChange={setPresetName}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    isLoading={isSaving}
                    isDisabled={!presetName.trim()}
                    onPress={handleSavePreset}
                  >
                    Сохранить
                  </Button>
                </div>

              </div>
            )}

            {/* Список сохранённых пресетов */}
            {presets.length > 0 && (
              <div className="border rounded-lg p-4 shadow-md flex flex-col gap-2">
                <p className="text-sm font-semibold">Мои фильтры</p>
                {presets.map((preset) => (
                  <div key={preset.id} className="flex items-center justify-between gap-1">
                    <button
                      className="text-left text-sm flex-1 truncate hover:text-primary"
                      onClick={() => dispatch(applyPreset(preset))}
                    >
                      {preset.name}
                    </button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => deleteFilterPreset(preset.id)}
                      aria-label="Удалить пресет"
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
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
                  <div key={car.id} className="border rounded-lg p-4 shadow-md relative">
                    <div className="absolute top-2 left-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant={comparisonIds.includes(car.id) ? 'solid' : 'light'}
                        color="primary"
                        onPress={() => handleCompare(car.id)}
                        aria-label="Сравнить автомобиль"
                      >
                        <CompareIcon />
                      </Button>
                    </div>
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
        {selectedCar && <EditCarForm car={selectedCar} onClose={() => setSelectedCar(null)} />}
      </CustomModal>
    </div>
  );
};

export default CarsPage;
