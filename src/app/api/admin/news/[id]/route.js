import { NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/admin-session';
import { writeAuditLog } from '@/lib/services/audit.service';
import {
  deleteNews,
  getNewsById,
  getNewsBySlug,
  updateNews,
} from '@/lib/services/news.service';
import { newsSchema } from '@/lib/validations/news.schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getNewsId(params) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return null;
  }

  const newsId = Number(id);

  return Number.isSafeInteger(newsId) && newsId > 0 ? newsId : null;
}

function jsonError(message, status) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(_request, { params }) {
  try {
    if (!(await requireAdminRole(['admin', 'editor']))) {
      return jsonError('Bu işlem için giriş yapmalısınız.', 401);
    }

    const newsId = await getNewsId(params);

    if (!newsId) {
      return jsonError('Geçersiz haber kimliği.', 400);
    }

    const news = await getNewsById(newsId);

    if (!news) {
      return jsonError('Haber bulunamadı.', 404);
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Haber getirme API hatası:', error);
    return jsonError('Haber getirilemedi.', 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdminRole(['admin', 'editor']);
    if (!admin) {
      return jsonError('Bu işlem için giriş yapmalısınız.', 401);
    }

    const newsId = await getNewsId(params);

    if (!newsId) {
      return jsonError('Geçersiz haber kimliği.', 400);
    }

    const currentNews = await getNewsById(newsId);

    if (!currentNews) {
      return jsonError('Haber bulunamadı.', 404);
    }

    const validation = newsSchema.safeParse(await request.json());

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Haber bilgileri geçersiz.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const newsWithSameSlug = await getNewsBySlug(data.slug);

    if (newsWithSameSlug && Number(newsWithSameSlug.id) !== newsId) {
      return jsonError('Bu slug ile daha önce bir haber oluşturulmuş.', 409);
    }

    const publicationDate =
      data.status === 'published'
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : currentNews.published_at || new Date()
        : null;

    const updated = await updateNews(newsId, {
      ...data,
      imageUrl: data.imageUrl || null,
      imageAlt: data.imageAlt || null,
      publishedAt: publicationDate,
    });

    if (!updated) {
      return jsonError('Haber bulunamadı.', 404);
    }
    await writeAuditLog({ adminId:Number(admin.sub), action:'news.updated', entityType:'news', entityId:newsId, metadata:{title:data.title,status:data.status} });

    return NextResponse.json({
      success: true,
      message: 'Haber başarıyla güncellendi.',
      data: { id: newsId, slug: data.slug },
    });
  } catch (error) {
    console.error('Haber güncelleme API hatası:', error);

    if (error instanceof SyntaxError) {
      return jsonError('Geçersiz istek gövdesi.', 400);
    }

    if (error?.code === 'ER_DUP_ENTRY') {
      return jsonError('Bu slug ile daha önce bir haber oluşturulmuş.', 409);
    }

    return jsonError('Haber güncellenirken bir sunucu hatası oluştu.', 500);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const admin = await requireAdminRole(['admin']);
    if (!admin) {
      return jsonError('Bu işlem için yönetici yetkisi gerekir.', 403);
    }

    const newsId = await getNewsId(params);

    if (!newsId) {
      return jsonError('Geçersiz haber kimliği.', 400);
    }

    const deleted = await deleteNews(newsId);

    if (!deleted) {
      return jsonError('Haber bulunamadı.', 404);
    }
    await writeAuditLog({ adminId:Number(admin.sub), action:'news.deleted', entityType:'news', entityId:newsId });

    return NextResponse.json({
      success: true,
      message: 'Haber başarıyla silindi.',
    });
  } catch (error) {
    console.error('Haber silme API hatası:', error);

    if (error?.code === 'ER_ROW_IS_REFERENCED_2') {
      return jsonError(
        'Bu haber ilişkili kayıtları bulunduğu için silinemiyor.',
        409
      );
    }

    return jsonError('Haber silinirken bir sunucu hatası oluştu.', 500);
  }
}
