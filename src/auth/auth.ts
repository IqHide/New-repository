import NextAuth, { CredentialsSignin } from 'next-auth';
import bcryptjs from 'bcryptjs';
import { ZodError } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '../schema/zod';
// Your own logic for dealing with plaintext password strings; be careful!
import { getUserFromDb } from '@/utils/user';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../utils/prisma';

class UserNotFoundError extends CredentialsSignin {
  code = 'USER_NOT_FOUND';
}

class InvalidPasswordError extends CredentialsSignin {
  code = 'INVALID_PASSWORD';
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            throw new UserNotFoundError();
          }

          const isPasswordValid = await bcryptjs.compare(password, user.password);

          if (!isPasswordValid) {
            throw new InvalidPasswordError();
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
