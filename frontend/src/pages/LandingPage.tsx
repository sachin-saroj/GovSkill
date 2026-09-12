import React from 'react';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import TrustMarquee from '@/sections/TrustMarquee';
import ImmersiveStage from '@/sections/ImmersiveStage';
import Comparison from '@/sections/Comparison';
import Statement from '@/sections/Statement';
import TagCloud from '@/sections/TagCloud';
import FeatureA from '@/sections/FeatureA';
import FeatureB from '@/sections/FeatureB';
import Testimonials from '@/sections/Testimonials';
import MetricStrip from '@/sections/MetricStrip';
import FinalCTA from '@/sections/FinalCTA';
import Footer from '@/sections/Footer';
import { ScrollSection } from '@/design-system';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5EFE0] text-[#0A0A0A] selection:bg-[#E8964A]/30 selection:text-[#0A0A0A] flex flex-col">
      {/* 01. Nav: Disciplined 5-Element Header */}
      <Nav />

      <main className="flex-1 flex flex-col">
        {/* 02. Hero: 100px+ Display Serif, Italic Keyword, 7/5 Asymmetric Split, Bottom Marquee */}
        <ScrollSection id="hero">
          <Hero />
        </ScrollSection>

        {/* 03. Trust: Statutory Frameworks & Institutional Standards */}
        <ScrollSection id="trust">
          <TrustMarquee />
        </ScrollSection>

        {/* 04. Immersive Stage: The Single Full-Width Dark Rounded Anchor */}
        <ScrollSection id="stage">
          <ImmersiveStage />
        </ScrollSection>

        {/* 05. Comparison: Asymmetric 5/7 Editorial Split */}
        <ScrollSection id="comparison">
          <Comparison />
        </ScrollSection>

        {/* 06. Statement: Oversized Serif Statement with 16:9 Illustration */}
        <ScrollSection id="statement">
          <Statement />
        </ScrollSection>

        {/* 07. Tag Cloud: Irregular Competency Chip Cloud */}
        <ScrollSection id="competencies">
          <TagCloud />
        </ScrollSection>

        {/* 08. Feature A: Dominant Floating UI Mockup (GovAssist Pre-Check) */}
        <ScrollSection id="feature-precheck">
          <FeatureA />
        </ScrollSection>

        {/* 09. Feature B: Mirrored Asymmetric Layout (Officer Academy) */}
        <ScrollSection id="feature-academy">
          <FeatureB />
        </ScrollSection>

        {/* 10. Testimonials: Field Dispatches with Horizontal Scroll & Avatars */}
        <ScrollSection id="dispatches">
          <Testimonials />
        </ScrollSection>

        {/* 11. Metric Strip: Single Dark Green Rounded Panel (#2A5B4A) with 2 Metrics */}
        <ScrollSection id="metrics">
          <MetricStrip />
        </ScrollSection>

        {/* 12. Final CTA: Cinematic Horizon with Italic Serif Overlay */}
        <ScrollSection id="action">
          <FinalCTA />
        </ScrollSection>
      </main>

      {/* 13. Footer: 3 Minimal Columns, Huge Wordmark, Single Compliance Row */}
      <Footer />
    </div>
  );
};

export default LandingPage;
