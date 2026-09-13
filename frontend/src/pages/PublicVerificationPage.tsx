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
    <div className="min-h-screen bg-[#F5EFE0] py-10 px-4 sm:px-6 lg:px-8 text-[#0A0A0A]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-caption text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0] rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>

          <div className="flex items-center gap-2 font-mono text-micro font-semibold text-[#6B6357] bg-[#EDE4D0] px-3.5 py-1.5 rounded-full border border-[#D9CFBB] uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5 text-[#2A5B4A]" />
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
          <div className="inline-flex p-3 rounded-full bg-[#0A0A0A] text-[#C9A24A] mb-1">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-page-title font-normal text-[#0A0A0A] tracking-tight">
            Official Credential Verification Portal
          </h1>
          <p className="text-body text-[#6B6357] max-w-xl mx-auto font-normal">
            Verify the authenticity of digital certificates issued by the Local Government Administration & Training Board.
          </p>
        </motion.div>

        {/* Lookup Search Input Bar */}
        <div className="bg-[#EDE4D0] p-4 sm:p-6 rounded-2xl border border-[#D9CFBB] print:hidden">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6357]" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Credential ID (e.g., GS-CERT-2026-A1B2C3D4E5F6)"
                className="w-full pl-10 pr-4 py-2.5 text-caption rounded-full border border-[#D9CFBB] bg-[#F5EFE0] text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/20 focus:border-[#0A0A0A] font-mono min-h-[44px]"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0A0A0A] hover:bg-[#0A0A0A]/90 text-[#F5EFE0] rounded-full text-caption font-semibold min-h-[44px] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#F5EFE0]" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#C9A24A]" />
                  <span>Verify Credential</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Informational Seal Illustration Banner (When no credential is yet looked up) */}
        {!credential && !isLoading && !error && (
          <motion.div
            variants={fadeUpVariants}
            initial={shouldReduceMotion ? {} : 'hidden'}
            animate={shouldReduceMotion ? {} : 'visible'}
            className="p-6 sm:p-8 rounded-2xl bg-[#EDE4D0]/60 border border-[#D9CFBB] flex flex-col sm:flex-row items-center gap-6 shadow-xs print:hidden"
          >
            <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden border border-[#D9CFBB] bg-[#F5EFE0] shrink-0">
              <img
                src="/illustrations/verification_trust_seal.jpg"
                alt="Sovereign Credential Authentication"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#C97B5A] block font-semibold">
                Cryptographic Trust Standard
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#0A0A0A]">
                Tamper-Evident HMAC-SHA256 Digital Verification
              </h3>
              <p className="text-xs text-[#6B6357] leading-relaxed max-w-lg">
                Enter any official certificate serial issued to revenue officers to immediately confirm authenticity, issue timestamp, and examination score against the sovereign registry ledger.
              </p>
            </div>
          </motion.div>
        )}

        {/* Result Area */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#6B6357] text-caption font-normal">
            <Loader2 className="h-8 w-8 animate-spin text-[#2A5B4A]" />
            <p>Validating cryptographic signature against government registry...</p>
          </div>
        )}

        {error && !isLoading && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-2xl bg-[#C97B5A]/10 border border-[#C97B5A]/30 text-[#C97B5A] space-y-2 text-center"
          >
            <div className="inline-flex p-2.5 rounded-full bg-[#C97B5A]/15 text-[#C97B5A]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-section-heading font-normal text-[#0A0A0A]">Verification Failed</h3>
            <p className="text-caption text-[#6B6357] max-w-md mx-auto font-normal">{error}</p>
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
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                credential.valid
                  ? 'bg-[#2A5B4A]/10 border-[#2A5B4A]/30 text-[#0A0A0A]'
                  : 'bg-[#C97B5A]/10 border-[#C97B5A]/30 text-[#0A0A0A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-full ${
                    credential.valid ? 'bg-[#2A5B4A] text-white' : 'bg-[#C97B5A] text-white'
                  }`}
                >
                  {credential.valid ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-serif text-section-heading font-normal text-[#0A0A0A]">
                    {credential.valid ? 'Official Credential Verified' : 'Signature Integrity Warning'}
                  </h3>
                  <p className="text-caption text-[#6B6357] font-normal">
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
                className="flex items-center gap-1.5 text-caption shrink-0 print:hidden bg-[#F5EFE0] hover:bg-[#EDE4D0] border-[#D9CFBB] text-[#0A0A0A] font-semibold rounded-full min-h-[40px] px-4 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Receipt</span>
              </Button>
            </div>

            {/* Official Verification Certificate Card */}
            <div className="bg-[#EDE4D0] rounded-3xl p-6 sm:p-8 border border-[#D9CFBB] relative overflow-hidden">
              {/* Inner archival parchment frame */}
              <div className="bg-[#F5EFE0] rounded-2xl p-6 sm:p-10 border border-[#D9CFBB] relative overflow-hidden">
                {/* Seal Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <Award className="w-[450px] h-[450px] text-[#0A0A0A]" />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-1.5 border-b border-[#D9CFBB] pb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE4D0] border border-[#D9CFBB] text-[#6B6357] font-mono text-micro font-semibold uppercase tracking-wider mb-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#2A5B4A]" />
                      <span>State Digital Competency Verification Record</span>
                    </div>
                    <h2 className="font-serif text-page-title font-normal text-[#0A0A0A] tracking-tight">
                      {credential.module_title}
                    </h2>
                    <p className="text-caption text-[#6B6357] font-mono font-normal">
                      Credential ID: <span className="font-semibold text-[#0A0A0A]">{credential.credential_id}</span>
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#EDE4D0] border border-[#D9CFBB] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-micro font-semibold text-[#6B6357] uppercase tracking-wider">
                        <UserCheck className="h-3.5 w-3.5 text-[#2A5B4A]" />
                        <span>Certified Recipient</span>
                      </span>
                      <p className="text-caption font-semibold text-[#0A0A0A] font-mono">{credential.recipient_masked}</p>
                      <span className="text-caption text-[#6B6357] font-normal">PII masked for public privacy</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#EDE4D0] border border-[#D9CFBB] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-micro font-semibold text-[#6B6357] uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-[#2A5B4A]" />
                        <span>Date of Issuance</span>
                      </span>
                      <p className="text-caption font-semibold text-[#0A0A0A]">
                        {new Date(credential.issued_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <span className="text-caption text-[#6B6357] font-normal font-mono">
                        {new Date(credential.issued_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#EDE4D0] border border-[#D9CFBB] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-micro font-semibold text-[#6B6357] uppercase tracking-wider">
                        <Award className="h-3.5 w-3.5 text-[#2A5B4A]" />
                        <span>Score Achieved</span>
                      </span>
                      <p className="text-caption font-semibold text-[#2A5B4A]">
                        {credential.score_achieved} / {credential.total_score} ({credential.percentage}%)
                      </p>
                      <span className="text-caption text-[#6B6357] font-normal">Threshold: ≥ 75% required</span>
                    </div>
                  </div>

                  {/* Cryptographic Proof Details */}
                  <div className="p-4 rounded-xl bg-[#0A0A0A] text-[#F5EFE0] space-y-2 border border-[#D9CFBB]/30">
                    <div className="flex items-center justify-between text-caption">
                      <span className="font-medium text-[#D9CFBB] flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-[#C9A24A]" />
                        <span>Cryptographic Verification Signature</span>
                      </span>
                      <span className="text-micro font-mono text-[#C9A24A] font-semibold bg-[#C9A24A]/10 px-2 py-0.5 rounded-full border border-[#C9A24A]/30">
                        HMAC-SHA256
                      </span>
                    </div>
                    <p className="font-mono text-caption text-[#D9CFBB] break-all bg-[#0A0A0A] p-2.5 rounded-lg border border-[#D9CFBB]/20 font-normal">
                      {credential.verification_hash}
                    </p>
                  </div>

                  {/* Footer Authority */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D9CFBB] text-caption text-[#6B6357] font-normal">
                    <span>Issued under authority of State Digital Governance Guidelines</span>
                    <span className="font-mono text-caption text-[#0A0A0A]">GovSkill DPI Verification v1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!hasSearched && !paramId && (
          <div className="text-center py-8 text-caption text-[#6B6357] font-normal">
            Enter a credential ID above to verify an official certificate.
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVerificationPage;
