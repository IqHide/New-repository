"use client";

import { FormEvent } from "react";
import { useCarsStore } from "@/store/cars.store";
import { Form, Input, Button } from "@heroui/react";
import { Car } from "@/types/cars";

interface IProps {
  car: Car;
  onClose: () => void;
}

const EditCarForm = ({ car, onClose }: IProps) => {
  const { editCar, isLoading, error } = useCarsStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await editCar(car.id, formData);
    onClose();
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Input
        isRequired
        label="Бренд"
        labelPlacement="outside"
        name="brand"
        defaultValue={car.brand}
        classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
      />

      <Input
        isRequired
        label="Модель"
        labelPlacement="outside"
        name="model"
        defaultValue={car.model}
        classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          isRequired
          label="0–100 км/ч"
          labelPlacement="outside"
          name="timeToOneHundred"
          defaultValue={car.timeToOneHundred}
          classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
        />

        <Input
          isRequired
          label="1/4 мили"
          labelPlacement="outside"
          name="timeToQuater"
          defaultValue={car.timeToQuater}
          classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
        />

        <Input
          isRequired
          label="Нюрбургринг"
          labelPlacement="outside"
          name="nurburgringTime"
          defaultValue={car.nurburgringTime}
          classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
        />
      </div>

      <Input
        label="Ссылка на изображение (опционально)"
        labelPlacement="outside"
        name="imageUrl"
        type="url"
        defaultValue={car.imageUrl ?? ""}
        classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
      />

      <div className="flex w-full justify-end gap-2 pt-4">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button color="primary" type="submit" isDisabled={isLoading}>
          {isLoading ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>
    </Form>
  );
};

export default EditCarForm;
