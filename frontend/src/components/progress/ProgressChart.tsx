import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AssessmentHistoryItem } from '@/types';
import Card from '@/components/ui/Card';
import { TrendingUp, FileQuestion } from 'lucide-react';

interface ProgressChartProps {
  history: AssessmentHistoryItem[];
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ history, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredPoint, setHoveredPoint] = useState<AssessmentHistoryItem | null>(null);

  // Filter and sort attempts chronologically
  const sortedAttempts = [...history].sort((a, b) => {
    return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
  });

  // Section 17 requirement: If there is insufficient historical data, show intentional empty state. Do NOT fabricate chart points.
  if (sortedAttempts.length < 2) {
    return (
      <Card className={`p-6 rounded-2xl border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#C9A24A]" />
            <h3 className="font-serif font-bold text-base text-[#0A0A0A]">
              Competency Growth Trajectory
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
            Trajectory
          </span>
        </div>

        <div className="py-8 px-4 rounded-xl bg-[#F5EFE0] border border-dashed border-[#D9CFBB] text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-full bg-[#EDE4D0] text-[#6B6357]">
            <FileQuestion className="h-5 w-5" />
          </div>
          <h4 className="font-serif font-semibold text-sm text-[#0A0A0A]">
            Insufficient Historical Trajectory
          </h4>
          <p className="text-[12px] text-[#6B6357] max-w-xs mx-auto">
            Complete at least 2 scored assessments to plot your verified attempt-over-attempt score growth curve.
          </p>
        </div>
      </Card>
    );
  }

  // SVG dimensions
  const width = 360;
  const height = 140;
  const paddingX = 35;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map points to SVG coordinates
  const points = sortedAttempts.map((attempt, idx) => {
    const x = paddingX + (idx / (sortedAttempts.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (attempt.score_percentage / 100) * chartHeight;
    return { x, y, attempt };
  });

  // Generate SVG path command with smooth lines
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  // Closed area under the curve for subtle gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // 75% benchmark threshold Y
  const benchmarkY = paddingY + chartHeight - (75 / 100) * chartHeight;

  return (
    <Card className={`p-6 rounded-2xl border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#C9A24A]" />
          <h3 className="font-serif font-bold text-base text-[#0A0A0A]">
            Competency Growth Trajectory
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#2A5B4A] bg-[#2A5B4A]/10 px-2.5 py-0.5 rounded-full border border-[#2A5B4A]/30">
          {sortedAttempts.length} Evaluations
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Score trajectory chart showing evaluation attempts over time"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 75% Benchmark Target Line */}
          <line
            x1={paddingX}
            y1={benchmarkY}
            x2={width - paddingX}
            y2={benchmarkY}
            stroke="#C97B5A"
            strokeDasharray="4 3"
            strokeWidth="1.2"
            opacity="0.85"
          />
          <text
            x={width - paddingX}
            y={benchmarkY - 4}
            textAnchor="end"
            fontSize="9"
            fill="#C97B5A"
            fontWeight="600"
            fontFamily="monospace"
          >
            75% Target
          </text>

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Smooth Trajectory Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
          />

          {/* Data Points */}
          {points.map(({ x, y, attempt }) => {
            const isHovered = hoveredPoint?.attempt_id === attempt.attempt_id;
            return (
              <g
                key={attempt.attempt_id}
                onMouseEnter={() => setHoveredPoint(attempt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={attempt.passed ? '#2A5B4A' : '#0A0A0A'}
                  stroke="#F5EFE0"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#0A0A0A] text-[#F5EFE0] text-[11px] shadow-lg space-y-0.5 animate-fade-in border border-[#D9CFBB]/30">
            <div className="flex items-center justify-between font-semibold">
              <span className="truncate max-w-[180px] font-serif">{hoveredPoint.module_title}</span>
              <span className={hoveredPoint.passed ? 'text-[#2A5B4A] font-mono' : 'text-[#C97B5A] font-mono'}>
                {hoveredPoint.score_percentage}%
              </span>
            </div>
            <p className="text-[#EDE4D0]/70 text-[10px] font-mono">
              Attempt #{hoveredPoint.attempt_number} • Score: {hoveredPoint.score}/{hoveredPoint.total}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#6B6357] pt-1 border-t border-[#D9CFBB] font-mono">
        <span>Initial Evaluation</span>
        <span>Latest Attempt</span>
      </div>
    </Card>
  );
};

export default ProgressChart;
