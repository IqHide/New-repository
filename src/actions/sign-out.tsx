'use server';

import { signOut } from '@/auth/auth';

async function signOutFunc() {
  try {
    const result = await signOut({ redirect: false });
    return result;
  } catch (error) {
    console.error('Ошибка авторизации!', error);
    throw error;
  }
}

export default signOutFunc;
