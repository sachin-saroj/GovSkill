import React from 'react';
import { LayoutDashboard, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

interface GovernanceOverviewProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const GovernanceOverview: React.FC<GovernanceOverviewProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-civic-950 via-civic-900 to-civic-800 p-6 sm:p-8 text-white shadow-civic-lg border border-civic-800">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-saffron-400 font-bold text-xs">
            <LayoutDashboard className="h-4 w-4" />
            <span>Supervisor Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Dashboard & CMS
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Monitor municipal employee digital readiness, oversee training curriculum, and manage server-scored assessment questions.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 bg-civic-950/80 px-2.5 py-1 rounded-md border border-civic-800 font-semibold text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Governance Active</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-civic-950/80 px-2.5 py-1 rounded-md border border-civic-800 font-semibold text-slate-200">
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
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all shadow-civic-sm cursor-pointer active:scale-95 border border-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-civic-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing Telemetry...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernanceOverview;
