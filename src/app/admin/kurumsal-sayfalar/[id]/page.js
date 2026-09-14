import { notFound } from 'next/navigation';
import ContentPageForm from '@/components/admin/ContentPageForm';
import { getContentPageById } from '@/lib/services/content-page.service';

export default async function Page({ params }) {
  const { id } = await params;
  const item = /^\d+$/.test(id) && await getContentPageById(Number(id));
  if (!item) notFound();
  return <section className="mx-auto max-w-4xl"><h1 className="mb-2 text-3xl font-black">{item.title}</h1><p className="mb-8 text-sm text-eflavMetinAcik">/hakkimizda/{item.slug}</p><ContentPageForm id={item.id} slug={item.slug} initialData={{ title:item.title, eyebrow:item.eyebrow || '', summary:item.summary, content:item.content, imageUrl:item.image_url || '', imageAlt:item.image_alt || '', members:(item.members || []).map((member) => ({ fullName:member.full_name, roleTitle:member.role_title, imageUrl:member.image_url, imageAlt:member.image_alt || '' })) }}/></section>;
}
