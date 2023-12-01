import bcrypt from 'bcryptjs';

async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
}

export { saltAndHashPassword };
