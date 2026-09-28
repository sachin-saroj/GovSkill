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
    <div className="relative bg-surface border border-border-warm text-ink overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 transition-all">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted font-bold">
              My Skill Progress & Credentials
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink bg-azure-500/15 border border-azure-500/30 px-2.5 py-0.5 rounded-full font-bold">
              <Sparkles className="h-3 w-3 text-azure-700" />
              <span>Competency Track</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted bg-surface-light border border-border-warm px-2.5 py-0.5 rounded-full font-bold">
              <Shield className="h-3 w-3 text-ink-muted" />
              <span className="capitalize">{userRole} Track</span>
            </span>
          </div>

          {/* Main Display Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold font-serif tracking-tight text-ink leading-tight">
              Build Stronger Digital Skills for Confident Public Service.
            </h1>
            <p className="text-[14px] text-ink-muted max-w-xl leading-relaxed font-sans font-normal">
              Welcome back, <span className="font-semibold text-ink capitalize">{capitalizedUserName}</span>. {summary?.readiness_explanation ||
                `${certifiedCount} of ${totalCount} assigned competency modules certified. Your verified operational readiness is evaluated at ${readinessLevel}.`}
            </p>
          </div>

          {/* Status & Benchmark Metric Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-2 bg-surface-light border border-border-warm px-3.5 py-1.5 rounded-full font-mono text-xs text-ink font-semibold">
              <span className="w-2 h-2 rounded-full bg-azure-600" />
              <span>{certifiedCount} of {totalCount} Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-light border border-border-warm px-3.5 py-1.5 rounded-full font-mono text-xs text-ink font-semibold">
              <span className="w-2 h-2 rounded-full bg-sage-600" />
              <span>75% Passing Benchmark</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {recommendedAction && (
              <Link to={recommendedAction.link}>
                <Button
                  variant="primary"
                  className="font-medium px-6 py-2.5 rounded-full text-xs shadow-none cursor-pointer"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-light hover:bg-surface-strong text-ink font-mono text-xs uppercase font-bold tracking-wider rounded-full transition-all cursor-pointer border border-border-warm min-h-[40px]"
              title="View how operational scores and readiness tiers are calculated"
              aria-label="How is this calculated?"
            >
              <Info className="h-4 w-4 text-ink-muted shrink-0" />
              <span>How is this calculated?</span>
            </button>
          </div>
        </div>

        {/* Right Visual Zone (5 cols) - Warm Architectural Framing */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative min-h-[220px]">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center p-3 bg-surface-light border border-border-warm rounded-2xl">
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-full h-full overflow-hidden rounded-xl border border-border-warm bg-surface"
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
