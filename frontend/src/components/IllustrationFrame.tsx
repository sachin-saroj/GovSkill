import React from 'react';
import AnimatedIllustration, { IllustrationKey } from './AnimatedIllustration';

export interface IllustrationFrameProps {
  src: string;
  alt: string;
  aspectRatio: '4:5' | '16:9' | '4:3' | '21:9' | '3:4' | '2:3';
  illustrationKey: IllustrationKey;
  caption?: React.ReactNode;
  figureNumber?: string;
  figureTitle?: string;
  fullBleed?: boolean;
  padded?: boolean;
  variant?: 'plate' | 'clean' | 'fullBleed';
  className?: string;
}

export const IllustrationFrame: React.FC<IllustrationFrameProps> = ({
  src,
  alt,
  aspectRatio,
  illustrationKey,
  caption,
  figureNumber,
  figureTitle,
  fullBleed = false,
  padded = false,
  variant = 'plate',
  className = '',
}) => {
  const aspectClass = {
    '4:5': 'aspect-[4/5]',
    '3:4': 'aspect-[3/4]',
    '2:3': 'aspect-[2/3]',
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  if (fullBleed || variant === 'fullBleed') {
    return (
      <figure className={`relative w-full overflow-hidden ${className}`}>
        <div className={`relative w-full ${aspectClass} overflow-hidden`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-center select-none"
            loading="lazy"
          />
          <AnimatedIllustration illustrationKey={illustrationKey} />
        </div>
        {caption && <figcaption className="mt-3">{caption}</figcaption>}
      </figure>
    );
  }

  if (variant === 'clean' || (!padded && variant !== 'plate')) {
    return (
      <figure className={`flex flex-col ${className}`}>
        <div className="relative overflow-hidden rounded-xl border border-[#D9CFBB] bg-[#EFE6D2]/50 shadow-[0_16px_40px_-12px_rgba(10,10,10,0.07)]">
          <div className={`relative w-full ${aspectClass} overflow-hidden`}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover object-center select-none"
              loading="lazy"
            />
            <AnimatedIllustration illustrationKey={illustrationKey} />
          </div>
        </div>
        {caption && <figcaption className="mt-3">{caption}</figcaption>}
      </figure>
    );
  }

  // Master Museum-Grade Gallery Plate Framing (variant="plate")
  // Features authentic 4-ply cotton rag passe-partout matting, beveled aperture shadow,
  // architectural corner registration marks, and a crisp institutional accession placard.
  return (
    <figure
      className={`group relative flex flex-col p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#EDE4D0]/75 border border-[#D9CFBB] shadow-[0_20px_50px_-15px_rgba(10,10,10,0.09),0_1px_3px_rgba(10,10,10,0.03)] transition-all duration-300 hover:shadow-[0_28px_60px_-15px_rgba(10,10,10,0.13)] ${className}`}
    >
      {/* Corner Archival Registration Accents (Fine 6px Hairline Brackets) */}
      <span
        className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#0A0A0A]/20 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#0A0A0A]/20 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#0A0A0A]/20 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#0A0A0A]/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Passe-Partout Beveled Window Aperture:
          Features razor-sharp 1px keyline, subtle 45-degree inner depth bevel, and museum tone */}
      <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl border border-[#0A0A0A]/15 bg-[#F5EFE0] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.6)]">
        <div className={`relative w-full ${aspectClass} overflow-hidden`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-[1.012]"
            loading="lazy"
          />

          {/* Archival ambient grading */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.04]"
            aria-hidden="true"
          />

          {/* SVG Animated Layer Stack */}
          <AnimatedIllustration illustrationKey={illustrationKey} />
        </div>
      </div>

      {/* Editorial Accession Placard / Plate Caption */}
      {(caption || figureNumber || figureTitle) && (
        <figcaption className="pt-3 sm:pt-3.5 px-0.5 select-none border-t border-[#D9CFBB]/70 mt-3 sm:mt-3.5">
          {caption ? (
            caption
          ) : (
            <div className="flex items-center justify-between text-[10.5px] font-mono tracking-[0.16em] uppercase text-[#6B6357]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-[#0A0A0A] shrink-0">
                  PLATE {figureNumber || '01'}
                </span>
                <span className="text-[#C97B5A] text-[9px] shrink-0" aria-hidden="true">
                  ◆
                </span>
                <span className="truncate text-[#2D2821] font-medium">
                  {figureTitle}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-[9px] text-[#8C8273] tracking-widest font-mono hidden sm:inline">
                  REF. GS-2026
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C97B5A]/50" />
              </div>
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default IllustrationFrame;
