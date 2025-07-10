import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Check if we're in a build environment
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Only initialize Prisma if we're not in build time or if DATABASE_URL is available
export const prisma =
  global.prisma ||
  (!isBuildTime && process.env.DATABASE_URL
    ? new PrismaClient()
    : (null as any));

if (process.env.NODE_ENV !== 'production' && prisma) {
  global.prisma = prisma;
}
