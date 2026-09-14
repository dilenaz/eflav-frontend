import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().trim().min(3, 'Ad soyad en az 3 karakter olmalıdır.').max(150),
  email: z.string().trim().toLowerCase().email('Geçerli bir e-posta adresi giriniz.').max(190),
  subject: z.string().trim().min(5, 'Konu en az 5 karakter olmalıdır.').max(200),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalıdır.').max(5000),
  website: z.string().max(0).optional(),
});
