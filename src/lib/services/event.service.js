import { db } from '@/lib/db';

const fields = `id, title, slug, summary, content, event_date, event_time,
  location, image_url, image_alt, status, created_at, updated_at`;

export async function getAllEvents() {
  const [rows] = await db.execute(`SELECT ${fields} FROM events ORDER BY event_date DESC`);
  return rows;
}
export async function getPublishedEvents() {
  const [rows] = await db.execute(`SELECT ${fields} FROM events WHERE status='published' AND event_date>=CURRENT_DATE ORDER BY event_date ASC`);
  return rows;
}
export async function getEventById(id) {
  const [rows] = await db.execute(`SELECT ${fields} FROM events WHERE id=? LIMIT 1`, [id]);
  return rows[0] ?? null;
}
export async function getEventBySlug(slug, publishedOnly = false) {
  const [rows] = await db.execute(`SELECT ${fields} FROM events WHERE slug=?${publishedOnly ? " AND status='published'" : ''} LIMIT 1`, [slug]);
  return rows[0] ?? null;
}
export async function createEvent(data, adminId) {
  const [result] = await db.execute(`INSERT INTO events
    (title,slug,summary,content,event_date,event_time,location,image_url,image_alt,status,created_by)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [data.title,data.slug,data.summary,data.content,data.eventDate,data.eventTime||null,data.location,data.imageUrl||null,data.imageAlt||null,data.status,adminId]);
  return result.insertId;
}
export async function updateEvent(id, data) {
  const [result] = await db.execute(`UPDATE events SET title=?,slug=?,summary=?,content=?,event_date=?,event_time=?,location=?,image_url=?,image_alt=?,status=? WHERE id=?`, [data.title,data.slug,data.summary,data.content,data.eventDate,data.eventTime||null,data.location,data.imageUrl||null,data.imageAlt||null,data.status,id]);
  return result.affectedRows > 0;
}
export async function deleteEvent(id) {
  const [result] = await db.execute('DELETE FROM events WHERE id=?', [id]);
  return result.affectedRows > 0;
}
