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
      className="relative overflow-hidden bg-surface p-6 sm:p-8 text-ink border border-border-warm space-y-4 shadow-none rounded-2xl"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-azure-600" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border-warm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-ink-muted font-mono font-bold text-[10px] uppercase tracking-[0.2em]">
            <LayoutDashboard className="h-4 w-4 text-azure-700" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-ink">
            Governance Dashboard & Administration
          </h1>

          <p className="text-sm text-ink-muted leading-relaxed font-sans font-medium">
            Monitor municipal employee digital readiness, oversee training curriculum, and audit statutory credential verification.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-ink bg-surface hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all shadow-none cursor-pointer border border-border-warm min-h-[40px] focus:outline-none focus:ring-2 focus:ring-ink"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-azure-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-ink-muted">
        <span className="inline-flex items-center gap-1.5 bg-surface-light px-3.5 py-1 rounded-full border border-border-warm font-bold text-ink">
          <ShieldCheck className="h-3.5 w-3.5 text-sage-700" />
          <span>Verified Governance Active</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-surface-light px-3.5 py-1 rounded-full border border-border-warm font-bold text-ink">
          <Sparkles className="h-3.5 w-3.5 text-azure-700" />
          <span>Server-Scored Evaluation Engine</span>
        </span>
      </div>
    </motion.div>
  );
};

export default GovernanceOverview;
