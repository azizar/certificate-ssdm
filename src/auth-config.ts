import { NextAuthConfig } from 'next-auth';
import Resend from 'next-auth/providers/resend';
import Google from 'next-auth/providers/google';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { Provider } from 'next-auth/providers';
import { DefaultSession } from '@auth/core/types';
import { DefaultJWT } from '@auth/core/jwt';
import prisma from './lib/prisma';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      admin: boolean;
    } & DefaultSession['user'];
  }

  interface JWT {
    user: {
      admin: boolean;
    } & DefaultJWT['user'];
  }
}

const providers: Provider[] = [
  Resend({
    id: 'resend',
    name: 'Magic Link',
    apiKey: process.env.RESEND_API_KEY,
    from: 'delivered@resend.dev',
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
      },
    },
  }),
];

export default {
  debug: false,
  trustHost: true,
  pages: {
    signIn: '/sign-in',
  },
  session: { strategy: 'jwt', maxAge: 12 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token) {
        session.user = {
          ...session.user,
          admin: token['admin'] == true,
        };
      }
      return session;
    },

    async authorized({ auth, request }) {
      return !!auth?.user;
    },

    async redirect({ baseUrl, url }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});
