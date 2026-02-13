import { useLazyImage } from '@/hooks/use-lazy-image';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage = ({ src, alt, className }: LazyImageProps) => {
  const { imgRef, isLoaded, isInView, src: lazySrc } = useLazyImage(src);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {!isLoaded && isInView && (
        <Skeleton className={`absolute inset-0 ${className}`} />
      )}
      <img
        ref={imgRef}
        src={lazySrc}
        alt={alt}
        className={`lazy-image ${className} ${isLoaded ? 'loaded' : ''}`}
      />
    </div>
  );
};

export default LazyImage;