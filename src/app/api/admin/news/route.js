import { NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/admin-session';
import { writeAuditLog } from '@/lib/services/audit.service';
import {
  createNews,
  getAllNews,
  getNewsBySlug,
} from '@/lib/services/news.service';
import { newsSchema } from '@/lib/validations/news.schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await requireAdminRole(['admin', 'editor']);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      );
    }

    const news = await getAllNews();

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Haber listeleme API hatası:', error);

    return NextResponse.json(
      { success: false, message: 'Haberler getirilemedi.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdminRole(['admin', 'editor']);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = newsSchema.safeParse(body);

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
    const existingNews = await getNewsBySlug(data.slug);

    if (existingNews) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bu slug ile daha önce bir haber oluşturulmuş.',
        },
        { status: 409 }
      );
    }

    const publicationDate =
      data.status === 'published'
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null;

    const id = await createNews({
      ...data,
      imageUrl: data.imageUrl || null,
      imageAlt: data.imageAlt || null,
      publishedAt: publicationDate,
      createdBy: Number(admin.sub),
    });
    await writeAuditLog({ adminId:Number(admin.sub), action:'news.created', entityType:'news', entityId:id, metadata:{title:data.title,status:data.status} });

    return NextResponse.json(
      {
        success: true,
        message: 'Haber başarıyla oluşturuldu.',
        data: { id, slug: data.slug },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Haber oluşturma API hatası:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz istek gövdesi.' },
        { status: 400 }
      );
    }

    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        {
          success: false,
          message: 'Bu slug ile daha önce bir haber oluşturulmuş.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Haber oluşturulurken bir sunucu hatası oluştu.',
      },
      { status: 500 }
    );
  }
}
  
