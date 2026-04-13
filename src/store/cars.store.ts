import { create } from 'zustand';
import { Car } from '@/types/cars';
import { getCars, createCar, deleteCar, editCar as editCarAction } from '@/actions/car';

interface CarsState {
  cars: Car[];
  isLoading: boolean;
  error: string | null;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  loadCars: () => Promise<void>;
  addCar: (formData: FormData) => Promise<boolean>;
  removeCar: (id: string) => Promise<void>;
  editCar: (id: string, formData: FormData) => Promise<boolean>;
}

export const useCarsStore = create<CarsState>((set) => ({
  cars: [],
  isLoading: false,
  error: null,
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),

  loadCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const carsList = await getCars();

      if (carsList.success) {
        set({ cars: carsList.carsList, isLoading: false });
      } else {
        set({
          error: carsList.error ?? 'Ошибка загрзуки машины с сервера',
          isLoading: false,
        });
      }
    } catch (error) {
      console.log('Ошибка загрузки машины:', error);
      set({
        error: 'Ошибка загрзуки машины с сервера',
        isLoading: false,
      });
    }
  },

  addCar: async (formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      const car = await createCar(formData);

      if (car.success) {
        set((state) => ({
          cars: [...state.cars, car.car],
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: car.error, isLoading: false });
        return false;
      }
    } catch (error) {
      console.log('error', error);
      set({
        error: 'Ошибка при создании нового автомобиля',
        isLoading: false,
      });
      return false;
    }
  },

  removeCar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await deleteCar(id);

      if (result.success) {
        set((state) => ({
          cars: state.cars.filter((car) => car.id !== id),
          isLoading: false,
        }));
      } else {
        set({
          error: result.error ?? 'Ошибка при удалении автомобиля',
          isLoading: false,
        });
      }
    } catch (error) {
      console.log('error', error);
      set({
        error: 'Ошибка при удалении автомобиля',
        isLoading: false,
      });
    }
  },

  editCar: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await editCarAction(id, formData);
      if (result.success) {
        set((state) => ({
          cars: state.cars.map((car) => (car.id === id ? result.car : car)),
          selectedCar: null,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: result.error, isLoading: false });
        return false;
      }
    } catch (error) {
      console.log('error', error);
      set({ error: 'Ошибка при редактировании автомобиля', isLoading: false });
      return false;
    }
  },
}));
