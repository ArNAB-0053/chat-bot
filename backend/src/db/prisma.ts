import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../config/env.js';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaAdapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const configuredPrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    adapter: prismaAdapter as never,
  });

if (env.NODE_ENV !== 'production') {
  globalThis.prisma = configuredPrismaClient;
}

export const prisma = configuredPrismaClient;
