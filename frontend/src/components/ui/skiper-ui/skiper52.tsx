import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface Skiper52Image {
  src: string;
  alt: string;
  code?: string;
  step?: string;
  title?: string;
  category?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

interface HoverExpandProps {
  images: Skiper52Image[];
  className?: string;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
}

export const HoverExpand_001: React.FC<HoverExpandProps> = ({
  images,
  className,
  activeIndex: controlledIndex,
  onActiveChange,
}) => {
  const [internalActive, setInternalActive] = useState<number>(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalActive;

  const handleSelect = (index: number) => {
    if (controlledIndex === undefined) {
      setInternalActive(index);
    }
    onActiveChange?.(index);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex w-full items-stretch justify-center gap-2 sm:gap-2.5 h-[360px] sm:h-[420px]">
        {images.map((image, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.div
              key={index}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl border select-none transition-colors duration-200",
                isActive
                  ? "border-[#0E50B0] shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                  : "border-[#DED7C8] hover:border-zinc-400 opacity-90 hover:opacity-100"
              )}
              initial={false}
              animate={{
                flex: isActive ? 4.5 : 1,
              }}
              transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
              onClick={() => handleSelect(index)}
              onHoverStart={() => handleSelect(index)}
            >
              {/* Background gradient overlay on active image */}
              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10 pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/25 transition-colors z-10 pointer-events-none" />
                )}
              </AnimatePresence>

              {/* Collapsed Vertical Indicator Label */}
              {!isActive && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-4 pointer-events-none">
                  <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-1.5 py-0.5 rounded shadow-2xs">
                    {image.step || `0${index + 1}`}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/90 [writing-mode:vertical-lr] rotate-180 font-bold whitespace-nowrap drop-shadow-xs">
                    {image.title || image.alt}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
              )}

              {/* Active Expanded Content Callout */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, delay: 0.08 }}
                    className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5 pointer-events-none"
                  >
                    {/* Top Active Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Stage {image.step || `0${index + 1}`} • {image.title}
                      </span>
                      {image.category && (
                        <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-wider text-white/80 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                          {image.category}
                        </span>
                      )}
                    </div>

                    {/* Bottom Metadata Callout */}
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-white text-[15px] sm:text-[17px] leading-snug drop-shadow-xs">
                        {image.alt}
                      </h4>
                      {image.description && (
                        <p className="font-sans text-[11.5px] sm:text-[12.5px] text-white/90 leading-snug line-clamp-2 drop-shadow-2xs">
                          {image.description}
                        </p>
                      )}
                      {image.code && (
                        <p className="font-mono text-[9px] uppercase tracking-wider text-emerald-300/90 font-medium">
                          {image.code}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background Image */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover object-center image-stable"
                loading="eager"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const Skiper52 = HoverExpand_001;

export default HoverExpand_001;

