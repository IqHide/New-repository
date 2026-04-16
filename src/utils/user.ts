import { prisma } from './prisma';

async function getUserFromDb(email: string) {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
}

export { getUserFromDb };
