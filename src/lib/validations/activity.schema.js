import { z } from 'zod';
import { IMAGE_URL_MESSAGE, isAllowedImageUrl } from '@/lib/image-url';

export const activitySchema = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  activityDate: z.iso.date(),
  icon: z.string().trim().max(32).nullable().optional(),
  summary: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20).max(100000),
  imageUrl: z.string().trim().max(500).refine(isAllowedImageUrl, IMAGE_URL_MESSAGE).nullable().optional(),
  imageAlt: z.string().trim().max(255).nullable().optional(),
  sourceLabel: z.string().trim().max(150).nullable().optional(),
  sourceUrl: z.string().trim().max(500).url().refine((value) => new URL(value).protocol === 'https:', 'Kaynak adresi HTTPS olmalıdır.').nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  sortOrder: z.coerce.number().int().min(0).max(32767),
});
