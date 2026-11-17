import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/my-app';

  let host = 'localhost';
  let port = 3306;
  let user = 'root';
  let password = '';
  let database = 'my-app';

  try {
    const sanitized = databaseUrl.replace(/^mysql:\/\//, 'http://');
    const parsed = new URL(sanitized);
    host = parsed.hostname || 'localhost';
    port = parsed.port ? Number(parsed.port) : 3306;
    user = parsed.username || 'root';
    password = parsed.password || '';
    database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'my-app';
  } catch (err) {
    console.warn('Could not parse DATABASE_URL, using default MySQL settings:', err);
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
    connectTimeout: 1000,
    acquireTimeout: 1000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
