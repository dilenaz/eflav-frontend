const fs = require('node:fs');
const path = require('node:path');
const { loadEnvConfig } = require('@next/env');
const mysql = require('mysql2/promise');

loadEnvConfig(process.cwd());

async function backupDonations() {
  for (const key of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
    if (!process.env[key]) throw new Error(`${key} tanımlı değil.`);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    dateStrings: true,
  });

  try {
    const [donations] = await connection.execute('SELECT * FROM donations ORDER BY id');
    const [transactions] = await connection.execute('SELECT * FROM payment_transactions ORDER BY id');
    const [campaigns] = await connection.execute('SELECT id, collected_amount FROM campaigns ORDER BY id');
    const directory = path.resolve(process.env.BACKUP_DIR || path.join(process.cwd(), 'backups'));
    fs.mkdirSync(directory, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const target = path.join(directory, `donations-${stamp}.json`);
    fs.writeFileSync(target, JSON.stringify({ createdAt: new Date().toISOString(), donations, transactions, campaigns }, null, 2), { mode: 0o600 });
    console.log(`Bağış yedeği oluşturuldu: ${target}`);
  } finally {
    await connection.end();
  }
}

backupDonations().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
