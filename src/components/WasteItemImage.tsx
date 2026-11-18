import { useState } from 'react';
import { Package } from 'lucide-react';

interface WasteItemImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function WasteItemImage({ src, alt, className = '' }: WasteItemImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-700 border border-slate-200 rounded-xl p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-12 h-12 text-slate-500 mb-2" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setHasError(true)}
      className={`select-none pointer-events-none object-contain ${className}`}
    />
  );
}
