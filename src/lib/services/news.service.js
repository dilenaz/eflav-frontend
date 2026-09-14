import { db } from '@/lib/db';

export async function getAllNews() {
  const [rows] = await db.execute(`
    SELECT
      id,
      title,
      slug,
      summary,
      content,
      category,
      image_url,
      image_alt,
      is_featured,
      status,
      published_at,
      created_at,
      updated_at
    FROM news
    ORDER BY created_at DESC
  `);

  return rows;
}

export async function getPublishedNews() {
  const [rows] = await db.execute(`
    SELECT
      id,
      title,
      slug,
      summary,
      category,
      image_url,
      image_alt,
      published_at
    FROM news
    WHERE status='published'
    ORDER BY published_at DESC
  `);

  return rows;
}

export async function getNewsBySlug(slug) {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM news
      WHERE slug=?
      LIMIT 1
    `,
    [slug]
  );

  return rows[0] ?? null;
}

export async function getPublishedNewsBySlug(slug) {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        title,
        slug,
        summary,
        content,
        category,
        image_url,
        image_alt,
        published_at,
        updated_at
      FROM news
      WHERE slug=? AND status='published'
      LIMIT 1
    `,
    [slug]
  );

  return rows[0] ?? null;
}

export async function getHomepageNews(limit = 3) {
  const safeLimit = Number.isSafeInteger(limit) && limit > 0
    ? Math.min(limit, 12)
    : 3;
  const [rows] = await db.execute(`
    SELECT
      id,
      title,
      slug,
      summary,
      category,
      image_url,
      image_alt,
      is_featured,
      published_at
    FROM news
    WHERE status='published'
    ORDER BY published_at DESC, id DESC
    LIMIT ${safeLimit}
  `);

  return rows;
}

export async function getNewsById(id) {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        title,
        slug,
        summary,
        content,
        category,
        image_url,
        image_alt,
        is_featured,
        status,
        published_at,
        created_at,
        updated_at
      FROM news
      WHERE id=?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function createNews(data) {
  const [result] = await db.execute(
    `
      INSERT INTO news
      (
        title,
        slug,
        summary,
        content,
        category,
        image_url,
        image_alt,
        is_featured,
        status,
        published_at,
        created_by
      )
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      data.title,
      data.slug,
      data.summary,
      data.content,
      data.category,
      data.imageUrl,
      data.imageAlt,
      data.isFeatured ? 1 : 0,
      data.status,
      data.publishedAt,
      data.createdBy,
    ]
  );

  return result.insertId;
}

export async function deleteNews(id) {
  const [result] = await db.execute(
    `
      DELETE FROM news
      WHERE id=?
    `,
    [id]
  );

  return result.affectedRows > 0;
}

export async function updateNews(id, data) {
  const [result] = await db.execute(
    `
      UPDATE news
      SET
        title=?,
        slug=?,
        summary=?,
        content=?,
        category=?,
        image_url=?,
        image_alt=?,
        is_featured=?,
        status=?,
        published_at=?
      WHERE id=?
    `,
    [
      data.title,
      data.slug,
      data.summary,
      data.content,
      data.category,
      data.imageUrl,
      data.imageAlt,
      data.isFeatured ? 1 : 0,
      data.status,
      data.publishedAt,
      id,
    ]
  );

  return result.affectedRows > 0;
}
