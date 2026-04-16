import { signInSchema, carsSchema } from '@/schema/zod';

describe('signInSchema', () => {
  it('принимает корректные данные', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('отклоняет пустой email', () => {
    expect(() => {
      signInSchema.parse({
        email: '',
        password: '123456',
      });
    }).toThrow();
  });

  it('отклоняет пустой email', () => {
    const result = signInSchema.safeParse({
      email: '',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет невалидный email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет пустой пароль', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет пароль короче 6 символов', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет пароль длиннее 32 символов', () => {
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: 'a'.repeat(33),
    });
    expect(result.success).toBe(false);
  });
});

describe('carsSchema', () => {
  const validCar = {
    brand: 'BMW',
    model: 'M3',
    timeToOneHundred: '3:80',
    timeToQuater: '9:50',
    nurburgringTime: '7:49:001',
  };

  it('принимает корректные данные', () => {
    const result = carsSchema.safeParse(validCar);
    expect(result.success).toBe(true);
  });

  it('принимает данные с imageUrl', () => {
    const result = carsSchema.safeParse({
      ...validCar,
      imageUrl: 'https://example.com/car.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('принимает пустой imageUrl', () => {
    const result = carsSchema.safeParse({
      ...validCar,
      imageUrl: '',
    });
    expect(result.success).toBe(true);
  });

  it('отклоняет невалидный imageUrl', () => {
    const result = carsSchema.safeParse({
      ...validCar,
      imageUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет пустой brand', () => {
    const result = carsSchema.safeParse({ ...validCar, brand: '' });
    expect(result.success).toBe(false);
  });

  it('отклоняет неправильный формат timeToOneHundred', () => {
    const result = carsSchema.safeParse({
      ...validCar,
      timeToOneHundred: '380',
    });
    expect(result.success).toBe(false);
  });

  it('отклоняет неправильный формат nurburgringTime', () => {
    const result = carsSchema.safeParse({
      ...validCar,
      nurburgringTime: '7:49',
    });
    expect(result.success).toBe(false);
  });
});
