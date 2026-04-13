import { object, string } from 'zod';

export const signInSchema = object({
  email: string().min(1, 'Email is required').email('Invalid email'),
  password: string()
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const carsSchema = object({
  brand: string().min(1, 'Название бренда обязательно'),
  model: string().min(1, 'Название модели обязательно'),
  timeToOneHundred: string().regex(/^\d:\d{2}$/),
  timeToQuater: string().regex(/^\d:\d{2}$/),
  nurburgringTime: string().regex(/^\d:\d{2}:\d{3}$/),
  imageUrl: string().url().or(string().length(0)).optional(),
});
