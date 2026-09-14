import { access, constants } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const uploadsRoot = process.env.UPLOAD_DIR || `${process.cwd()}/public/uploads`;

export async function GET() {
  const started = Date.now();
  const checks = await Promise.allSettled([
    db.execute('SELECT 1'),
    access(uploadsRoot, constants.R_OK | constants.W_OK),
  ]);
  const databaseOk = checks[0].status === 'fulfilled';
  const uploadsOk = checks[1].status === 'fulfilled';
  const healthy = databaseOk && uploadsOk;

  if (!healthy) console.error('Health check başarısız:', { databaseOk, uploadsOk });

  return NextResponse.json({
    status: healthy ? 'ok' : 'degraded',
    database: databaseOk ? 'ok' : 'unavailable',
    uploads: uploadsOk ? 'ok' : 'unavailable',
    latencyMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  }, {
    status: healthy ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
