import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function ActivityCard({ activity }) {
  return (
    <Card padding="none" className="flex h-full flex-col overflow-hidden border border-eflavSinir transition-all duration-300 hover:-translate-y-1 hover:border-eflavAltin hover:shadow-lg">
      <div className="relative aspect-[16/10] bg-white">
        <OptimizedImage src={activity.image_url} alt={activity.image_alt || activity.title} fill fallbackSrc="/images/logo/eflanilogo.png" imageClassName="object-cover object-center" />
      </div>
      <div className="flex h-full flex-col p-8">
        <h3 className="mb-3 text-xl font-bold text-eflavAntrasit">
          {activity.title}
        </h3>

        <p className="mb-6 flex-1 leading-7 text-eflavMetin">
          {activity.summary}
        </p>

        <Button
          href={`/faaliyetler/${activity.slug}`}
          variant="text"
          className="self-start"
        >
          İncele →
        </Button>
      </div>
    </Card>
  );
}
