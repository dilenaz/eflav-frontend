import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAllAlbums } from '@/lib/services/gallery.service';

const statusLabels = { draft:'Taslak', published:'Yayında', archived:'Arşivlendi' };

export default async function GalleryAdminPage() {
  const items = await getAllAlbums();
  return <section aria-labelledby="gallery-admin-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 id="gallery-admin-title" className="text-3xl font-black">Galeri Albümleri</h1><p className="mt-2 text-eflavMetinAcik">Fotoğraf albümlerini ve yayın durumlarını yönetin.</p></div><Button href="/admin/galeri/yeni">Yeni Albüm</Button></div>
    <div className="mt-8 grid gap-4">{items.map((item)=><Card key={item.id} hover={false} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-eflavMetinAcik">{statusLabels[item.status] || item.status}{Array.isArray(item.images) ? ` · ${item.images.length} fotoğraf` : ''}</p></div><Button href={`/admin/galeri/${item.id}`} variant="outline" size="sm">Düzenle</Button></Card>)}{!items.length&&<Card hover={false} className="text-center text-eflavMetinAcik">Henüz albüm bulunmuyor.</Card>}</div>
  </section>;
}
