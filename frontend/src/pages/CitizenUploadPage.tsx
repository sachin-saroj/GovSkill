import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import { DocumentUploadResponse, ValidationRuleResult } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ValidationResultCard from '@/components/document/ValidationResultCard';
import CounterSlipModal from '@/components/citizen/CounterSlipModal';
import {
  FileText,
  UploadCloud,
  AlertCircle,
  Search,
  Copy,
  Check,
  RotateCcw,
  Tag,
  ShieldCheck,
  Info,
  X,
  FileCode2,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const CitizenUploadPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'upload' | 'lookup'>('upload');
  const shouldReduceMotion = useReducedMotion();

  // --- Upload State ---
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [results, setResults] = useState<ValidationRuleResult[] | null>(null);
  const [overallStatus, setOverallStatus] = useState<string>('ACTION_REQUIRED');
  const [passedCount, setPassedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(4);
  const [recommendedNextStep, setRecommendedNextStep] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isCounterSlipOpen, setIsCounterSlipOpen] = useState(false);

  // --- Lookup State ---
  const [lookupId, setLookupId] = useState<string>('');

  // Handle URL param ?id= or ?ref= on mount
  useEffect(() => {
    const refParam = searchParams.get('id') || searchParams.get('ref');
    if (refParam) {
      setLookupId(refParam);
      setActiveTab('lookup');
      fetchDocumentById(refParam);
    }
  }, []);

  // Cleanup object URL preview on unmount/change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchDocumentById = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a valid document Reference ID.');
      return;
    }

    setIsLoading(true);
    setProcessingStage('Retrieving document records...');
    setError(null);
    try {
      const res = await api.get<DocumentUploadResponse>(`/documents/${id.trim()}`);
      setDocumentId(res.data.document_id);
      setResults(res.data.validation_results);
      setOverallStatus(res.data.overall_status || 'ACTION_REQUIRED');
      setPassedCount(res.data.passed_rules_count ?? res.data.validation_results.filter((r) => r.passed).length);
      setTotalCount(res.data.total_rules_count ?? res.data.validation_results.length);
      setRecommendedNextStep(res.data.recommended_next_step || null);
      setTimestamp(res.data.timestamp || null);
      setExtractedData(res.data.extracted_data);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail?.error?.message ||
        'Document not found. Please verify the Reference ID.';
      setError(msg);
      setResults(null);
      setExtractedData(null);
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupId.trim()) {
      setSearchParams({ id: lookupId.trim() });
      fetchDocumentById(lookupId.trim());
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum 5MB limit.`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain'];
    if (selectedFile.type && !validTypes.includes(selectedFile.type)) {
      setError('Unsupported file format. Please upload a JPG, PNG, or PDF file.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create safe thumbnail preview for images
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Income Certificate document image or PDF first.');
      return;
    }

    setIsLoading(true);
    setProcessingStage('Uploading document to secure processing vault...');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProcessingStage('Running Tesseract OCR & extracting structured fields...');
      const res = await api.post<DocumentUploadResponse>('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocumentId(res.data.document_id);
      setResults(res.data.validation_results);
      setOverallStatus(res.data.overall_status || 'ACTION_REQUIRED');
      setPassedCount(res.data.passed_rules_count ?? res.data.validation_results.filter((r) => r.passed).length);
      setTotalCount(res.data.total_rules_count ?? res.data.validation_results.length);
      setRecommendedNextStep(res.data.recommended_next_step || null);
      setTimestamp(res.data.timestamp || null);
      setExtractedData(res.data.extracted_data);
      setSearchParams({ id: res.data.document_id });
    } catch (err: any) {
      const msg =
        err.response?.data?.detail?.error?.message ||
        'Failed to upload and validate citizen document.';
      setError(msg);
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setDocumentId(null);
    setResults(null);
    setExtractedData(null);
    setError(null);
    setLookupId('');
    setSearchParams({});
  };

  const handleCopyId = () => {
    if (documentId) {
      navigator.clipboard.writeText(documentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Civic Header Banner — Operational Editorial Framework */}
      <motion.div variants={fadeUpVariants}>
        <div className="relative overflow-hidden bg-surface border border-border-warm rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm pt-1">
            <div className="flex items-center gap-3.5">
              <img
                src="/govskill-icon.png"
                alt="GovSkill Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-sm shrink-0"
                loading="eager"
              />
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted block">
                  GovAssist Citizen Self-Service
                </span>
                <span className="text-caption text-ink-muted font-medium">
                  Official Revenue & Taluk Document Verification Protocol
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" className="rounded-full uppercase font-mono text-[10px] tracking-wider" dot>
                100% Deterministic Engine
              </Badge>
              <Badge variant="info" size="sm" className="rounded-full uppercase font-mono text-[10px] tracking-wider">
                Zero Login Required
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#AF411E]">
                Pre-Submission Protocol • Module 01
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                Income Certificate Pre-submission Checker
              </h1>
              <p className="text-body text-ink-muted max-w-3xl leading-relaxed">
                Upload your Income Certificate before formal submission to catch potential errors (expired dates, unreadable numbers, formatting issues).
              </p>

              {/* Factual Disclaimer Strip */}
              <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm text-caption text-ink-muted flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#AF411E] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-bold text-ink">Notice:</strong> This self-service pre-check validates standard document readability and format rules prior to your Taluk office visit. It does not replace formal verification by competent revenue authorities.
                </p>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4">
              <div className="border border-border-warm bg-surface-light p-2 rounded-xl overflow-hidden">
                <img
                  src="/illustrations/govassist_upload_illustration.jpg"
                  alt="Editorial illustration of a citizen presenting a certificate at a municipal counter"
                  className="w-full h-auto object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="pt-2 px-1 flex items-center justify-between text-[9px] font-mono text-ink-muted uppercase tracking-wider border-t border-border-warm mt-2">
                  <span>PLATE 01 // CITIZEN INTAKE</span>
                  <span>PRE-CHECK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Alert Box with AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 bg-surface rounded-xl border-l-4 border-l-[#AF411E] border border-border-warm text-caption text-[#AF411E] flex items-start justify-between gap-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#AF411E] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-ink uppercase tracking-wider text-xs">Verification Notice</p>
                <p className="leading-relaxed text-ink-muted">{error}</p>
              </div>
            </div>
            {file && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUpload}
                className="text-xs font-bold uppercase tracking-wider shrink-0 rounded-full border-border-warm bg-surface-elevated hover:bg-surface-light text-ink"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                <span>Retry</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation — Pill Segmented Control */}
      <motion.div variants={fadeUpVariants} className="inline-flex p-1 bg-surface-elevated rounded-full border border-border-warm gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-ink text-on-ink shadow-sm'
              : 'text-ink-muted hover:text-ink hover:bg-surface-light'
          }`}
        >
          <UploadCloud className={`h-4 w-4 ${activeTab === 'upload' ? 'text-on-ink' : 'text-[#AF411E]'}`} />
          <span>Upload Document</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lookup')}
          className={`px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-full transition-all cursor-pointer ${
            activeTab === 'lookup'
              ? 'bg-ink text-on-ink shadow-sm'
              : 'text-ink-muted hover:text-ink hover:bg-surface-light'
          }`}
        >
          <Search className={`h-4 w-4 ${activeTab === 'lookup' ? 'text-on-ink' : 'text-[#AF411E]'}`} />
          <span>Lookup by Reference ID</span>
        </button>
      </motion.div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload or Lookup Form (5 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-5 space-y-6">
          {activeTab === 'upload' ? (
            <Card className="space-y-6 bg-surface border-border-warm rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 border-b border-border-warm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#AF411E] block mb-1">
                  Step 01 • Intake
                </span>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-ink">
                  Upload Income Certificate
                </h2>
                <p className="text-caption text-ink-muted mt-1">
                  Digital scan, photograph, or PDF file
                </p>
              </div>

              {/* 4-Stage Processing Pipeline Visual */}
              <div className="bg-surface-light p-4 rounded-xl border border-border-warm space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted">
                  <span>Verification Pipeline</span>
                  <span className="text-[#AF411E] font-mono">4 Automated Stages</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono font-bold uppercase">
                  <div className={`p-2 rounded-lg border transition-colors ${file ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-surface-elevated text-ink-muted border-border-warm'}`}>
                    1. Select
                  </div>
                  <div className={`p-2 rounded-lg border transition-colors ${isLoading ? 'bg-orange-50 text-[#AF411E] border-orange-300 animate-pulse' : results ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-surface-elevated text-ink-muted border-border-warm'}`}>
                    2. OCR
                  </div>
                  <div className={`p-2 rounded-lg border transition-colors ${results ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-surface-elevated text-ink-muted border-border-warm'}`}>
                    3. Rules
                  </div>
                  <div className={`p-2 rounded-lg border transition-colors ${results ? 'bg-ink text-on-ink border-ink' : 'bg-surface-elevated text-ink-muted border-border-warm'}`}>
                    4. Result
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                {/* Drag and Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-150 ${
                    isLoading
                      ? 'border-border-warm bg-surface-light cursor-not-allowed opacity-60'
                      : isDragging
                      ? 'border-[#AF411E] bg-[#AF411E]/5 ring-2 ring-[#AF411E]/20'
                      : file
                      ? 'border-emerald-500/40 bg-emerald-50/30'
                      : 'border-border-warm bg-surface-light/60 hover:border-ink hover:bg-surface-light'
                  }`}
                >
                  {!file && (
                    <div className="w-20 h-20 mx-auto mb-3 rounded-2xl border border-border-warm bg-surface-elevated flex items-center justify-center text-ink-muted shadow-sm">
                      <UploadCloud className="w-8 h-8 text-[#AF411E]" />
                    </div>
                  )}

                  <label
                    htmlFor="file-upload"
                    className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                  >
                    <span
                      className={`text-sm font-bold uppercase tracking-tight block ${
                        isLoading
                          ? 'text-ink-muted no-underline'
                          : 'text-ink hover:underline'
                      }`}
                    >
                      Choose an Income Certificate to pre-check
                    </span>
                    <span className="text-[11px] text-ink-muted block mt-1 font-mono">
                      PNG, JPG, or PDF scan (Max 5MB) • 100% Deterministic Engine
                    </span>
                    <input
                      id="file-upload"
                      aria-label="Choose a file to upload"
                      type="file"
                      accept="image/png,image/jpeg,application/pdf,text/plain"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="hidden"
                    />
                  </label>

                  {/* Selected File Chip & Image Preview with AnimatePresence */}
                  <AnimatePresence>
                    {file && (
                      <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
                        className="mt-4 p-3.5 bg-surface-elevated rounded-xl border border-border-warm text-caption font-bold text-ink space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {previewUrl ? (
                              <ImageIcon className="h-4 w-4 text-[#AF411E] shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-[#AF411E] shrink-0" />
                            )}
                            <span className="truncate max-w-[200px] font-mono text-xs">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                              }
                            }}
                            disabled={isLoading}
                            title="Remove file"
                            className="text-ink-muted hover:text-[#AF411E] p-1 transition-colors cursor-pointer rounded-full hover:bg-surface"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {previewUrl && (
                          <div className="pt-2 border-t border-border-warm flex justify-center">
                            <img
                              src={previewUrl}
                              alt="Document Preview"
                              className="max-h-36 object-contain rounded-lg border border-border-warm"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isLoading && processingStage && (
                  <div className="p-3 bg-surface-light rounded-xl border border-border-warm text-xs text-ink flex items-center gap-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-[#AF411E] shrink-0" />
                    <span className="font-mono font-medium">{processingStage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-bold uppercase tracking-wider cursor-pointer rounded-full min-h-[44px] bg-ink hover:bg-ink/90 text-on-ink"
                  size="md"
                  disabled={isLoading || !file}
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isLoading ? 'Processing Document...' : 'Run Pre-check Validation'}
                </Button>
              </form>

              {/* Pre-check Rules Tested Guide */}
              <div className="text-caption text-ink-muted space-y-2 pt-4 border-t border-border-warm">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#AF411E]" />
                  <span>Pre-check Compliance Rules:</span>
                </div>
                <ul className="grid grid-cols-1 gap-2 pl-1 text-xs">
                  <li className="flex items-center gap-2 text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AF411E] shrink-0" />
                    <span><strong className="font-bold text-ink">Name present:</strong> Verifies applicant name is clearly readable.</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AF411E] shrink-0" />
                    <span><strong className="font-bold text-ink">Certificate number:</strong> Verifies alphanumeric format (≥6 chars).</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AF411E] shrink-0" />
                    <span><strong className="font-bold text-ink">Expiry check:</strong> Confirms certificate date is not expired.</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AF411E] shrink-0" />
                    <span><strong className="font-bold text-ink">Mandatory extraction:</strong> Confirms all required fields are intact.</span>
                  </li>
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="space-y-6 bg-surface border-border-warm rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-4 border-b border-border-warm">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#AF411E] block mb-1">
                  Archive Retrieval
                </span>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-ink">
                  Lookup Previous Pre-check
                </h2>
                <p className="text-caption text-ink-muted mt-1">
                  Retrieve existing document OCR & validation report
                </p>
              </div>

              <p className="text-body text-ink-muted leading-relaxed">
                Enter your document's unique Reference ID to review previous OCR extraction results and deterministic compliance findings.
              </p>
              <form onSubmit={handleLookupSubmit} className="space-y-5">
                <Input
                  label="Document Reference ID (UUID)"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  required
                  disabled={isLoading}
                  leftIcon={<Search className="h-4 w-4 text-ink-muted" />}
                  className="rounded-xl min-h-[44px]"
                />

                <Button
                  type="submit"
                  className="w-full font-bold uppercase tracking-wider cursor-pointer rounded-full min-h-[44px] bg-ink hover:bg-ink/90 text-on-ink"
                  size="md"
                  disabled={isLoading || !lookupId.trim()}
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isLoading ? 'Retrieving Document...' : 'Lookup Reference ID'}
                </Button>
              </form>

              <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm text-caption text-ink-muted flex items-start gap-2">
                <Info className="h-4 w-4 text-[#AF411E] shrink-0 mt-0.5" />
                <span>Reference IDs are generated automatically on upload and can be shared or reviewed at any time.</span>
              </div>
            </Card>
          )}

          {/* Reset Flow Button */}
          {results && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-4 rounded-full border border-border-warm bg-surface-elevated hover:bg-surface-light text-ink font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5 text-ink-muted" />
                <span>Pre-check Another Document</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Reference ID, Extracted Fields, and Validation Results (7 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-7 space-y-6">
          {/* Reference ID Pill Card with AnimatePresence */}
          <AnimatePresence>
            {documentId && (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              >
                <div className="bg-surface border border-border-warm rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-ink text-on-ink flex items-center justify-center shrink-0">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted block">
                          Document Reference ID:
                        </span>
                        <span className="font-mono text-xs font-bold text-ink truncate block">
                          {documentId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCounterSlipOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-ink bg-surface-elevated border border-border-warm hover:bg-surface-light rounded-full shrink-0 transition-colors cursor-pointer shadow-sm"
                        title="Generate Official Pre-Submission Counter Slip"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 text-[#AF411E]" />
                        <span>Pre-submission Counter Slip</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-ink bg-surface-elevated border border-border-warm hover:bg-surface-light rounded-full shrink-0 transition-colors cursor-pointer shadow-sm"
                      >
                        {copiedId ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-ink-muted" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extracted OCR Fields Card with AnimatePresence */}
          <AnimatePresence>
            {extractedData && Object.keys(extractedData).length > 0 && (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              >
                <div className="bg-surface border border-border-warm rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[#AF411E]" />
                      <h3 className="font-sans font-bold text-base uppercase tracking-tight text-ink">
                        Extracted Data Fields
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-ink-muted">Tesseract OCR Pipeline</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-caption pt-1">
                    <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Applicant Name:</dt>
                      <dd className="font-bold text-ink text-sm">
                        {extractedData.name ? (
                          <span>{extractedData.name}</span>
                        ) : (
                          <span className="inline-block bg-orange-50 text-[#AF411E] px-2 py-0.5 text-[10px] font-mono font-bold rounded border border-orange-200 uppercase">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>

                    <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Certificate No:</dt>
                      <dd className="font-bold text-ink text-sm font-mono">
                        {extractedData.certificate_number ? (
                          <span>{extractedData.certificate_number}</span>
                        ) : (
                          <span className="inline-block bg-orange-50 text-[#AF411E] px-2 py-0.5 text-[10px] font-mono font-bold rounded border border-orange-200 uppercase">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>

                    <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                      <dt className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Expiry Date:</dt>
                      <dd className="font-bold text-ink text-sm font-mono">
                        {extractedData.expiry_date ? (
                          <span>{extractedData.expiry_date}</span>
                        ) : (
                          <span className="inline-block bg-orange-50 text-[#AF411E] px-2 py-0.5 text-[10px] font-mono font-bold rounded border border-orange-200 uppercase">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation Rule Engine Results */}
          <ValidationResultCard
            results={results}
            overallStatus={overallStatus}
            passedRulesCount={passedCount}
            totalRulesCount={totalCount}
            recommendedNextStep={recommendedNextStep || undefined}
            timestamp={timestamp || undefined}
            isLoading={isLoading}
            error={null}
            onGenerateSlip={documentId && results ? () => setIsCounterSlipOpen(true) : undefined}
          />
        </motion.div>
      </div>

      {/* Pre-Submission Counter Slip Modal */}
      {documentId && results && (
        <CounterSlipModal
          isOpen={isCounterSlipOpen}
          onClose={() => setIsCounterSlipOpen(false)}
          documentId={documentId}
          overallStatus={overallStatus}
          extractedData={extractedData}
          validationResults={results}
          passedCount={passedCount}
          totalCount={totalCount}
          timestamp={timestamp}
          recommendedNextStep={recommendedNextStep}
        />
      )}
    </motion.div>
  );
};

export default CitizenUploadPage;
