// import authConfig from 'auth-config';
// import NextAuth from 'next-auth';
// import { NextRequest, NextResponse } from 'next/server';

// const { auth } = NextAuth(authConfig);
// export default auth(async function middleware(req: NextRequest) {
//   console.log('asu');

//   return NextResponse.next();
// });
export { auth as middleware } from 'auth';


// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// export const runtime = 'experimental-edge';
