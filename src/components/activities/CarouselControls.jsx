import Button from "@/components/ui/Button";

export default function CarouselControls({
  current,
  total,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between border-t border-eflavSinir pt-8">
      <span className="text-xs font-bold tracking-wider text-eflavMetinAcik">
        {current} / {total}
      </span>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onPrevious}
          aria-label="Önceki etkinlik"
        >
          ←
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onNext}
          aria-label="Sonraki etkinlik"
        >
          →
        </Button>
      </div>
    </div>
  );
}