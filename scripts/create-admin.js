const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

function requireValue(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} tanımlı değil.`);
  return value;
}

async function createAdmin() {
  const fullName = requireValue('INITIAL_ADMIN_NAME');
  const email = requireValue('INITIAL_ADMIN_EMAIL').toLowerCase();
  const password = requireValue('INITIAL_ADMIN_PASSWORD');

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('INITIAL_ADMIN_EMAIL geçerli değil.');
  if (password.length < 12) throw new Error('INITIAL_ADMIN_PASSWORD en az 12 karakter olmalı.');

  const connection = await mysql.createConnection({
    host: requireValue('DB_HOST'),
    port: Number(process.env.DB_PORT || 3306),
    user: requireValue('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    database: requireValue('DB_NAME'),
  });

  try {
    const [existing] = await connection.execute(
      'SELECT id FROM admins WHERE email=? LIMIT 1',
      [email]
    );
    if (existing.length) throw new Error('Bu e-posta adresiyle bir yönetici zaten mevcut.');

    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      "INSERT INTO admins (full_name,email,password_hash,role,is_active) VALUES (?,?,?,'admin',1)",
      [fullName, email, passwordHash]
    );
    console.log(`Yönetici oluşturuldu: ${email}`);
  } finally {
    await connection.end();
  }
}

createAdmin().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
