import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SectionTitle from '@/components/ui/SectionTitle';
import { getAllAlbums } from '@/lib/services/gallery.service';

export default async function GalleryPreview({ texts = {} }) {
  let albums = [];
  try {
    albums = (await getAllAlbums(true)).slice(0,3);
  } catch {
    console.warn('Galeri: veritabanına ulaşılamadı.');
  }

  return <section className="bg-white py-20">
    <Container>
      <SectionTitle
        eyebrow={texts['home.gallery.eyebrow'] || 'Arşiv'}
        title={texts['home.gallery.title'] || 'Fotoğraf Albümü'}
        description={texts['home.gallery.description'] || 'Faaliyet ve buluşmalarımızdan kareler.'}
      />
      {albums.length ? <div className="grid gap-6 md:grid-cols-3">
        {albums.map((album) => <Card key={album.id} padding="none" className="overflow-hidden">
          <div className="relative h-64"><OptimizedImage src={album.cover_image_url} alt={album.cover_image_alt || album.title} fill fallbackSrc="/images/logo/eflanilogo.png" /></div>
          <div className="p-5"><h3 className="text-lg font-bold">{album.title}</h3><Button href={`/fotograf-albumu/${album.slug}`} variant="text" className="mt-3">Albümü Gör →</Button></div>
        </Card>)}
      </div> : <Card hover={false} className="text-center text-eflavMetinAcik">Galeri şu anda görüntülenemiyor.</Card>}
      <div className="mt-8 text-center"><Button href="/fotograf-albumu" variant="outline">Tüm Albümler</Button></div>
    </Container>
  </section>;
}
