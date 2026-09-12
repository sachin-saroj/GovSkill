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
      className="relative overflow-hidden rounded-2xl bg-[#EDE4D0] p-6 sm:p-8 text-[#0A0A0A] shadow-xs border border-[#D9CFBB] space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-[#D9CFBB]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-[#6B6357] font-mono font-semibold text-[10px] uppercase tracking-widest">
            <LayoutDashboard className="h-4 w-4 text-[#2A5B4A]" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#0A0A0A]">
            Governance Dashboard & Administration
          </h1>

          <p className="text-sm text-[#6B6357] leading-relaxed font-sans font-normal">
            Monitor municipal employee digital readiness, oversee training curriculum, and audit statutory credential verification.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-semibold text-[#0A0A0A] bg-[#F5EFE0] hover:bg-[#F5EFE0]/80 disabled:opacity-60 disabled:cursor-not-allowed rounded-full transition-all shadow-xs cursor-pointer border border-[#D9CFBB] min-h-[40px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#2A5B4A] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#6B6357] font-normal">
        <span className="inline-flex items-center gap-1.5 bg-[#F5EFE0] px-3 py-1 rounded-full border border-[#D9CFBB] font-medium text-[#0A0A0A]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#2A5B4A]" />
          <span>Verified Governance Active</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#F5EFE0] px-3 py-1 rounded-full border border-[#D9CFBB] font-medium text-[#0A0A0A]">
          <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
          <span>Server-Scored Evaluation Engine</span>
        </span>
      </div>
    </motion.div>
  );
};

export default GovernanceOverview;
