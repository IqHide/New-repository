import createIngredient, {
  deleteIngredient,
  getIngredients,
} from "@/actions/ingredient";
import { IIngredient } from "@/types/ingredients";
import { create } from "zustand";

interface IngredientState {
  ingredients: IIngredient[];
  isLoading: boolean;
  error: string | null;
  loadIngredients: () => Promise<void>;
  addIngredient: (formData: FormData) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  loadIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const ingredientsList = await getIngredients();

      if (ingredientsList.success) {
        set({ ingredients: ingredientsList.ingredientsList, isLoading: false });
      }
    } catch (error) {
      console.error("Ошибка получения ингридиента с сервера!", error);
      set({ error: "Ошибка при загрузке ингридиентов", isLoading: false });
    }
  },

  addIngredient: async (formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      const ingredient = await createIngredient(formData);

      if (ingredient.success) {
        set((state) => ({
          ingredients: [...state.ingredients, ingredient.ingredient],
          isLoading: false,
        }));
      } else {
        set({ error: ingredient.error, isLoading: false });
      }
    } catch (error) {
      console.log("error", error);
      set({ error: "Ошибка добавления компонента", isLoading: false });
    }
  },

  removeIngredient: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await deleteIngredient(id);

      if (result.success) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id,
          ),
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.log("error", error);
      set({ error: "Ошибка при удалении ингридиента", isLoading: false });
    }
  },
}));