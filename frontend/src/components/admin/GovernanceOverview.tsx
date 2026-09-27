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
      className="relative overflow-hidden bg-white p-6 sm:p-8 text-[#09090B] border border-[#E4E4E7] space-y-4 shadow-none rounded-none"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0E50B0]" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-[#E4E4E7]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-[#71717A] font-mono font-bold text-[10px] uppercase tracking-[0.2em]">
            <LayoutDashboard className="h-4 w-4 text-[#0E50B0]" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#09090B]">
            Governance Dashboard & Administration
          </h1>

          <p className="text-sm text-[#52525B] leading-relaxed font-sans font-medium">
            Monitor municipal employee digital readiness, oversee training curriculum, and audit statutory credential verification.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] bg-white hover:bg-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-all shadow-none cursor-pointer border border-[#E4E4E7] min-h-[40px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#0E50B0] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#71717A]">
        <span className="inline-flex items-center gap-1.5 bg-[#FAFAFA] px-3 py-1 border border-[#E4E4E7] font-bold text-[#09090B]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Verified Governance Active</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#FAFAFA] px-3 py-1 border border-[#E4E4E7] font-bold text-[#09090B]">
          <Sparkles className="h-3.5 w-3.5 text-[#0E50B0]" />
          <span>Server-Scored Evaluation Engine</span>
        </span>
      </div>
    </motion.div>
  );
};

export default GovernanceOverview;
