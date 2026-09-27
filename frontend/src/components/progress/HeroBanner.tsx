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
    <div className="relative bg-white border border-[#E4E4E7] text-[#09090B] overflow-hidden p-6 sm:p-8 lg:p-10 shadow-none">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0E50B0]" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717A] font-bold">
              My Skill Progress & Credentials
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#0E50B0] bg-[#0E50B0]/10 border border-[#0E50B0]/20 px-2 py-0.5 font-bold">
              <Sparkles className="h-3 w-3 text-[#0E50B0]" />
              <span>Competency Track</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 font-bold">
              <Shield className="h-3 w-3 text-[#71717A]" />
              <span className="capitalize">{userRole} Track</span>
            </span>
          </div>

          {/* Main Display Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black uppercase tracking-tight text-[#09090B] leading-tight font-sans">
              Build Stronger Digital Skills for Confident Public Service.
            </h1>
            <p className="text-[14px] text-[#52525B] max-w-xl leading-relaxed font-sans font-medium">
              Welcome back, <span className="font-bold text-[#09090B] capitalize">{capitalizedUserName}</span>. {summary?.readiness_explanation ||
                `${certifiedCount} of ${totalCount} assigned competency modules certified. Your verified operational readiness is evaluated at ${readinessLevel}.`}
            </p>
          </div>

          {/* Status & Benchmark Metric Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E4E4E7] px-3 py-1 font-mono text-xs text-[#09090B] font-bold">
              <span className="w-2 h-2 bg-[#0E50B0]" />
              <span>{certifiedCount} of {totalCount} Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E4E4E7] px-3 py-1 font-mono text-xs text-[#09090B] font-bold">
              <span className="w-2 h-2 bg-[#09090B]" />
              <span>75% Passing Benchmark</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {recommendedAction && (
              <Link to={recommendedAction.link}>
                <Button
                  variant="primary"
                  className="bg-[#09090B] text-white hover:bg-[#27272A] font-bold uppercase tracking-wider px-6 py-2.5 rounded-none text-xs shadow-none cursor-pointer border border-[#09090B]"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAFAFA] text-[#09090B] font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer border border-[#E4E4E7]"
              title="View how operational scores and readiness tiers are calculated"
              aria-label="How is this calculated?"
            >
              <Info className="h-4 w-4 text-[#71717A] shrink-0" />
              <span>How is this calculated?</span>
            </button>
          </div>
        </div>

        {/* Right Visual Zone (5 cols) - Editorial Artwork with Sharp Architectural Framing */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative min-h-[220px]">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center p-3 bg-[#FAFAFA] border border-[#E4E4E7]">
            {/* Corner Archival Registration Accents */}
            <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#09090B]/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#09090B]/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#09090B]/40 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#09090B]/40 pointer-events-none" aria-hidden="true" />

            <motion.div
              initial={shouldReduceMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-full h-full overflow-hidden border border-[#E4E4E7] bg-white"
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
