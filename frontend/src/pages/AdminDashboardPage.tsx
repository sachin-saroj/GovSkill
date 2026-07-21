import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { QuizAttempt } from '@/types';
import { Card } from '@/components/ui/Card';
import { LayoutDashboard, Users, Award, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<QuizAttempt[]>('/admin/attempts');
      setAttempts(res.data);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail?.error?.message ||
        'Failed to load employee quiz attempt history';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const totalAttempts = attempts.length;
  const validAttempts = attempts.filter((a) => a.total > 0);
  const avgScore =
    validAttempts.length > 0
      ? (validAttempts.reduce((acc, curr) => acc + curr.score / curr.total, 0) / validAttempts.length) * 100
      : 0;
  const passCount = attempts.filter((a) => a.total > 0 && a.score / a.total >= 0.75).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-[#5A6472]">
        <Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" />
        <span>Loading admin dashboard metrics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E2E6EB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm mb-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Supervisor Portal</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1F2B]">Admin Dashboard</h1>
        </div>

        <button
          onClick={fetchAttempts}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6472] border border-[#E2E6EB] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B]">
          {error}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1E4D8C]/10 text-[#1E4D8C]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Total Employee Attempts</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">{totalAttempts}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#2E9E6B]/10 text-[#2E9E6B]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Average Employee Score</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">{Math.round(avgScore)}%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#D98E04]/10 text-[#D98E04]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Passed Attempts (≥75%)</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">
              {passCount} / {totalAttempts}
            </span>
          </div>
        </Card>
      </div>

      {/* Attempts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E6EB] bg-[#F7F9FB]">
          <h2 className="text-base font-semibold text-[#1A1F2B]">Employee Quiz Performance Log</h2>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#5A6472]">
            No employee quiz attempts recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1A1F2B]">
              <thead className="bg-[#F7F9FB] border-b border-[#E2E6EB] text-xs font-semibold text-[#5A6472] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Employee Email</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Percentage</th>
                  <th className="px-6 py-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6EB]">
                {attempts.map((att, idx) => {
                  const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                  const isPass = pct >= 75;

                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{att.user_email}</td>
                      <td className="px-6 py-4 text-[#5A6472]">{att.module_title}</td>
                      <td className="px-6 py-4 font-semibold text-[#1E4D8C]">
                        {att.score} / {att.total}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isPass ? 'bg-[#2E9E6B]/10 text-[#2E9E6B]' : 'bg-[#D98E04]/10 text-[#D98E04]'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#5A6472]">
                        {att.submitted_at
                          ? new Date(att.submitted_at).toLocaleString()
                          : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
export default AdminDashboardPage;
