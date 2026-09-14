import mysql from "mysql2/promise";

const globalForDb = globalThis;

export const db =
  globalForDb.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: "utf8mb4",
    dateStrings: ["DATE"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = db;
}

const DATABASE_CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "PROTOCOL_CONNECTION_LOST",
]);

export function isDatabaseUnavailableError(error) {
  if (!error || typeof error !== "object") return false;
  if (DATABASE_CONNECTION_CODES.has(error.code)) return true;

  const nestedErrors = Array.isArray(error.errors) ? error.errors : [];
  return nestedErrors.some(isDatabaseUnavailableError);
}
