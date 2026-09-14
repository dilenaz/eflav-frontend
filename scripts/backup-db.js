const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

async function backup() {
  for (const key of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
    if (!process.env[key]) throw new Error(`${key} tanımlı değil.`);
  }

  const directory = path.resolve(process.env.BACKUP_DIR || path.join(process.cwd(), 'backups'));
  const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 30);
  if (!Number.isInteger(retentionDays) || retentionDays < 1) throw new Error('BACKUP_RETENTION_DAYS pozitif bir tam sayı olmalı.');
  fs.mkdirSync(directory, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(directory, `${process.env.DB_NAME}-${stamp}.sql.gz`);
  const dump = spawn('mysqldump', [
    '--single-transaction', '--quick', '--routines', '--triggers',
    '--host', process.env.DB_HOST,
    '--port', process.env.DB_PORT || '3306',
    '--user', process.env.DB_USER,
    '--default-character-set=utf8mb4',
    process.env.DB_NAME,
  ], {
    env: { ...process.env, MYSQL_PWD: process.env.DB_PASSWORD || '' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const dumpExit = new Promise((resolve, reject) => {
    dump.once('error', reject);
    dump.once('close', resolve);
  });

  try {
    await pipeline(dump.stdout, createGzip({ level: 9 }), fs.createWriteStream(target, { mode: 0o600 }));
    const code = await dumpExit;
    if (code !== 0) throw new Error(`mysqldump hata kodu: ${code}`);
  } catch (error) {
    fs.rmSync(target, { force: true });
    throw error;
  }

  const cutoff = Date.now() - retentionDays * 86400000;
  for (const file of fs.readdirSync(directory)) {
    const item = path.join(directory, file);
    if (file.endsWith('.sql.gz') && fs.statSync(item).mtimeMs < cutoff) fs.rmSync(item);
  }
  console.log(`Yedek oluşturuldu: ${target}`);
}

backup().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
