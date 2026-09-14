import { z } from 'zod';

function isRealCalendarDate(value) {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function getTodayInTurkey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export const donationSchema = z.object({
  donationType: z.enum([
    'Eflani Genel Destek',
    'Eflani Yaşlıları Kış Desteği',
    'Eflani Köy Okulları',
  ]),
  paymentPeriod: z.enum(['tek_seferlik', 'aylik_duzenli']),
  amount: z.coerce
    .number()
    .positive("Bağış miktarı 0'dan büyük olmalıdır.")
    .max(100_000_000)
    .multipleOf(0.01, 'Bağış miktarı en fazla iki ondalık basamak içerebilir.'),
  senderName: z.string().trim().min(3).max(150),
  transferDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(isRealCalendarDate, 'Geçerli bir transfer tarihi giriniz.')
    .refine((value) => value <= getTodayInTurkey(), 'Transfer tarihi gelecekte olamaz.'),
  dedicationName: z.string().trim().max(150).optional().nullable(),
  isAnonymous: z.boolean().default(false),
  website: z.string().max(0).optional(),
});
