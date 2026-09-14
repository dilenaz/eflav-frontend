import { db } from '@/lib/db';

export async function createContactMessage(data) {
  const [result] = await db.execute(
    `INSERT INTO contact_messages (full_name, email, subject, message)
     VALUES (?, ?, ?, ?)`,
    [data.fullName, data.email, data.subject, data.message]
  );
  return result.insertId;
}

export async function getContactMessages() {
  const [rows] = await db.execute(`
    SELECT id, full_name, email, subject, message, status, created_at, updated_at
    FROM contact_messages
    ORDER BY created_at DESC
  `);
  return rows;
}

export async function updateContactMessageStatus(id, status) {
  const [result] = await db.execute(
    'UPDATE contact_messages SET status=? WHERE id=?',
    [status, id]
  );
  return result.affectedRows > 0;
}
