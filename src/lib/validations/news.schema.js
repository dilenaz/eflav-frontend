import { z } from 'zod';
import { IMAGE_URL_MESSAGE, isAllowedImageUrl } from '@/lib/image-url';

export const newsSchema = z.object({
  title: z.string().trim().min(5, 'Başlık en az 5 karakter olmalıdır.').max(255, 'Başlık en fazla 255 karakter olabilir.'),
  slug: z.string().trim().min(3, 'Slug en az 3 karakter olmalıdır.').max(255, 'Slug en fazla 255 karakter olabilir.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug yalnızca küçük harf, sayı ve tire içerebilir.'),
  summary: z.string().trim().min(10, 'Özet en az 10 karakter olmalıdır.').max(500, 'Özet en fazla 500 karakter olabilir.'),
  content: z.string().trim().min(20, 'Haber içeriği en az 20 karakter olmalıdır.').max(100000),
  category: z.string().trim().min(2, 'Kategori en az 2 karakter olmalıdır.').max(100, 'Kategori en fazla 100 karakter olabilir.').default('Vakıf Haberleri'),
  imageUrl: z.string().trim().max(500, 'Görsel adresi en fazla 500 karakter olabilir.').refine(isAllowedImageUrl, IMAGE_URL_MESSAGE).nullable().optional(),
  imageAlt: z.string().trim().max(255, 'Görsel açıklaması en fazla 255 karakter olabilir.').nullable().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
});
