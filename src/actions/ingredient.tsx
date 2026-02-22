"use server";

import { ingredientSchema } from "@/schema/zod";
import { prisma } from "@/utils/prisma";
import { success, ZodError } from "zod";

const createIngredient = async (formData: FormData) => {
  try {
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      pricePerUnit: formData.get("pricePerUnit")
        ? parseFloat(formData.get("pricePerUnit") as string)
        : null,
      description: formData.get("description") as string,
    }

    const validatedData = ingredientSchema.parse(data);

    const ingredient = await prisma.ingredient.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        unit: validatedData.unit,
        pricePerUnit: validatedData.pricePerUnit,
        description: validatedData.description,
      }
    });

    return { success: true, ingredient }

  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues.map((e) => e.message).join(', ') };
    }
    console.error("Ошибка при создании ингридиаента!", error);
    return { error: "Ошибка при создании ингридиаента!" };
  }
}
export default createIngredient;


export async function getIngredients() {
  try {
    const ingredientsList = await prisma.ingredient.findMany();
    return { success: true, ingredientsList };
  } catch (error) {
    console.error("Ошибка с получением ингридиентов", error);
    return { error: "Ошибка при получении ингридиентов" };
  }
}


export async function deleteIngredient(id: string) {
  try {
    const deletedIngredient = await prisma.ingredient.delete({ where: { id } });
    return { success: true, deletedIngredient }
  } catch (error) {
    console.log("Ошибка удаления элемента:", error);
    return { error: "Ошибка удаления ингридиента" };
  }
}