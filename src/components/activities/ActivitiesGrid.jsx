import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import ActivityCard from "./ActivityCard";

export default function ActivitiesGrid({ activities }) {
  return (
    <section className="border-b border-eflavSinir bg-white py-20">
      <Container>
        <SectionTitle
          eyebrow="Neler Yapıyoruz?"
          title="Faaliyet Alanlarımız"
          description="Karabük Eflani Hayır Kervanı Vakfı olarak eğitimden sosyal yardımlaşmaya, kültürel mirasın korunmasından toplumsal dayanışmaya kadar birçok alanda faaliyet gösteriyoruz."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}