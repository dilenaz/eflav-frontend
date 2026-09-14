import assert from 'node:assert/strict';
import test from 'node:test';

import { toDateOnly } from '../src/lib/date-only.js';

test('takvim tarihini UTC dönüşümüyle bir gün geriye kaydırmıyor', () => {
  const localDate = new Date(2026, 6, 27);
  assert.equal(toDateOnly(localDate), '2026-07-27');
});

test('MySQL DATE ve DATETIME metinlerinden tarih bölümünü koruyor', () => {
  assert.equal(toDateOnly('2026-07-27'), '2026-07-27');
  assert.equal(toDateOnly('2026-07-27 14:30:00'), '2026-07-27');
});

test('geçersiz tarihler form alanına taşınmıyor', () => {
  assert.equal(toDateOnly('geçersiz'), '');
});
