'use client';

import { FormEvent } from 'react';
import { useCarsStore } from '@/store/cars.store';
import { Form, Input, Button } from '@heroui/react';

const CarsForm = () => {
  const { addCar, isLoading, error } = useCarsStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const success = await addCar(formData);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full max-w-xl flex flex-col gap-4 p-4 border rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold">Добавить автомобиль</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input
        isRequired
        label="Бренд"
        labelPlacement="outside"
        name="brand"
        placeholder="BMW"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
      />
      <Input
        isRequired
        label="Модель"
        labelPlacement="outside"
        name="model"
        placeholder="M5 CS"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          isRequired
          label="0–100 км/ч"
          labelPlacement="outside"
          name="timeToOneHundred"
          placeholder="0:00"
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
        />
        <Input
          isRequired
          label="1/4 мили"
          labelPlacement="outside"
          name="timeToQuater"
          placeholder="0:00"
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
        />
        <Input
          isRequired
          label="Нюрбургринг"
          labelPlacement="outside"
          name="nurburgringTime"
          placeholder="0:00:000"
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
        />
      </div>
      <Input
        label="Ссылка на изображение (опционально)"
        labelPlacement="outside"
        name="imageUrl"
        type="url"
        placeholder="https://..."
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
      />
      <div className="flex w-full justify-end pt-4">
        <Button color="primary" type="submit" isDisabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Добавить автомобиль'}
        </Button>
      </div>
    </Form>
  );
};

export default CarsForm;
