import { saltAndHashPassword } from "@/utils/password";
import bcrypt from "bcryptjs";

describe("saltAndHashPassword", () => {
  it("возвращает строку", async () => {
    const hash = await saltAndHashPassword("mypassword");
    expect(typeof hash).toBe("string");
  });

  it("хэш отличается от исходного пароля", async () => {
    const password = "mypassword";
    const hash = await saltAndHashPassword(password);
    expect(hash).not.toBe(password);
  });

  it("хэш можно верифицировать через bcrypt", async () => {
    const password = "mypassword";
    const hash = await saltAndHashPassword(password);
    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it("два хэша одного пароля не совпадают (соль разная)", async () => {
    const password = "mypassword";
    const hash1 = await saltAndHashPassword(password);
    const hash2 = await saltAndHashPassword(password);
    expect(hash1).not.toBe(hash2);
  });

  it("неверный пароль не проходит верификацию", async () => {
    const hash = await saltAndHashPassword("correctpassword");
    const isMatch = await bcrypt.compare("wrongpassword", hash);
    expect(isMatch).toBe(false);
  });
});
