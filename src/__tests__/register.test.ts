// Мокаем Prisma — чтобы тесты не ходили в реальную БД
jest.mock('@/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { registerUser } from '@/actions/register';
import { prisma } from '@/utils/prisma';

// Приводим мок к нужному типу, чтобы TypeScript не ругался
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает ошибку если пароли не совпадают', async () => {
    const result = await registerUser({
      email: 'user@example.com',
      password: 'password1',
      confirmPassword: 'password2',
    });
    expect(result).toEqual({ error: 'Пароли не совпадают' });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('возвращает ошибку если пароль короче 6 символов', async () => {
    const result = await registerUser({
      email: 'user@example.com',
      password: '123',
      confirmPassword: '123',
    });
    expect(result).toEqual({ error: 'Пароль должен содержать не менее 6-и сомволов' });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('возвращает ошибку если пользователь уже существует', async () => {
    mockFindUnique.mockResolvedValue({ id: '1', email: 'user@example.com' });

    const result = await registerUser({
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result).toEqual({ error: 'Пользователь с такой почтой уже существует' });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('создаёт пользователя и возвращает его при успешной регистрации', async () => {
    mockFindUnique.mockResolvedValue(null);
    const fakeUser = { id: '1', email: 'user@example.com', password: 'hashed' };
    mockCreate.mockResolvedValue(fakeUser);

    const result = await registerUser({
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeUser);
  });

  it('возвращает ошибку если Prisma выбрасывает исключение', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB error'));

    const result = await registerUser({
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(result).toEqual({ error: 'Ошибка при регистрации' });
  });
});
