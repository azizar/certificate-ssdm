import NextAuth from 'next-auth';

type ErrorName = 'GET_TOKEN_ERROR' | 'UNKNOWN_ERROR' | 'SERVER_ERROR';

import authConfig from 'auth-config';


export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
