"use client";

import { useState } from "react";
import Image from "next/image";

import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import CarouselControls from "./CarouselControls";

export default function ActivitiesCarousel({ events = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const currentEvent = events[activeSlide];

  const nextSlide = () => {
    setActiveSlide((previousSlide) =>
      previousSlide === events.length - 1 ? 0 : previousSlide + 1
    );
  };

  const previousSlide = () => {
    setActiveSlide((previousSlide) =>
      previousSlide === 0 ? events.length - 1 : previousSlide - 1
    );
  };

  if (!currentEvent) {
    return null;
  }

  return (
    <section
      className="border-y border-eflavSinir bg-eflavKrem py-20"
      aria-labelledby="past-events-title"
    >
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Kronolojik İcraat Arşivi"
            title="Geçmiş Etkinliklerimiz"
            align="left"
            className="mb-0"
          />

          <Button
            href="/etkinlikler"
            variant="outline"
            size="md"
            className="shrink-0 self-start md:self-auto"
          >
            Tüm Takvimi Gör
          </Button>
        </div>

        <Card
          padding="none"
          hover={false}
          className="overflow-hidden"
        >
          <div
            className="grid min-h-[450px] grid-cols-1 lg:grid-cols-2"
            role="region"
            aria-roledescription="carousel"
            aria-label="Geçmiş etkinlikler"
            aria-live="polite"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-eflavSinir">
              <Image
                key={currentEvent.id}
                src={currentEvent.image}
                alt={currentEvent.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              <time
                className="absolute left-4 top-4 rounded-md bg-eflavBordo px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                dateTime={currentEvent.dateTime}
              >
                {currentEvent.date}
              </time>
            </div>

            <div className="flex flex-col justify-between p-8 md:p-12">
              <article>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-eflavAltin">
                  <span aria-hidden="true">📍</span>{" "}
                  {currentEvent.location}
                </p>

                <h3
                  id="past-events-title"
                  className="mb-4 text-2xl font-bold leading-tight text-eflavAntrasit"
                >
                  {currentEvent.title}
                </h3>

                <p className="leading-7 text-eflavMetin">
                  {currentEvent.description}
                </p>
              </article>

              <div className="mt-8">
                <CarouselControls
                  current={activeSlide + 1}
                  total={events.length}
                  onPrevious={previousSlide}
                  onNext={nextSlide}
                />
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}