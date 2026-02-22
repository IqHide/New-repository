"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { useIngredientStore } from '@/store/ingredient.store';
import React, { use, useState, useTransition } from 'react'

type CreateIngredientResult = {
  success: boolean,
  error?: string;
  ingredient: {
    name: string;
    category: string;
    unit: string;
    pricePerUnit: number | null;
    description: string;
  }
}

const InitialStateIngredient = {
  name: "",
  category: "",
  unit: "",
  pricePerUnit: null as number | null,
  description: "",
}


function IngredientForm() {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(InitialStateIngredient);
  const { addIngredient } = useIngredientStore();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    console.log("Форма отправлена", formData);

    startTransition(async () => {


     await addIngredient(formData);
      const storeError = useIngredientStore.getState().error;


      if (storeError) {
        setError(storeError);
        console.error("Ошибка при создании ингридиента");
      } else {
        setError(null);
        setFormData(InitialStateIngredient);
        console.log("Успешное создание ингридиента");
      }
    })
  }

  return (
    <Form className='w-[400px]' action={handleSubmit} >

      {error && <p className='text-red-500'>{error}</p>}
      <Input
        isRequired
        name='name'
        placeholder='Введите название ингредиента'
        type='text'
        value={formData.name}
        classNames={{
          inputWrapper: 'gb-default-100',
          input: "text-sm focus:outline-none"
        }}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        validate={(value) => {
          if (!value) return "Название обязательно";
          return null;
        }}
      />
      <div className='flex gap-2 w-full'>
        <div className='w-1/3'>
          <Select
            isRequired
            aria-label='Категория'
            name="category"
            placeholder='категория'
            selectedKeys={formData.category ? [formData.category] : []}
            classNames={{
              trigger: "bg-default-100 w-full",
              innerWrapper: "text-sm",
              value: "truncate",
              selectorIcon: "text-black"
            }}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value })
            }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} className='text-black'>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='w-1/3'>
          <Select
            isRequired
            aria-label='Единица измерения'
            name="unit"
            placeholder='Ед.изм'
            selectedKeys={formData.unit ? [formData.unit] : []}
            classNames={{
              trigger: "bg-default-100 w-full",
              innerWrapper: "text-sm",
              value: "truncate",
              selectorIcon: "text-black"
            }}
            onChange={(e) => {
              e.preventDefault;
              setFormData({ ...formData, unit: e.target.value })
            }}
          >
            {UNIT_OPTIONS.map((option) => (
              <SelectItem key={option.value} className='text-black'>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='w-1/3'>
          <Input
            isRequired
            name='pricePerUnit'
            placeholder="price"
            type='number'
            value={
              formData.pricePerUnit !== null
                ? formData.pricePerUnit.toString()
                : ""
            }
            classNames={{
              inputWrapper: "bg-default-100",
              input: "text-sm focus:outline-none"
            }}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              setFormData({ ...formData, pricePerUnit: value });
            }}
            endContent={
              <span className='absolute right-3 top-1/2 transform -translate-y-1' >
                ₽
              </span>
            }
            validate={(value) => {
              if (!value) return "Цена обязательна";
              const num = parseFloat(value);
              if (isNaN(num) || num < 0)
                return "Цена должна быть положительной";
              return null;
            }}

          />

        </div>
      </div>
      <Input
        name='description'
        placeholder="Enten description(optional)"
        type='text'
        value={formData.description}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none"
        }}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
      />

      <div className='flex w-full items-center justify-end'>
        {
          error
            ? <p>Произошла ошибка! Вы - гей</p>
            : null
        }
        <Button color="primary" type="submit" isLoading={isPending} >
          Добавить ингредиент
        </Button>
      </div>
      <Button color="primary" onPress={() => setError("Ошибка гейства")} isLoading={isPending} >
        Добавить ошибку
      </Button>
    </Form>
  )
}

export default IngredientForm;