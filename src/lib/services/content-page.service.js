import { db } from '@/lib/db';

const fields = 'id,slug,title,eyebrow,summary,content,image_url,image_alt,created_at,updated_at';

async function getBoardMembers(connection = db) {
  const [rows] = await connection.execute('SELECT id,full_name,role_title,image_url,image_alt,sort_order FROM board_members ORDER BY sort_order,id');
  return rows;
}

async function attachMembers(page, connection = db) {
  return page?.slug === 'yonetim-kurulu'
    ? { ...page, members: await getBoardMembers(connection) }
    : page;
}

export async function getContentPages() {
  const [rows] = await db.execute(`SELECT ${fields} FROM content_pages ORDER BY id`);
  return rows;
}

export async function getContentPagesBySlugs(slugs) {
  if (!Array.isArray(slugs) || slugs.length === 0) return [];
  const placeholders = slugs.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT ${fields} FROM content_pages WHERE slug IN (${placeholders})`,
    slugs
  );
  return rows;
}

export async function getContentPageById(id) {
  const [rows] = await db.execute(`SELECT ${fields} FROM content_pages WHERE id=? LIMIT 1`, [id]);
  return attachMembers(rows[0] ?? null);
}

export async function getContentPageBySlug(slug) {
  const [rows] = await db.execute(`SELECT ${fields} FROM content_pages WHERE slug=? LIMIT 1`, [slug]);
  return attachMembers(rows[0] ?? null);
}

export async function updateContentPage(id, data, adminId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      'UPDATE content_pages SET title=?,eyebrow=?,summary=?,content=?,image_url=?,image_alt=?,updated_by=? WHERE id=?',
      [data.title, data.eyebrow || null, data.summary, data.content, data.imageUrl || null, data.imageAlt || null, adminId, id]
    );
    if (!result.affectedRows) {
      await connection.rollback();
      return false;
    }

    const [pages] = await connection.execute('SELECT slug FROM content_pages WHERE id=? LIMIT 1', [id]);
    if (pages[0]?.slug === 'yonetim-kurulu') {
      await connection.execute('DELETE FROM board_members');
      for (const [index, member] of (data.members || []).entries()) {
        await connection.execute(
          'INSERT INTO board_members(full_name,role_title,image_url,image_alt,sort_order,updated_by) VALUES(?,?,?,?,?,?)',
          [member.fullName, member.roleTitle, member.imageUrl, member.imageAlt || member.fullName, index, adminId]
        );
      }
    }
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
