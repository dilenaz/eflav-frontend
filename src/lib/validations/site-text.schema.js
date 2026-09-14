import { z } from 'zod';

export const siteTextsSchema = z.object({
  items: z.array(z.object({
    key: z.string().regex(/^[a-z0-9._-]{3,100}$/),
    value: z.string().trim().min(1, 'Bu alan boş bırakılamaz.').max(2000, 'Metin çok uzun.'),
  })).min(1).max(60),
});
