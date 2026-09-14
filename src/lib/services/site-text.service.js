import { db } from '@/lib/db';

export async function getSiteTexts() {
  const [rows] = await db.execute(
    'SELECT text_key,group_name,label,value,input_type,sort_order,updated_at FROM site_texts ORDER BY group_name,sort_order,text_key'
  );
  return rows;
}

export async function getSiteTextMap() {
  const [rows] = await db.execute('SELECT text_key,value FROM site_texts');
  return Object.fromEntries(rows.map((row) => [row.text_key, row.value]));
}

export async function updateSiteTexts(items, adminId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of items) {
      await connection.execute(
        'UPDATE site_texts SET value=?,updated_by=? WHERE text_key=?',
        [item.value.trim(), adminId, item.key]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
