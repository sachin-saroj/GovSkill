import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import { CredentialVerificationResponse } from '@/types';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Award,
  CheckCircle2,
  Calendar,
  UserCheck,
  Lock,
  Printer,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeUpVariants } from '@/lib/motion';

export const PublicVerificationPage: React.FC = () => {
  const { credentialId: paramId } = useParams<{ credentialId?: string }>();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [searchId, setSearchId] = useState<string>(paramId || '');
  const [credential, setCredential] = useState<CredentialVerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const verifyCredential = async (idToVerify: string) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await api.get<CredentialVerificationResponse>(`/credentials/verify/${cleanId}`);
      setCredential(res.data);
    } catch (err: any) {
      setCredential(null);
      if (err.response?.status === 404) {
        setError('Official credential record not found. Please verify the ID format or contact the issuing authority.');
      } else if (err.response?.status === 429) {
        setError('Too many verification requests. Please wait a moment before trying again.');
      } else {
        setError(err.response?.data?.detail?.error?.message || 'Verification lookup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      setSearchId(paramId);
      verifyCredential(paramId);
    }
  }, [paramId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/verify/${searchId.trim()}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-caption text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>

          <div className="flex items-center gap-2 text-micro font-semibold text-civic-700 bg-civic-50 px-3 py-1.5 rounded-full border border-civic-200 uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5 text-civic-700" />
            <span>HMAC-SHA256 Cryptographic Registry</span>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          variants={fadeUpVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          animate={shouldReduceMotion ? {} : 'visible'}
          className="text-center space-y-3 print:hidden"
        >
          <div className="inline-flex p-3 rounded-civic-xl bg-civic-900 text-saffron-400 shadow-civic-md">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-page-title font-semibold text-slate-900 tracking-tight">
            Official Credential Verification Portal
          </h1>
          <p className="text-body text-slate-600 max-w-xl mx-auto font-normal">
            Verify the authenticity of digital certificates issued by the Local Government Administration & Training Board.
          </p>
        </motion.div>

        {/* Lookup Search Input Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-civic-xl shadow-civic-sm border border-slate-200 print:hidden">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Credential ID (e.g., GS-CERT-2026-A1B2C3D4E5F6)"
                className="w-full pl-10 pr-4 py-2.5 text-caption rounded-civic-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-600 focus:border-transparent font-mono"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-civic-800 hover:bg-civic-900 text-white rounded-civic-md text-caption font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Result Area */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500 text-caption font-normal">
            <Loader2 className="h-8 w-8 animate-spin text-civic-700" />
            <p>Validating cryptographic signature against government registry...</p>
          </div>
        )}

        {error && !isLoading && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-civic-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 text-center"
          >
            <div className="inline-flex p-2.5 rounded-full bg-rose-100 text-rose-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-section-heading font-semibold">Verification Failed</h3>
            <p className="text-caption text-rose-700 max-w-md mx-auto font-normal">{error}</p>
          </motion.div>
        )}

        {credential && !isLoading && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Status Callout */}
            <div
              className={`p-4 sm:p-5 rounded-civic-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                credential.valid
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-civic-md ${
                    credential.valid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {credential.valid ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-section-heading font-semibold">
                    {credential.valid ? 'Official Credential Verified' : 'Signature Integrity Warning'}
                  </h3>
                  <p className="text-caption text-slate-600 font-normal">
                    {credential.valid
                      ? 'Cryptographic integrity verified using server-side HMAC-SHA256 signature.'
                      : 'Signature mismatch detected. This credential data may have been altered.'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-caption shrink-0 print:hidden bg-white hover:bg-slate-50 font-semibold"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Receipt</span>
              </Button>
            </div>

            {/* Official Verification Certificate Card */}
            <div className="bg-white rounded-civic-2xl p-6 sm:p-10 shadow-civic-lg border border-slate-200 relative overflow-hidden">
              {/* Seal Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <Award className="w-[450px] h-[450px] text-civic-900" />
              </div>

              <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-1.5 border-b border-slate-100 pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-50 border border-civic-200 text-civic-800 text-micro font-semibold uppercase tracking-wider mb-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>State Digital Competency Verification Record</span>
                  </div>
                  <h2 className="text-page-title font-semibold text-slate-900 tracking-tight">
                    {credential.module_title}
                  </h2>
                  <p className="text-caption text-slate-500 font-mono font-normal">
                    Credential ID: <span className="font-semibold text-slate-800">{credential.credential_id}</span>
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="flex items-center gap-1.5 text-micro font-semibold text-slate-500 uppercase tracking-wider">
                      <UserCheck className="h-3.5 w-3.5 text-civic-600" />
                      <span>Certified Recipient</span>
                    </span>
                    <p className="text-caption font-semibold text-slate-900 font-mono">{credential.recipient_masked}</p>
                    <span className="text-caption text-slate-400 font-normal">PII masked for public privacy</span>
                  </div>

                  <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="flex items-center gap-1.5 text-micro font-semibold text-slate-500 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5 text-civic-600" />
                      <span>Date of Issuance</span>
                    </span>
                    <p className="text-caption font-semibold text-slate-900">
                      {new Date(credential.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <span className="text-caption text-slate-400 font-normal">
                      {new Date(credential.issued_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="flex items-center gap-1.5 text-micro font-semibold text-slate-500 uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5 text-civic-600" />
                      <span>Score Achieved</span>
                    </span>
                    <p className="text-caption font-semibold text-emerald-700">
                      {credential.score_achieved} / {credential.total_score} ({credential.percentage}%)
                    </p>
                    <span className="text-caption text-slate-400 font-normal">Threshold: ≥ 75% required</span>
                  </div>
                </div>

                {/* Cryptographic Proof Details */}
                <div className="p-4 rounded-civic-xl bg-civic-950 text-slate-200 space-y-2 border border-civic-800">
                  <div className="flex items-center justify-between text-caption">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-saffron-400" />
                      <span>Cryptographic Verification Signature</span>
                    </span>
                    <span className="text-micro font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-civic-sm border border-emerald-800">
                      HMAC-SHA256
                    </span>
                  </div>
                  <p className="font-mono text-caption text-slate-400 break-all bg-civic-900/90 p-2.5 rounded-civic-md border border-civic-800 font-normal">
                    {credential.verification_hash}
                  </p>
                </div>

                {/* Footer Authority */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-caption text-slate-500 font-normal">
                  <span>Issued under authority of State Digital Governance Guidelines</span>
                  <span className="font-mono text-caption">GovSkill DPI Verification v1.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!hasSearched && !paramId && (
          <div className="text-center py-8 text-caption text-slate-400 font-normal">
            Enter a credential ID above to verify an official certificate.
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVerificationPage;
