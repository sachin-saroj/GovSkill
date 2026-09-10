import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <motion.div
      variants={fadeUpVariants}
      className="relative overflow-hidden rounded-civic-xl bg-white p-6 sm:p-8 text-slate-900 shadow-civic-xs border border-slate-200 space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-civic-700 font-semibold text-micro uppercase tracking-wider">
            <LayoutDashboard className="h-4 w-4" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="text-page-title font-semibold tracking-tight text-slate-900">
            Governance Dashboard & Administration
          </h1>

          <p className="text-body text-slate-600 leading-relaxed font-normal">
            Monitor municipal employee digital readiness, oversee training curriculum, and audit statutory credential verification.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 text-caption font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed rounded-full transition-all shadow-civic-xs cursor-pointer border border-slate-200 min-h-[40px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-civic-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-caption text-slate-600 font-normal">
        <span className="inline-flex items-center gap-1.5 bg-civic-50/70 px-3 py-1 rounded-full border border-civic-200/80 font-medium text-civic-900">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Governance Active</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-civic-50/70 px-3 py-1 rounded-full border border-civic-200/80 font-medium text-civic-900">
          <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
          <span>Server-Scored Evaluation Engine</span>
        </span>
      </div>
    </motion.div>
  );
};

export default GovernanceOverview;
