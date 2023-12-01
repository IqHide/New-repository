'use server';

import { IFormData } from '@/types/form-data';
import { prisma } from '@/utils/prisma';
import { saltAndHashPassword } from '@/utils/password';

async function registerUser(formData: IFormData) {
  const { email, password, confirmPassword } = formData;

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают' };
  }

  if (password.length < 6) {
    return { error: 'Пароль должен содержать не менее 6-и сомволов' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Пользователь с такой почтой уже существует' };
    }

    const pwHash = await saltAndHashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: pwHash,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user', error);
    return { error: 'Ошибка при регистрации' };
  }
}

export { registerUser };
