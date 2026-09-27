import React, { useRef, useState, useEffect } from 'react';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system';
import { ChevronLeft, ChevronRight, MapPin, Quote, ShieldCheck, Sparkles } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  dispatchCode: string;
  tier: 'all' | 'village' | 'taluk' | 'collectorate' | 'divisional';
  tierLabel: string;
  quote: string;
  highlightPhrase?: string;
  author: string;
  role: string;
  jurisdiction: string;
  impactMetric: string;
  tenure: string;
  initials: string;
  avatars: Array<{ name: string; initials: string; role?: string }>;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    dispatchCode: 'REV-WYD-041',
    tier: 'village',
    tierLabel: 'Village Level',
    quote:
      'Before pre-checks, half our morning queue involved explaining why an expired date invalidated a scholarship file. Now citizens arrive with verified slips, ready for immediate filing.',
    highlightPhrase: 'verified slips, ready for immediate filing',
    author: 'K. R. Radhakrishnan',
    role: 'Village Officer',
    jurisdiction: 'Wayanad District Collectorate',
    impactMetric: '⚡ 70% Queue Reduction',
    tenure: '14 Years Service',
    initials: 'KR',
    avatars: [
      { name: 'K. R. Radhakrishnan', initials: 'KR', role: 'Village Officer' },
    ],
  },
  {
    id: 't-2',
    dispatchCode: 'REV-EKM-118',
    tier: 'taluk',
    tierLabel: 'Taluk Oversight',
    quote:
      'The curriculum lessons are grounded in actual Kerala Land Revenue circulars, not generic theory. Meeting the 75% passing mark felt like earning genuine administrative qualification.',
    highlightPhrase: 'actual Kerala Land Revenue circulars',
    author: 'Ananya Menon',
    role: 'Junior Superintendent',
    jurisdiction: 'Ernakulam Taluk Office',
    impactMetric: '📜 100% Circular Alignment',
    tenure: '9 Years Service',
    initials: 'AM',
    avatars: [
      { name: 'Ananya Menon', initials: 'AM', role: 'Junior Superintendent' },
    ],
  },
  {
    id: 't-3',
    dispatchCode: 'REV-TVM-009',
    tier: 'collectorate',
    tierLabel: 'Collectorate Command',
    quote:
      'Supervisors finally track department readiness on immutable metrics. We discover whether validity dates or issuing seals cause friction before statutory state audits occur.',
    highlightPhrase: 'immutable readiness metrics',
    author: 'M. T. Varma',
    role: 'Deputy Collector',
    jurisdiction: 'Thiruvananthapuram Collectorate',
    impactMetric: '🛡️ Zero Audit Deficiencies',
    tenure: '21 Years Service',
    initials: 'MV',
    avatars: [
      { name: 'M. T. Varma', initials: 'MV', role: 'Deputy Collector' },
    ],
  },
  {
    id: 't-4',
    dispatchCode: 'REV-KKD-024',
    tier: 'divisional',
    tierLabel: 'Divisional Administration',
    quote:
      'The grounding of AI explanations strictly inside verified government orders is what won our staff over. It never hallucinates rules—it quotes exact gazette clauses and circular citations.',
    highlightPhrase: 'quotes exact gazette clauses',
    author: 'Dr. Lekshmi R. Nair',
    role: 'Sub-Collector & SDM',
    jurisdiction: 'Kozhikode Revenue Division',
    impactMetric: '⏱️ 4.2m Fast Pre-Check',
    tenure: '11 Years Service',
    initials: 'LN',
    avatars: [
      { name: 'Dr. Lekshmi R. Nair', initials: 'LN', role: 'Sub-Collector & SDM' },
    ],
  },
];

const FILTER_TIERS = [
  { key: 'all', label: 'All Administrative Tiers' },
  { key: 'village', label: 'Village Counters' },
  { key: 'taluk', label: 'Taluk Oversight' },
  { key: 'collectorate', label: 'Collectorate Command' },
] as const;

export const Testimonials: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const filteredTestimonials =
    activeTier === 'all'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.tier === activeTier || activeTier === 'all');

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active card index
    const cardWidth = 380 + 24; // width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), filteredTestimonials.length - 1));
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredTestimonials.length]);

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('[data-dispatch-card]');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIndex(index);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const target = direction === 'left' ? activeIndex - 1 : activeIndex + 1;
    if (target >= 0 && target < filteredTestimonials.length) {
      scrollToIndex(target);
    } else if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      scroll('right');
    }
  };

  return (
    <section className="relative w-full bg-black text-white py-[clamp(80px,12vh,160px)] border-t border-[#27272A] overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-10">
        {/* Top Architectural Chapter Marker */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="font-mono text-xs font-bold text-[#0E50B0] tracking-widest uppercase">
            PART. 07
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
          <div className="w-24 h-[1px] bg-[#27272A]" />
        </div>

        {/* Section Header: Title, Telemetry, and Carousel Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <Eyebrow dark>Field Dispatches</Eyebrow>
              <span className="w-1 h-1 rounded-full bg-[#0E50B0]" />
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#27272A] bg-zinc-900 text-white font-mono text-[10px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Revenue Logs
              </span>
            </div>

            <DisplaySerif
              as="h2"
              size="h2"
              dark
              text="Voices from the field."
              italicWord="field"
              className="tracking-tight font-black uppercase text-white leading-[1.08]"
            />

            <BodyText size="base" dark muted className="text-[#A1A1AA] max-w-xl text-[15px] leading-relaxed">
              Reflections from revenue counters, taluk officers, and district collectorates
              operating on the GovSkill verification standard.
            </BodyText>

            {/* Administrative Tier Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {FILTER_TIERS.map((tier) => {
                const isActive = activeTier === tier.key;
                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => {
                      setActiveTier(tier.key);
                      setActiveIndex(0);
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`px-3.5 py-1.5 font-mono text-[11px] tracking-wide uppercase transition-all duration-200 cursor-pointer select-none border ${
                      isActive
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-transparent text-[#71717A] hover:text-white border-[#27272A]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Dispatch Index & Upgraded Navigation Buttons */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#27272A] text-xs font-mono text-[#A1A1AA]">
              <span className="text-white font-bold">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span>/</span>
              <span>{String(filteredTestimonials.length).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll previous testimonials"
                className={`w-10 h-10 border transition-all duration-200 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                  canScrollLeft
                    ? 'border-[#27272A] bg-zinc-900 hover:bg-white hover:text-black text-white'
                    : 'border-[#27272A]/50 bg-transparent text-zinc-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll next testimonials"
                className={`w-10 h-10 border transition-all duration-200 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                  canScrollRight
                    ? 'border-[#27272A] bg-zinc-900 hover:bg-white hover:text-black text-white'
                    : 'border-[#27272A]/50 bg-transparent text-zinc-600 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Testimonial cards carousel"
          onKeyDown={handleKeyDown}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredTestimonials.map((t, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <div
                key={t.id}
                data-dispatch-card
                onClick={() => scrollToIndex(idx)}
                className={`snap-start shrink-0 w-[320px] sm:w-[390px] min-h-[380px] flex flex-col justify-between p-7 sm:p-8 relative transition-all duration-300 group cursor-default select-none border ${
                  isSelected
                    ? 'bg-zinc-950 border-white text-white'
                    : 'bg-zinc-950/80 border-[#27272A] text-[#A1A1AA] hover:border-zinc-500'
                }`}
              >
                <div className="space-y-5 relative z-10">
                  {/* Top Dispatch Metadata Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0E50B0]">
                        {t.dispatchCode}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-zinc-400">
                        {t.tierLabel}
                      </span>
                    </div>

                    {/* Impact Metric Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#27272A] bg-zinc-900 text-white text-[10.5px] font-mono tracking-tight">
                      <span>{t.impactMetric}</span>
                    </div>
                  </div>

                  {/* Refined Quote Icon */}
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Quote className="w-4 h-4" />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                      Officer Testimony
                    </span>
                  </div>

                  {/* Quote Paragraph with Bold Sans Styling */}
                  <p className="font-sans text-[15px] sm:text-[16px] text-white font-normal leading-[1.6]">
                    {t.highlightPhrase && t.quote.includes(t.highlightPhrase) ? (
                      <>
                        {t.quote.split(t.highlightPhrase)[0]}
                        <span className="text-white font-bold underline decoration-[#0E50B0] underline-offset-4 decoration-2">
                          {t.highlightPhrase}
                        </span>
                        {t.quote.split(t.highlightPhrase)[1]}
                      </>
                    ) : (
                      t.quote
                    )}
                  </p>
                </div>

                {/* Bottom Officer Credentials */}
                <div className="pt-6 mt-6 border-t border-[#27272A] flex items-end justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="font-sans text-[14px] font-bold text-white tracking-tight">
                      {t.author}
                    </div>

                    <div className="font-sans text-[12px] text-[#0E50B0] font-semibold uppercase tracking-wider">
                      {t.role}
                    </div>

                    <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-[230px]">{t.jurisdiction}</span>
                    </div>

                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      {t.tenure}
                    </div>
                  </div>

                  {/* Initials Plate */}
                  <div className="w-10 h-10 border border-[#27272A] bg-zinc-900 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                    {t.initials}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic & Interactive Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#27272A]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>State Cadre Operational Reports • Statutory Audit Ready</span>
          </div>

          <div className="flex items-center gap-2">
            {filteredTestimonials.map((_, dotIdx) => {
              const isActive = activeIndex === dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToIndex(dotIdx)}
                  aria-label={`Jump to dispatch ${dotIdx + 1}`}
                  className={`h-1 transition-all duration-200 cursor-pointer ${
                    isActive ? 'w-8 bg-white' : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>DPDP Act 2023 Verified Field Records</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
