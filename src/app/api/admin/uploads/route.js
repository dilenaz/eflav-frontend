import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

import { requireAdminRole } from '@/lib/admin-session';
import { writeAuditLog } from '@/lib/services/audit.service';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOADS_ROOT = process.env.UPLOAD_DIR || `${process.cwd()}/public/uploads`;
const types = {
  'image/jpeg': { extension: 'jpg', signature: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { extension: 'png', signature: (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  'image/webp': { extension: 'webp', signature: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  'image/gif': { extension: 'gif', signature: (b) => ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString()) },
};

export async function POST(request) {
  try {
    const admin = await requireAdminRole(['admin', 'editor']);
    if (!admin) return NextResponse.json({ success: false, message: 'Yetkisiz işlem.' }, { status: 401 });

    const contentType = request.headers.get('content-type')?.toLowerCase() || '';
    if (!contentType.startsWith('multipart/form-data;')) {
      return NextResponse.json({ success: false, message: 'Yalnızca form-data yüklemesi kabul edilir.' }, { status: 415 });
    }
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_FILE_SIZE + 256 * 1024) {
      return NextResponse.json({ success: false, message: 'Yükleme isteği çok büyük.' }, { status: 413 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ success: false, message: 'Görsel dosyası seçilmedi.' }, { status: 400 });
    if (!file.size || file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, message: 'Görsel en fazla 5 MB olabilir.' }, { status: 413 });

    const type = types[file.type];
    if (!type) return NextResponse.json({ success: false, message: 'Yalnızca JPG, PNG, WEBP veya GIF yüklenebilir.' }, { status: 415 });

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!type.signature(buffer)) return NextResponse.json({ success: false, message: 'Dosya içeriği geçerli bir görsel değil.' }, { status: 415 });

    const now = new Date();
    const segments = [String(now.getUTCFullYear()), String(now.getUTCMonth() + 1).padStart(2, '0')];
    const directory = path.join(/*turbopackIgnore: true*/ UPLOADS_ROOT, segments[0], segments[1]);
    await mkdir(directory, { recursive: true });
    const filename = `${randomUUID()}.${type.extension}`;
    await writeFile(path.join(/*turbopackIgnore: true*/ directory, filename), buffer, { flag: 'wx', mode: 0o644 });
    const url = `/uploads/${segments.join('/')}/${filename}`;

    await writeAuditLog({ adminId: Number(admin.sub), action: 'image.uploaded', entityType: 'upload', metadata: { url, size: file.size, type: file.type } });
    return NextResponse.json({ success: true, url }, { status: 201 });
  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    return NextResponse.json({ success: false, message: 'Görsel yüklenemedi.' }, { status: 500 });
  }
}
