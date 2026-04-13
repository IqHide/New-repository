'use server';

import { signIn } from '@/auth/auth';

async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirect: false });
    return { success: true };
  } catch (error: unknown) {
    const err = error as { cause?: { err?: { code?: string } }; code?: string };
    const code = err?.cause?.err?.code ?? err?.code;
    if (code === 'USER_NOT_FOUND') {
      return { error: 'Такого пользователя не существует' };
    }
    return { error: 'Неверные данные для входа' };
  }
}

export default signInWithCredentials;
