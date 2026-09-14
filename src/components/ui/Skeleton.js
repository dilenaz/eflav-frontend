/**
 * Karabük Eflani Hayır Kervanı Vakfı Ortak Skeleton (Yükleme Efekti) Bileşeni
 * WCAG standartlarına uygun, Tailwind v4 pulse animasyonlu yapı.
 */
export default function Skeleton({
  variant = 'text', // 'text' | 'title' | 'image' | 'card'
  className = '',
  count = 1,
  ...props
}) {
  // Temel pulse ve renk stilleri (v4 kurumsal antrasit/sinir tonlarına uyumlu)
  const baseStyles = 'animate-pulse bg-gray-200/80 rounded-md dark:bg-zinc-700/50';

  // Varyantlara göre yükleme alanı boyutları
  const variants = {
    text: 'h-4 w-full mb-2 last:w-4/5',
    title: 'h-7 w-1/3 mb-4',
    image: 'w-full h-48 sm:h-64 rounded-xl',
    card: 'w-full border border-eflavSinir rounded-xl p-5 space-y-4'
  };

  // Çoklu satır desteği için render döngüsü
  const renderSkeletons = () => {
    return Array.from({ length: count }).map((_, index) => {
      if (variant === 'card') {
        return (
          <div 
            key={index} 
            className={`${variants.card} ${className}`}
            role="presentation"
            aria-hidden="true"
            {...props}
          >
            {/* Kart içi görsel alanı simülasyonu */}
            <div className="h-40 bg-gray-300/80 rounded-lg w-full animate-pulse" />
            {/* Kart içi başlık simülasyonu */}
            <div className="h-5 bg-gray-300/80 rounded w-1/2 animate-pulse" />
            {/* Kart içi metin satırları simülasyonu */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-300/80 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-300/80 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        );
      }

      return (
        <div
          key={index}
          className={`${baseStyles} ${variants[variant]} ${className}`}
          role="presentation"
          aria-hidden="true"
          {...props}
        />
      );
    });
  };

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-busy="true" 
      className="w-full"
    >
      {renderSkeletons()}
      <span className="sr-only">İçerik yükleniyor...</span>
    </div>
  );
}