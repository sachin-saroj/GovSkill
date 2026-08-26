import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LayoutDashboard, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { fadeUpVariants } from '@/lib/motion';

interface GovernanceOverviewProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const GovernanceOverview: React.FC<GovernanceOverviewProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUpVariants}
      className="relative overflow-hidden rounded-civic-2xl bg-gradient-to-r from-civic-950 via-civic-900 to-civic-800 p-6 sm:p-8 text-white shadow-civic-xl border border-civic-800"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2 text-saffron-400 font-semibold text-micro uppercase tracking-wider">
            <LayoutDashboard className="h-4 w-4" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="text-page-title font-semibold tracking-tight text-white">
            Admin Dashboard & CMS
          </h1>

          <p className="text-body text-slate-300 leading-relaxed font-normal">
            Monitor municipal employee digital readiness, oversee training curriculum, and manage server-scored assessment questions.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-caption text-slate-300 font-normal">
            <span className="inline-flex items-center gap-1.5 bg-civic-950/80 px-3 py-1 rounded-civic-md border border-civic-800 font-medium text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Governance Active</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-civic-950/80 px-3 py-1 rounded-civic-md border border-civic-800 font-medium text-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
              <span>Server-Scored Evaluation Engine</span>
            </span>
          </div>
        </div>

        {/* Refresh Control */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 text-caption font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed rounded-civic-md transition-all shadow-civic-sm cursor-pointer border border-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-civic-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GovernanceOverview;
