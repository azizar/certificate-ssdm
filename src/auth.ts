import NextAuth from 'next-auth';

type ErrorName = 'GET_TOKEN_ERROR' | 'UNKNOWN_ERROR' | 'SERVER_ERROR';

import authConfig from 'auth-config';
import { DefaultSession } from '@auth/core/types';
import { DefaultJWT } from '@auth/core/jwt';

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

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
