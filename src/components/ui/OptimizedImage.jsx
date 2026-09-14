'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getSafeImageUrl } from '@/lib/image-url';

const DEFAULT_PLACEHOLDER = '/images/logo/eflanilogo.png';

export default function OptimizedImage(props) {
  const safeFallbackSrc = getSafeImageUrl(props.fallbackSrc, DEFAULT_PLACEHOLDER);
  const safeSrc = getSafeImageUrl(props.src, safeFallbackSrc);

  return (
    <StatefulOptimizedImage
      key={`${safeSrc}|${safeFallbackSrc}`}
      {...props}
      src={safeSrc}
      fallbackSrc={safeFallbackSrc}
    />
  );
}

function StatefulOptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  imageClassName = '',
  priority = false,
  quality = 85,
  fallbackSrc = DEFAULT_PLACEHOLDER,
  decorative = false,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const safeFallbackSrc = fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFallbackFailed, setHasFallbackFailed] = useState(false);

  const accessibleAlt = decorative ? '' : alt || '';

  const handleError = () => {
    if (currentSrc !== safeFallbackSrc) {
      setCurrentSrc(safeFallbackSrc);
      setIsLoading(true);
      return;
    }

    setHasFallbackFailed(true);
    setIsLoading(false);
  };

  if (hasFallbackFailed) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-eflavKrem text-center text-sm text-eflavMetinAcik ${fill ? 'absolute inset-0 h-full w-full' : ''} ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : accessibleAlt || 'Görsel yüklenemedi'}
      >
        {!decorative && 'Görsel yüklenemedi'}
      </div>
    );
  }

  return (
    <div
      className={`${fill ? 'absolute inset-0 h-full w-full' : 'relative'} overflow-hidden bg-eflavKrem ${className}`}
      style={!fill && width && height ? { width, height } : undefined}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={currentSrc}
        alt={accessibleAlt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        style={!fill && width && height ? { width, height } : undefined}
        className={`object-cover transition duration-300 ${
          isLoading ? 'scale-105 blur-md' : 'scale-100 blur-0'
        } ${imageClassName}`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        {...props}
      />

      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-eflavSinir/40"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
