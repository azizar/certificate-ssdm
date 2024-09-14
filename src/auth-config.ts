import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Provider } from 'next-auth/providers';
// import prisma from './lib/prisma';
import 'next-auth/jwt';
import prisma from './lib/prisma';

const providers: Provider[] = [
  // Resend({
  //   id: 'resend',
  //   name: 'Magic Link',
  //   apiKey: process.env.RESEND_API_KEY,
  //   from: 'delivered@resend.dev',
  // }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: 'consent',
        access_type: 'offline',
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
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, account }) {
      // console.log({
      //   expire: new Date(token.expires_at * 1000).toLocaleString('ID'),
      // });
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token');

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: JSON.stringify({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          token.access_token = newTokens.access_token;
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in,
          );
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token;

          console.log('Refresh token successfully : ' + token.email);
          return token;
        } catch (error) {
          console.error('Error refreshing access_token', error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError';
          return token;
        }
      }
    },

    async session({ session, token }) {
      session.error = token.error;
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

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: 'RefreshTokenError';
  }
}
