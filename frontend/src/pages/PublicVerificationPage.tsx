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
import { GovSkillLogo } from '@/components/GovSkillLogo';

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
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 text-[#09090B]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-caption text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA] rounded-none border border-transparent hover:border-[#E4E4E7]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>

          <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#71717A] bg-[#FAFAFA] px-3.5 py-1.5 rounded-none border border-[#E4E4E7] uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5 text-[#0E50B0]" />
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
          <div className="flex justify-center mb-1">
            <GovSkillLogo size={52} variant="icon" />
          </div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717A] block">
            SOVEREIGN CREDENTIAL REPOSITORY
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase text-[#09090B] tracking-tight">
            Official Credential Verification Portal
          </h1>
          <p className="text-body text-[#71717A] max-w-xl mx-auto font-normal">
            Verify the authenticity of digital certificates issued by the Local Government Administration & Training Board.
          </p>
        </motion.div>

        {/* Lookup Search Input Bar */}
        <div className="bg-[#FAFAFA] p-4 sm:p-6 rounded-none border border-[#E4E4E7] print:hidden">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Credential ID (e.g., GS-CERT-2026-A1B2C3D4E5F6)"
                className="w-full pl-10 pr-4 py-2.5 text-caption rounded-none border border-[#E4E4E7] bg-white text-[#09090B] focus:outline-none focus:ring-1 focus:ring-[#0E50B0] focus:border-[#0E50B0] font-mono min-h-[44px]"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-[#0E50B0] text-white rounded-none text-caption font-bold uppercase tracking-wider min-h-[44px] cursor-pointer shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-white" />
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
            className="p-6 sm:p-8 rounded-none bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col sm:flex-row items-center gap-6 print:hidden"
          >
            <div className="w-full sm:w-48 h-36 rounded-none overflow-hidden border border-[#E4E4E7] bg-white shrink-0">
              <img
                src="/illustrations/verification_trust_seal.jpg"
                alt="Sovereign Credential Authentication"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0E50B0] block font-bold">
                Cryptographic Trust Standard
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-bold uppercase text-[#09090B]">
                Tamper-Evident HMAC-SHA256 Digital Verification
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed max-w-lg">
                Enter any official certificate serial issued to revenue officers to immediately confirm authenticity, issue timestamp, and examination score against the sovereign registry ledger.
              </p>
            </div>
          </motion.div>
        )}

        {/* Result Area */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#71717A] text-caption font-mono">
            <Loader2 className="h-8 w-8 animate-spin text-[#0E50B0]" />
            <p>Validating cryptographic signature against government registry...</p>
          </div>
        )}

        {error && !isLoading && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-none bg-red-50 border-l-4 border-l-[#AF411E] border-[#E4E4E7] text-[#AF411E] space-y-2 text-center"
          >
            <div className="inline-flex p-2.5 rounded-none bg-red-100 text-[#AF411E]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-section-heading font-bold uppercase text-[#09090B]">Verification Failed</h3>
            <p className="text-caption text-[#71717A] max-w-md mx-auto font-normal">{error}</p>
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
              className={`p-4 sm:p-5 rounded-none border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                credential.valid
                  ? 'bg-emerald-50/50 border-emerald-300 text-[#09090B]'
                  : 'bg-red-50/50 border-red-300 text-[#09090B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-none ${
                    credential.valid ? 'bg-emerald-700 text-white' : 'bg-[#AF411E] text-white'
                  }`}
                >
                  {credential.valid ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-sans text-section-heading font-bold uppercase text-[#09090B]">
                    {credential.valid ? 'Official Credential Verified' : 'Signature Integrity Warning'}
                  </h3>
                  <p className="text-caption text-[#71717A] font-normal">
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
                className="flex items-center gap-1.5 text-caption shrink-0 print:hidden bg-white hover:bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B] font-bold uppercase tracking-wider rounded-none min-h-[40px] px-4 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Receipt</span>
              </Button>
            </div>

            {/* Official Verification Certificate Card */}
            <div className="bg-white rounded-none p-6 sm:p-8 border border-[#E4E4E7] relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0E50B0]" />
              {/* Inner archival parchment frame */}
              <div className="bg-[#FAFAFA] rounded-none p-6 sm:p-10 border border-[#E4E4E7] relative overflow-hidden">
                {/* Seal Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <Award className="w-[450px] h-[450px] text-[#09090B]" />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-1.5 border-b border-[#E4E4E7] pb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white border border-[#E4E4E7] text-[#71717A] font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#0E50B0]" />
                      <span>State Digital Competency Verification Record</span>
                    </div>
                    <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-[#09090B] tracking-tight">
                      {credential.module_title}
                    </h2>
                    <p className="text-caption text-[#71717A] font-mono font-normal">
                      Credential ID: <span className="font-bold text-[#09090B]">{credential.credential_id}</span>
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-none bg-white border border-[#E4E4E7] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                        <UserCheck className="h-3.5 w-3.5 text-[#0E50B0]" />
                        <span>Certified Recipient</span>
                      </span>
                      <p className="text-caption font-bold text-[#09090B] font-mono">{credential.recipient_masked}</p>
                      <span className="text-[11px] text-[#71717A] font-normal">PII masked for public privacy</span>
                    </div>

                    <div className="p-4 rounded-none bg-white border border-[#E4E4E7] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-[#0E50B0]" />
                        <span>Date of Issuance</span>
                      </span>
                      <p className="text-caption font-bold text-[#09090B]">
                        {new Date(credential.issued_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <span className="text-[11px] text-[#71717A] font-normal font-mono">
                        {new Date(credential.issued_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="p-4 rounded-none bg-white border border-[#E4E4E7] space-y-1">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                        <Award className="h-3.5 w-3.5 text-[#0E50B0]" />
                        <span>Score Achieved</span>
                      </span>
                      <p className="text-caption font-bold text-emerald-700">
                        {credential.score_achieved} / {credential.total_score} ({credential.percentage}%)
                      </p>
                      <span className="text-[11px] text-[#71717A] font-normal">Threshold: ≥ 75% required</span>
                    </div>
                  </div>

                  {/* Cryptographic Proof Details */}
                  <div className="p-4 rounded-none bg-black text-white space-y-2 border border-zinc-800">
                    <div className="flex items-center justify-between text-caption">
                      <span className="font-bold text-zinc-300 flex items-center gap-1.5 font-mono uppercase text-xs">
                        <Lock className="h-3.5 w-3.5 text-[#0E50B0]" />
                        <span>Cryptographic Verification Signature</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-300 font-bold bg-zinc-800 px-2 py-0.5 rounded-none border border-zinc-700">
                        HMAC-SHA256
                      </span>
                    </div>
                    <p className="font-mono text-caption text-zinc-300 break-all bg-zinc-950 p-2.5 rounded-none border border-zinc-800 font-normal">
                      {credential.verification_hash}
                    </p>
                  </div>

                  {/* Footer Authority */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7] text-caption text-[#71717A] font-normal">
                    <span>Issued under authority of State Digital Governance Guidelines</span>
                    <span className="font-mono text-caption text-[#09090B]">GovSkill DPI Verification v1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!hasSearched && !paramId && (
          <div className="text-center py-8 text-caption text-[#71717A] font-normal">
            Enter a credential ID above to verify an official certificate.
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVerificationPage;
