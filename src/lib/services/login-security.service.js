import crypto from 'node:crypto';

import { db } from '@/lib/db';

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

export function createLoginIdentifier(email, ipAddress) {
  return crypto
    .createHash('sha256')
    .update(`${email}|${ipAddress}`)
    .digest('hex');
}

export async function getLoginLimit(identifierHash) {
  const [rows] = await db.execute(
    `SELECT failed_count, blocked_until
     FROM admin_login_attempts WHERE identifier_hash=? LIMIT 1`,
    [identifierHash]
  );
  const attempt = rows[0];
  if (!attempt?.blocked_until) return { blocked: false };
  return { blocked: new Date(attempt.blocked_until) > new Date() };
}

export async function recordLoginFailure(identifierHash) {
  await db.execute(`
    INSERT INTO admin_login_attempts
      (identifier_hash, failed_count, first_failed_at, blocked_until)
    VALUES (?, 1, NOW(), NULL)
    ON DUPLICATE KEY UPDATE
      failed_count = IF(first_failed_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE), 1, failed_count + 1),
      first_failed_at = IF(first_failed_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE), NOW(), first_failed_at),
      blocked_until = IF(
        IF(first_failed_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE), 1, failed_count + 1) >= ?,
        DATE_ADD(NOW(), INTERVAL ? MINUTE),
        blocked_until
      )
  `, [identifierHash, MAX_ATTEMPTS, BLOCK_MINUTES]);
}

export async function clearLoginFailures(identifierHash) {
  await db.execute('DELETE FROM admin_login_attempts WHERE identifier_hash=?', [identifierHash]);
}
