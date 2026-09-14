import { db } from '@/lib/db';

const fields = 'id,title,slug,activity_date,icon,summary,content,image_url,image_alt,source_label,source_url,status,sort_order,created_at,updated_at';

export async function getAllActivities() {
  const [rows] = await db.execute(`SELECT ${fields} FROM activities ORDER BY activity_date DESC,sort_order,id DESC`);
  return rows;
}

export async function getPublishedActivities(limit) {
  const params = [];
  let sql = `SELECT ${fields} FROM activities WHERE status='published' AND activity_date<=CURRENT_DATE ORDER BY activity_date DESC,sort_order,id DESC`;
  if (Number.isInteger(limit) && limit > 0) {
    sql += ' LIMIT ?';
    params.push(limit);
  }
  const [rows] = await db.execute(sql, params);
  return rows;
}

export async function getActivityById(id) { const [rows] = await db.execute(`SELECT ${fields} FROM activities WHERE id=? LIMIT 1`, [id]); return rows[0] ?? null; }
export async function getActivityBySlug(slug, published = false) { const [rows] = await db.execute(`SELECT ${fields} FROM activities WHERE slug=?${published ? " AND status='published'" : ''} LIMIT 1`, [slug]); return rows[0] ?? null; }
export async function createActivity(d, admin) { const [r] = await db.execute('INSERT INTO activities(title,slug,activity_date,icon,summary,content,image_url,image_alt,source_label,source_url,status,sort_order,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [d.title,d.slug,d.activityDate,d.icon||null,d.summary,d.content,d.imageUrl||null,d.imageAlt||null,d.sourceLabel||null,d.sourceUrl||null,d.status,d.sortOrder,admin]); return r.insertId; }
export async function updateActivity(id, d) { const [r] = await db.execute('UPDATE activities SET title=?,slug=?,activity_date=?,icon=?,summary=?,content=?,image_url=?,image_alt=?,source_label=?,source_url=?,status=?,sort_order=? WHERE id=?', [d.title,d.slug,d.activityDate,d.icon||null,d.summary,d.content,d.imageUrl||null,d.imageAlt||null,d.sourceLabel||null,d.sourceUrl||null,d.status,d.sortOrder,id]); return r.affectedRows > 0; }
export async function deleteActivity(id) { const [r] = await db.execute('DELETE FROM activities WHERE id=?', [id]); return r.affectedRows > 0; }
