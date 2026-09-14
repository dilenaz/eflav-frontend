const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

function requireValue(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} tanımlı değil.`);
  return value;
}

async function migrate() {
  const database = requireValue('DB_NAME');
  if (!/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error('DB_NAME yalnızca harf, rakam ve alt çizgi içerebilir.');
  }

  const connectionConfig = {
    host: requireValue('DB_HOST'),
    port: Number(process.env.DB_PORT || 3306),
    user: requireValue('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    connectTimeout: 5000,
  };

  let connection;
  try {
    connection = await mysql.createConnection({
      ...connectionConfig,
      database,
      multipleStatements: true,
    });
  } catch (error) {
    if (error?.code !== 'ER_BAD_DB_ERROR') throw error;

    const bootstrapConnection = await mysql.createConnection(connectionConfig);
    try {
      await bootstrapConnection.query(
        `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    } finally {
      await bootstrapConnection.end();
    }

    connection = await mysql.createConnection({
      ...connectionConfig,
      database,
      multipleStatements: true,
    });
  }

  const lockName = `eflav:migrations:${database}`;
  let hasLock = false;

  try {
    const [lockRows] = await connection.execute(
      'SELECT GET_LOCK(?, 30) AS acquired',
      [lockName]
    );
    hasLock = Number(lockRows[0]?.acquired) === 1;
    if (!hasLock) {
      throw new Error('Migration kilidi alınamadı; başka bir migration işlemi çalışıyor.');
    }

    await connection.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    const directory = path.join(process.cwd(), 'migrations');
    const files = fs.readdirSync(directory).filter((file) => file.endsWith('.sql')).sort();
    let appliedCount = 0;

    for (const file of files) {
      const sql = fs.readFileSync(path.join(directory, file), 'utf8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');
      const [rows] = await connection.execute(
        'SELECT checksum FROM schema_migrations WHERE name=? LIMIT 1',
        [file]
      );

      if (rows[0]) {
        if (rows[0].checksum !== checksum) {
          throw new Error(`Uygulanmış migration değiştirilmiş: ${file}`);
        }
        continue;
      }

      try {
        await connection.query(sql);
        await connection.execute(
          'INSERT INTO schema_migrations (name, checksum) VALUES (?, ?)',
          [file, checksum]
        );
        appliedCount += 1;
        console.log(`Uygulandı: ${file}`);
      } catch (error) {
        throw new Error(`${file} uygulanamadı: ${error.message}`, { cause: error });
      }
    }
    console.log(
      appliedCount > 0
        ? `${appliedCount} migration uygulandı; toplam ${files.length} migration güncel.`
        : `Migrationlar güncel (${files.length}/${files.length}).`
    );
  } finally {
    if (hasLock) {
      await connection.execute('SELECT RELEASE_LOCK(?)', [lockName]);
    }
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error(error?.code || error?.message || String(error));
  process.exitCode = 1;
});
