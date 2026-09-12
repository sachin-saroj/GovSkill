import React, { useRef } from 'react';
import { Eyebrow, DisplaySerif, BodyText, Card, AvatarStack } from '@/design-system';

interface TestimonialItem {
  id: string;
  quote: string;
  italicWordInQuote?: string;
  author: string;
  role: string;
  jurisdiction: string;
  avatars: Array<{ name: string; initials: string; role?: string }>;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    quote:
      'Before pre-checks, half our morning queue involved explaining why an expired date invalidated a scholarship file. Now citizens arrive with verified slips, ready for immediate filing.',
    author: 'K. R. Radhakrishnan',
    role: 'Village Officer',
    jurisdiction: 'Wayanad District Collectorate',
    avatars: [
      { name: 'K. R. Radhakrishnan', initials: 'KR', role: 'Village Officer' },
      { name: 'P. Nair', initials: 'PN', role: 'Clerk' },
      { name: 'V. S. Pillai', initials: 'VP', role: 'Inspector' },
    ],
  },
  {
    id: 't-2',
    quote:
      'The curriculum lessons are grounded in actual Kerala Land Revenue circulars, not generic theory. Meeting the 75% passing mark felt like earning genuine administrative qualification.',
    author: 'Ananya Menon',
    role: 'Junior Superintendent',
    jurisdiction: 'Ernakulam Taluk Office',
    avatars: [
      { name: 'Ananya Menon', initials: 'AM', role: 'Junior Superintendent' },
      { name: 'R. K. Verma', initials: 'RV', role: 'Reviewer' },
      { name: 'S. Babu', initials: 'SB', role: 'Staff Officer' },
    ],
  },
  {
    id: 't-3',
    quote:
      'Supervisors finally track department readiness on immutable metrics. We discover whether validity dates or issuing seals cause friction before statutory state audits occur.',
    author: 'M. T. Varma',
    role: 'Deputy Collector',
    jurisdiction: 'Thiruvananthapuram Collectorate',
    avatars: [
      { name: 'M. T. Varma', initials: 'MV', role: 'Deputy Collector' },
      { name: 'S. Nambiar', initials: 'SN', role: 'Audit Lead' },
      { name: 'T. George', initials: 'TG', role: 'Data Steward' },
    ],
  },
];

export const Testimonials: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
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
    <section className="w-full bg-[#0E0E0E] text-[#F5EFE0] py-[clamp(70px,11vh,150px)] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-10">
        {/* Top Horizontal Rule: 1px, cream 20% opacity, 60% width, left-aligned */}
        <div className="w-[60%] h-[1px] bg-[#F5EFE0]/20" aria-hidden="true" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <Eyebrow dark>Field Dispatches</Eyebrow>
            <DisplaySerif
              as="h2"
              size="h2"
              dark
              text="Voices from the field."
              italicWord="field"
            />
            <BodyText size="base" dark muted className="text-[#EDE4D0]/70">
              Reflections from revenue counters, taluk officers, and district collectorates.
            </BodyText>
          </div>

          {/* Controls: Arrow Navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll previous testimonials"
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#F5EFE0] flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 12L6 8L10 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll next testimonials"
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#F5EFE0] flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 4L10 8L6 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Row of Testimonial Cards */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Testimonial cards carousel"
          onKeyDown={handleKeyDown}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.id}
              variant="testimonial"
              className="snap-start shrink-0 w-[320px] sm:w-[380px] min-h-[340px] flex flex-col justify-between bg-[#161616] border border-white/10 border-l border-l-white/20"
            >
              <div className="space-y-4">
                <div className="text-[28px] font-serif text-[#E8964A] leading-none select-none">
                  “
                </div>
                <p
                  className="font-serif text-[18px] sm:text-[20px] text-[#F5EFE0] font-normal leading-relaxed"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  {t.quote}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/10 flex items-end justify-between">
                <div>
                  <div className="font-sans text-[14px] font-medium text-[#F5EFE0]">
                    {t.author}
                  </div>
                  <div className="font-sans text-[12px] text-[#EDE4D0]/60">
                    {t.role}
                  </div>
                  <div className="font-sans text-[11px] text-[#EDE4D0]/40 font-mono mt-0.5">
                    {t.jurisdiction}
                  </div>
                </div>

                <AvatarStack avatars={t.avatars} />
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Dots matching PDF page 5 */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-white/25" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
