export default function SectionTitle({
  badge,
  eyebrow,
  title,
  subtitle,
  description,
  align = 'center',
  className = '',
  titleAs: TitleTag = 'h2',
}) {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const selectedAlignment =
    alignmentClasses[align] ?? alignmentClasses.center;

  const topLabel = eyebrow ?? badge;
  const supportingText = description ?? subtitle;

  return (
    <div
      className={`mb-12 flex flex-col ${selectedAlignment} ${className}`}
    >
      {topLabel && (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-eflavAltin/30 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-eflavBordo before:h-1.5 before:w-1.5 before:rounded-full before:bg-eflavAltin">
          {topLabel}
        </span>
      )}

      <TitleTag className="max-w-3xl font-serif text-3xl font-black leading-tight text-eflavAntrasit sm:text-5xl">
        {title}
      </TitleTag>

      {supportingText && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-eflavMetinAcik">
          {supportingText}
        </p>
      )}
    </div>
  );
}
