import ApplicationForm from '@/components/applications/ApplicationForm';

export const metadata = { title: 'Sosyal Yardım Başvurusu', alternates: { canonical: '/basvurular/sosyal-yardim' } };

export default function SocialAidApplicationPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-3xl font-black text-eflavAntrasit">Sosyal Yardım Başvurusu</h1><p className="mb-8 mt-2 text-eflavMetinAcik">Talebiniz gizlilikle değerlendirilmek üzere kaydedilecektir.</p><ApplicationForm type="yardim" /></main>;
}
