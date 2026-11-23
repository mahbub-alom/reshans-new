import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();

  try {
    // Run a light ping query on the database
    // $queryRaw`SELECT 1 as connected` tests real connection to MariaDB/MySQL
    const pingResult = await prisma.$queryRaw<Array<{ connected: number | bigint }>>`SELECT 1 as connected`;
    const latencyMs = Date.now() - startTime;

    // Optional counts to give useful health status
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch {
      // ignore count failure if table not migrated yet
    }

    return NextResponse.json(
      {
        success: true,
        connected: true,
        message: 'Database is successfully connected',
        database: 'MariaDB / MySQL',
        latencyMs: `${latencyMs}ms`,
        userCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('Database connection test failed:', error);

    return NextResponse.json(
      {
        success: false,
        connected: false,
        message: 'Database connection failed',
        error: error.message || 'Unable to connect to database server',
        latencyMs: `${latencyMs}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
