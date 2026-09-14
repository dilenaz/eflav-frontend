import { z } from 'zod';
import { IMAGE_URL_MESSAGE, isAllowedImageUrl } from '@/lib/image-url';

export const eventSchema = z.object({
  title: z.string().trim().min(5).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20).max(100000),
  eventDate: z.iso.date(),
  eventTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().optional(),
  location: z.string().trim().min(2).max(255),
  imageUrl: z.string().trim().max(500).refine(isAllowedImageUrl, IMAGE_URL_MESSAGE).nullable().optional(),
  imageAlt: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});
