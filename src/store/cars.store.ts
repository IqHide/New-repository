import { create } from "zustand";
import { Car } from "@/types/cars";
import { getCars, createCar, deleteCar } from "@/actions/car";

interface CarsState {
  cars: Car[];
  isLoading: boolean;
  error: string | null;
  loadCars: () => Promise<void>;
  addCar: (formData: FormData) => Promise<void>;
  removeCar: (id: string) => Promise<void>;
}

export const useCarsStore = create<CarsState>((set) => ({
  cars: [],
  isLoading: false,
  error: null,

  loadCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const carsList = await getCars();

      if (carsList.success) {
        set({ cars: carsList.carsList, isLoading: false });
      } else {
        set({
          error: carsList.error ?? "Ошибка загрзуки машины с сервера",
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("Ошибка загрузки машины:", error);
      set({
        error: "Ошибка загрзуки машины с сервера",
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
      } else {
        set({ error: car.error, isLoading: false });
      }
    } catch (error) {
      console.log("error", error);
      set({
        error: "Ошибка при создании нового автомобиля",
        isLoading: false,
      });
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
          error: result.error ?? "Ошибка при удалении автомобиля",
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      set({
        error: "Ошибка при удалении автомобиля",
        isLoading: false,
      });
    }
  },
}));
