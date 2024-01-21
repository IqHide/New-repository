"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from "@/store/ingredient.store";
import { TableCell, Table, TableBody, TableHeader, TableColumn, TableRow, Button } from "@heroui/react";

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore();
  const { isAuth } = useAuthStore();
  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORY_OPTIONS.find(item => item.value === category)?.label;
  }

  const getUnitLabel = (unit: string) => {
    return UNIT_OPTIONS.find(item => item.value === unit)?.label;
  }

  if (!isAuth) {
    return <p>Пользователь не авторизован</p>
  }

  return (!isLoading && isAuth) ? (
    <Table
      aria-label="Список ингридиентов"
      classNames={{
        wrapper: "mt-4",
        table: "w-full",
        th: "text-black",
        td: "text-black",
      }}
    >
      <TableHeader>
        <TableColumn>Название</TableColumn>
        <TableColumn>Категории</TableColumn>
        <TableColumn>Ед. изм</TableColumn>
        <TableColumn>Цена за единицу</TableColumn>
        <TableColumn>Описание</TableColumn>
        <TableColumn>Действия</TableColumn>
      </TableHeader>
      <TableBody>
        {ingredients.map((ingredient) => (
          <TableRow key={ingredient.id} >
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{getCategoryLabel(ingredient.category) ?? ingredient.category}</TableCell>
            <TableCell>{getUnitLabel(ingredient.unit) ?? ingredient.unit}</TableCell>
            <TableCell>{ingredient.pricePerUnit !== null
              ? `${ingredient.pricePerUnit}₽ `
              : "-"}
            </TableCell>
            <TableCell>{ingredient.description || "-"}</TableCell>
            <TableCell>
              <Button
                onPress={() => handleDelete(ingredient.id)}
                size="sm"
                color="danger"
              >
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )
    : (
      <p className="mt-4" >Загрузка...</p>
    );

}

export default IngredientsTable;