import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CompetencySummary, NextActionRecommendation } from '@/types';

interface HeroBannerProps {
  userEmail?: string;
  userRole?: string;
  summary?: CompetencySummary;
  recommendedAction?: NextActionRecommendation;
  onOpenExplainer: () => void;
  certifiedCount: number;
  totalCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  userEmail,
  userRole = 'employee',
  summary,
  recommendedAction,
  onOpenExplainer,
  certifiedCount,
  totalCount,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const userName = userEmail ? userEmail.split('@')[0].replace(/[._-]/g, ' ') : 'Officer';
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const readinessLevel = summary?.readiness_level || 'Substantial Readiness';

  return (
    <div className="relative rounded-2xl bg-[#EDE4D0]/85 border border-[#D9CFBB] text-[#0A0A0A] shadow-[0_20px_50px_-15px_rgba(10,10,10,0.08)] overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Content Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B6357] font-semibold">
              My Skill Progress & Credentials
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#0A0A0A] bg-[#F5EFE0] border border-[#D9CFBB] px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-[#C9A24A]" />
              <span>Competency Track</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#6B6357] bg-[#F5EFE0] border border-[#D9CFBB] px-2.5 py-0.5 rounded-full">
              <Shield className="h-3 w-3 text-[#6B6357]" />
              <span className="capitalize">{userRole} Track</span>
            </span>
          </div>

          {/* Main Display Heading */}
          <div className="space-y-2">
            <h1
              className="text-2xl sm:text-3xl lg:text-[32px] font-normal tracking-[-0.02em] text-[#0A0A0A] leading-tight font-serif"
              style={{ fontFamily: '"Fraunces", Georgia, serif' }}
            >
              Build Stronger Digital Skills for Confident Public Service.
            </h1>
            <p className="text-[14px] text-[#6B6357] max-w-xl leading-relaxed font-sans">
              Welcome back, <span className="font-semibold text-[#0A0A0A] capitalize">{capitalizedUserName}</span>. {summary?.readiness_explanation ||
                `${certifiedCount} of ${totalCount} assigned competency modules certified. Your verified operational readiness is evaluated at ${readinessLevel}.`}
            </p>
          </div>

          {/* Status & Benchmark Metric Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-2 bg-[#F5EFE0] border border-[#D9CFBB] px-3.5 py-1.5 rounded-full font-mono text-[11px] text-[#0A0A0A]">
              <span className="w-2 h-2 rounded-full bg-[#C97B5A]" />
              <span>{certifiedCount} of {totalCount} Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F5EFE0] border border-[#D9CFBB] px-3.5 py-1.5 rounded-full font-mono text-[11px] text-[#0A0A0A]">
              <span className="w-2 h-2 rounded-full bg-[#C9A24A]" />
              <span>75% Passing Benchmark</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {recommendedAction && (
              <Link to={recommendedAction.link}>
                <Button
                  variant="primary"
                  className="bg-[#0A0A0A] text-[#F5EFE0] hover:bg-[#222222] font-medium px-6 py-2.5 rounded-full text-[13px] shadow-sm cursor-pointer"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {recommendedAction.action_type === 'take_quiz' || recommendedAction.action_type === 'retake_quiz'
                    ? 'Take Assessment'
                    : 'Continue Curriculum'}
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={onOpenExplainer}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F5EFE0] hover:bg-[#EDE4D0] text-[#0A0A0A] font-sans text-[13px] font-medium transition-all cursor-pointer shadow-xs border border-[#D9CFBB]"
              title="View how operational scores and readiness tiers are calculated"
              aria-label="How is this calculated?"
            >
              <Info className="h-4 w-4 text-[#6B6357] shrink-0" />
              <span>How is this calculated?</span>
            </button>
          </div>
        </div>

        {/* Right Visual Zone (5 cols) - Editorial Artwork with Passe-Partout Framing */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative min-h-[220px]">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center p-3 rounded-2xl bg-[#F5EFE0] border border-[#D9CFBB] shadow-[0_16px_40px_-15px_rgba(10,10,10,0.08)]">
            {/* Corner Archival Registration Accents */}
            <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />

            <motion.div
              initial={shouldReduceMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-full h-full rounded-xl overflow-hidden border border-[#D9CFBB] bg-[#EDE4D0]"
            >
              <img
                src="/illustrations/employee_hero_illustration.jpg"
                alt="Digital Competency Growth"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
