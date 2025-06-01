'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_IMAGE } from '@/config/defaults';
import { getValidImageUrl } from '@/utils/format';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export const ProductImageCarousel = ({ images, productName }: ProductImageCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Filter out invalid images and ensure at least one image (default if needed)
  const validImages = images?.filter(img => img && img.startsWith('http')) || [];
  const displayImages = validImages.length > 0 ? validImages : [DEFAULT_IMAGE];

  return (
    <div className="relative">
      {/* Main Image Carousel */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {displayImages.map((image, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative aspect-square">
                <Image
                  src={getValidImageUrl(image, DEFAULT_IMAGE)}
                  alt={`${productName} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                selectedIndex === index ? 'ring-2 ring-[var(--primary)]' : ''
              }`}
            >
              <Image
                src={getValidImageUrl(image, DEFAULT_IMAGE)}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 