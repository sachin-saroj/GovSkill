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
    <section className="relative w-full bg-[#0B0B0B] text-[#F5EFE0] py-[clamp(80px,12vh,160px)] border-t border-white/10 overflow-hidden">
      {/* Subtle Warm Amber Vignette & Grain Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(232,150,74,0.08)_0%,rgba(11,11,11,0)_80%)]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-80"
        aria-hidden="true"
      />

      <div className="relative max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-10">
        {/* Top Architectural Rule with Warm Glow Node */}
        <div className="relative flex items-center w-full max-w-[720px]" aria-hidden="true">
          <div className="w-full h-[1px] bg-gradient-to-r from-[#E8964A]/60 via-[#F5EFE0]/25 to-transparent" />
          <div className="absolute left-0 w-2 h-2 rounded-full bg-[#E8964A] shadow-[0_0_12px_#E8964A]" />
        </div>

        {/* Section Header: Title, Telemetry, and Carousel Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <Eyebrow dark>Field Dispatches</Eyebrow>
              <span className="w-1 h-1 rounded-full bg-[#E8964A]/60" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10.5px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Revenue Logs
              </span>
            </div>

            <DisplaySerif
              as="h2"
              size="h2"
              dark
              text="Voices from the field."
              italicWord="field"
              className="tracking-[-0.03em] leading-[1.08]"
            />

            <BodyText size="base" dark muted className="text-[#EDE4D0]/70 max-w-xl text-[15px] leading-relaxed">
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
                    className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-wide uppercase transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#E8964A] text-[#0A0A0A] font-semibold shadow-[0_0_15px_rgba(232,150,74,0.3)]'
                        : 'bg-white/[0.04] text-[#EDE4D0]/60 hover:text-[#F5EFE0] hover:bg-white/[0.08] border border-white/10'
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#EDE4D0]/60">
              <span className="text-[#E8964A] font-semibold">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span>/</span>
              <span>{String(filteredTestimonials.length).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll previous testimonials"
                className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#E8964A] cursor-pointer group ${
                  canScrollLeft
                    ? 'border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-[#E8964A]/50 text-[#F5EFE0] active:scale-95 shadow-sm'
                    : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll next testimonials"
                className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#E8964A] cursor-pointer group ${
                  canScrollRight
                    ? 'border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-[#E8964A]/50 text-[#F5EFE0] active:scale-95 shadow-sm'
                    : 'border-white/5 bg-transparent text-white/20 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none outline-none focus-visible:ring-2 focus-visible:ring-[#E8964A] rounded-2xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredTestimonials.map((t, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <div
                key={t.id}
                data-dispatch-card
                onClick={() => scrollToIndex(idx)}
                className={`snap-start shrink-0 w-[320px] sm:w-[390px] min-h-[400px] flex flex-col justify-between rounded-[28px] p-7 sm:p-9 relative transition-all duration-300 group cursor-default select-none border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] border-[#E8964A]/40 shadow-[0_24px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_-10px_rgba(232,150,74,0.15)]'
                    : 'bg-gradient-to-b from-[#151515] via-[#121212] to-[#0E0E0E] border-white/10 hover:border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:-translate-y-1'
                }`}
              >
                {/* Subtle Decorative Civic Seal Watermark */}
                <div
                  className="absolute right-6 bottom-6 w-32 h-32 pointer-events-none opacity-[0.025] text-white"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                    <circle cx="50" cy="50" r="16" fill="currentColor" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="space-y-5 relative z-10">
                  {/* Top Dispatch Metadata Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#E8964A]">
                        {t.dispatchCode}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#EDE4D0]/50">
                        {t.tierLabel}
                      </span>
                    </div>

                    {/* Impact Metric Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8964A]/10 border border-[#E8964A]/25 text-[#F5EFE0] text-[10.5px] font-mono tracking-tight">
                      <span>{t.impactMetric}</span>
                    </div>
                  </div>

                  {/* Refined Amber Quote Icon */}
                  <div className="flex items-center gap-2 text-[#E8964A]">
                    <Quote className="w-6 h-6 opacity-90 fill-[#E8964A]/20" />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#E8964A]/70">
                      Officer Testimony
                    </span>
                  </div>

                  {/* Quote Paragraph with Serif Styling */}
                  <p
                    className="font-serif text-[17px] sm:text-[18.5px] text-[#F5EFE0] font-normal leading-[1.65]"
                    style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                  >
                    {t.highlightPhrase && t.quote.includes(t.highlightPhrase) ? (
                      <>
                        {t.quote.split(t.highlightPhrase)[0]}
                        <span className="text-[#F5EFE0] font-medium underline decoration-[#E8964A]/50 underline-offset-4 decoration-1">
                          {t.highlightPhrase}
                        </span>
                        {t.quote.split(t.highlightPhrase)[1]}
                      </>
                    ) : (
                      t.quote
                    )}
                  </p>
                </div>

                {/* Bottom Officer Credentials & Sovereign Verified Insignia */}
                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-end justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="font-sans text-[15px] font-semibold text-[#F5EFE0] tracking-tight flex items-center gap-2">
                      <span>{t.author}</span>
                    </div>

                    <div className="font-sans text-[12.5px] text-[#E8964A] font-medium">
                      {t.role}
                    </div>

                    <div className="font-mono text-[11px] text-[#EDE4D0]/55 flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E8964A]/70 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-[230px]">{t.jurisdiction}</span>
                    </div>

                    <div className="font-mono text-[10px] text-[#EDE4D0]/35 uppercase tracking-wider">
                      {t.tenure}
                    </div>
                  </div>

                  {/* Bespoke Verified Officer Monogram & Seal */}
                  <div
                    className="relative group/badge shrink-0"
                    title={`${t.author} • Verified Administrative Cadre Officer`}
                  >
                    {/* Glowing outer ring */}
                    <div className="w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-br from-[#E8964A] via-[#C9A24A]/40 to-white/10 shadow-lg group-hover/badge:from-[#E8964A] group-hover/badge:to-[#E8964A] transition-colors duration-300">
                      <div className="w-full h-full rounded-full bg-gradient-to-b from-[#24221E] to-[#141310] flex items-center justify-center border border-white/5">
                        <span
                          className="font-serif text-[15px] font-bold text-[#F5EFE0] tracking-wider"
                          style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                        >
                          {t.initials}
                        </span>
                      </div>
                    </div>

                    {/* Official Verified Shield Badge with Emerald Check */}
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2A5B4A] border-2 border-[#121212] flex items-center justify-center text-white shadow-sm"
                      title="Verified State Revenue Officer"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2.5 6 4.5 8 9.5 3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic & Interactive Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#EDE4D0]/45">
            <ShieldCheck className="w-4 h-4 text-[#E8964A]" />
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
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-8 bg-[#E8964A] shadow-[0_0_10px_rgba(232,150,74,0.6)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#EDE4D0]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#E8964A]/60" />
            <span>DPDP Act 2023 Verified Field Records</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
