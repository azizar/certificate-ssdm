import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// let prisma: PrismaClient;
//
// if (process.env.NODE_ENV === 'production') {
//   // @ts-ignore
//   prisma = new PrismaClient().$extends(
//     pagination({
//       pages: { limit: 10, includePageCount: true },
//     }),
//   );
// } else {
//   if (!global.prisma) {
//     // @ts-ignore
//     global.prisma = new PrismaClient().$extends(
//       pagination({
//         pages: { limit: 10, includePageCount: true },
//       }),
//     );
//   }
//   prisma = global.prisma;
// }

const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? []
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;

// import { Pool } from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from 'db';
//
// const connectionString = `${process.env.DATABASE_URL}`;
//
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter: adapter });
//
// export default prisma;
