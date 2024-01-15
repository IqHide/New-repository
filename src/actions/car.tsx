"use server";

import { carsSchema } from "@/schema/zod";
import { Car } from "@/types/cars";
import { prisma } from "@/utils/prisma";
import { ZodError } from "zod";

export const createCar = async (formData: FormData): Promise<
  | { success: true; car: Car }
  | { success: false; error: string }
> => {
  try {
    const carData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      timeToOneHundred: formData.get("timeToOneHundred") as string,
      timeToQuater: formData.get("timeToQuater") as string,
      nurburgringTime: formData.get("nurburgringTime") as string,
      imageUrl: formData.get("imageUrl") as string | null,
    };

    const validatedCarData = carsSchema.parse(carData);

    const car = await prisma.car.create({
      data: {
        brand: validatedCarData.brand,
        model: validatedCarData.model,
        timeToOneHundred: validatedCarData.timeToOneHundred,
        timeToQuater: validatedCarData.timeToQuater,
        nurburgringTime: validatedCarData.nurburgringTime,
        imageUrl: validatedCarData.imageUrl,
      }
    })

    return { success: true, car }
  }
  catch (error) {
    if (error instanceof ZodError) {
      console.error("Ошибка при создании автомобиля:", error);
      return { success: false, error: "Ошибка валидации:" };
    }
    console.error("Ошибка при создании автомобиля:", error);
    return { success: false, error: "Ошибка при создании автомобиля" };
  }
};

export const getCars = async () => {
  try {
    const carsList = await prisma.car.findMany();
    return { success: true, carsList };
  } catch (error) {
    console.error("ошибка получения автомобилей", error);
    return { error: "Ошибка при получении автомобилей" };
  }
};


export const deleteCar = async (id: string) => {
  try {
    const deletedCar = await prisma.car.delete({ where: { id } });
    return ({ success: true, deletedCar });

  }
  catch (error) {
    console.error("Ошибка при создании автомобиля:", error);
    return { error: "Ошибка при создании автомобиля" };
  }
};

export const editCar = async (id: string, formData: FormData): Promise<
  | { success: true; car: Car }
  | { success: false; error: string }
> => {
  try {
    const carData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      timeToOneHundred: formData.get("timeToOneHundred") as string,
      timeToQuater: formData.get("timeToQuater") as string,
      nurburgringTime: formData.get("nurburgringTime") as string,
      imageUrl: formData.get("imageUrl") as string | null,
    };

    const validatedCarData = carsSchema.parse(carData);

    const car = await prisma.car.update({
      where: { id },
      data: {
        brand: validatedCarData.brand,
        model: validatedCarData.model,
        timeToOneHundred: validatedCarData.timeToOneHundred,
        timeToQuater: validatedCarData.timeToQuater,
        nurburgringTime: validatedCarData.nurburgringTime,
        imageUrl: validatedCarData.imageUrl ?? null,
      },
    });

    return { success: true, car };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Ошибка валидации" };
    }
    console.error("Ошибка при редактировании автомобиля:", error);
    return { success: false, error: "Ошибка при редактировании автомобиля" };
  }
};