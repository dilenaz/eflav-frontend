const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const tables = [
  'campaigns',
  'news',
  'activities',
  'gallery_albums',
  'gallery_images',
  'content_pages',
  'board_members',
  'site_texts',
];
const adminColumns = new Set(['created_by', 'updated_by']);

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (Buffer.isBuffer(value)) return `0x${value.toString('hex')}`;
  const hex = Buffer.from(String(value), 'utf8').toString('hex');
  return `CONVERT(0x${hex} USING utf8mb4)`;
}

async function exportPublicContent() {
  for (const key of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
    if (!process.env[key]) throw new Error(`${key} tanımlı değil.`);
  }

  const target = path.resolve(process.argv[2] || path.join(process.cwd(), 'release', 'public-content.sql'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    dateStrings: true,
  });

  const statements = [
    '-- Karabük Eflani Hayır Kervanı Vakfı: halka açık içerik aktarımı',
    '-- Önce npm run db:migrate çalıştırılmalıdır.',
    'SET NAMES utf8mb4;',
    'SET FOREIGN_KEY_CHECKS=0;',
  ];

  try {
    for (const table of tables) {
      const [rows, fields] = await connection.query(`SELECT * FROM \`${table}\` ORDER BY 1`);
      statements.push(`DELETE FROM \`${table}\`;`);
      if (!rows.length) continue;
      const columns = fields.map((field) => field.name);
      for (let offset = 0; offset < rows.length; offset += 100) {
        const chunk = rows.slice(offset, offset + 100);
        const values = chunk.map((row) => `(${columns.map((column) => sqlValue(adminColumns.has(column) ? null : row[column])).join(',')})`);
        statements.push(`INSERT INTO \`${table}\` (${columns.map((column) => `\`${column}\``).join(',')}) VALUES\n${values.join(',\n')};`);
      }
    }
  } finally {
    await connection.end();
  }

  statements.push('SET FOREIGN_KEY_CHECKS=1;', '');
  fs.writeFileSync(target, statements.join('\n'), { encoding:'utf8', mode:0o600 });
  console.log(`Halka açık içerik aktarımı oluşturuldu: ${target}`);
}

exportPublicContent().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
