"use server";

import { signIn } from "@/auth/auth";

async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error: any) {
    const code = error?.cause?.err?.code ?? error?.code;
    if (code === "USER_NOT_FOUND") {
      return { error: "Такого пользователя не существует" };
    }
    return { error: "Неверные данные для входа" };
  }
}

export default signInWithCredentials;