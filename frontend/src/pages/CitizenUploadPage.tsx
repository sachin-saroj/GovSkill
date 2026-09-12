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
  FileCheck,
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
      className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Civic Header Banner with Museum Editorial Passe-partout Frame */}
      <motion.div variants={fadeUpVariants}>
        <div className="relative overflow-hidden bg-[#EDE4D0] rounded-2xl border border-[#D9CFBB] p-6 sm:p-8 space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#C9A24A]" />
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9CFBB] pt-1">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-full bg-[#F5EFE0] text-[#0A0A0A] border border-[#D9CFBB] flex items-center justify-center font-semibold">
                <FileCheck className="h-5 w-5 text-[#2A5B4A]" />
              </span>
              <div>
                <span className="font-mono text-micro uppercase tracking-widest text-[#6B6357] block">
                  GovAssist Citizen Self-Service
                </span>
                <span className="text-caption text-[#6B6357] font-medium">
                  Official Revenue & Taluk Document Verification Protocol
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" dot>
                100% Deterministic Engine
              </Badge>
              <Badge variant="info" size="sm">
                Zero Login Required
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-page-title font-normal text-[#0A0A0A] tracking-tight">
              Income Certificate Pre-submission Checker
            </h1>
            <p className="text-body text-[#6B6357] max-w-3xl leading-relaxed font-normal">
              Upload your Income Certificate before formal submission to catch potential errors (expired dates, unreadable numbers, formatting issues).
            </p>
          </div>

          {/* Factual Disclaimer Strip */}
          <div className="p-3.5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] text-caption text-[#6B6357] flex items-start gap-2.5 font-normal">
            <Info className="h-4 w-4 text-[#C9A24A] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#0A0A0A]">Notice:</strong> This self-service pre-check validates standard document readability and format rules prior to your Taluk office visit. It does not replace formal verification by competent revenue authorities.
            </p>
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
            className="p-4 rounded-xl bg-[#C97B5A]/10 border border-[#C97B5A]/30 text-caption text-[#C97B5A] flex items-start justify-between gap-2.5"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#C97B5A] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-[#0A0A0A]">Verification Notice</p>
                <p className="leading-relaxed font-normal text-[#6B6357]">{error}</p>
              </div>
            </div>
            {file && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUpload}
                className="text-caption shrink-0 rounded-full border-[#D9CFBB] bg-[#F5EFE0] hover:bg-[#EDE4D0] text-[#0A0A0A]"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                <span>Retry</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <motion.div variants={fadeUpVariants} className="flex border-b border-[#D9CFBB] gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`pb-3.5 text-caption font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-[#6B6357] hover:text-[#0A0A0A] hover:border-[#D9CFBB]'
          }`}
        >
          <UploadCloud className="h-4 w-4 text-[#2A5B4A]" />
          <span>Upload Document</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lookup')}
          className={`pb-3.5 text-caption font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'lookup'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-[#6B6357] hover:text-[#0A0A0A] hover:border-[#D9CFBB]'
          }`}
        >
          <Search className="h-4 w-4 text-[#2A5B4A]" />
          <span>Lookup by Reference ID</span>
        </button>
      </motion.div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload or Lookup Form (5 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-5 space-y-6">
          {activeTab === 'upload' ? (
            <Card className="space-y-6 bg-[#EDE4D0] border-[#D9CFBB] rounded-2xl p-6 sm:p-8">
              <div className="pb-3 border-b border-[#D9CFBB]">
                <h2 className="font-serif text-section-heading font-normal text-[#0A0A0A] tracking-tight">
                  Upload Income Certificate
                </h2>
                <p className="text-caption text-[#6B6357] mt-0.5 font-normal">
                  Digital scan, photograph, or PDF file
                </p>
              </div>

              {/* 4-Stage Processing Pipeline Visual */}
              <div className="bg-[#F5EFE0] p-3.5 rounded-xl border border-[#D9CFBB] space-y-2">
                <div className="flex items-center justify-between text-micro font-semibold uppercase tracking-wider text-[#6B6357]">
                  <span>Verification Pipeline</span>
                  <span className="text-[#2A5B4A] font-mono">4 Automated Stages</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-micro font-semibold">
                  <div className={`p-1.5 rounded-lg border transition-colors ${file ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30' : 'bg-[#EDE4D0] text-[#6B6357] border-[#D9CFBB]'}`}>
                    1. Select
                  </div>
                  <div className={`p-1.5 rounded-lg border transition-colors ${isLoading ? 'bg-[#C9A24A]/20 text-[#0A0A0A] border-[#C9A24A] animate-pulse' : results ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30' : 'bg-[#EDE4D0] text-[#6B6357] border-[#D9CFBB]'}`}>
                    2. OCR
                  </div>
                  <div className={`p-1.5 rounded-lg border transition-colors ${results ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30' : 'bg-[#EDE4D0] text-[#6B6357] border-[#D9CFBB]'}`}>
                    3. Rules
                  </div>
                  <div className={`p-1.5 rounded-lg border transition-colors ${results ? 'bg-[#0A0A0A] text-[#F5EFE0] border-[#0A0A0A]' : 'bg-[#EDE4D0] text-[#6B6357] border-[#D9CFBB]'}`}>
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
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
                    isLoading
                      ? 'border-[#D9CFBB] bg-[#EDE4D0]/40 cursor-not-allowed opacity-60'
                      : isDragging
                      ? 'border-[#C9A24A] bg-[#EDE4D0] ring-4 ring-[#C9A24A]/20 scale-[1.01]'
                      : file
                      ? 'border-[#2A5B4A]/40 bg-[#2A5B4A]/5'
                      : 'border-[#D9CFBB] bg-[#F5EFE0] hover:border-[#0A0A0A]/40 hover:bg-[#EDE4D0]/50'
                  }`}
                >
                  {!file && (
                    <div className="w-32 h-32 mx-auto mb-3 rounded-xl overflow-hidden border border-[#D9CFBB] bg-[#EDE4D0] flex items-center justify-center">
                      <img
                        src="/illustrations/govassist_upload_illustration.jpg"
                        alt="Document Verification"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}

                  <label
                    htmlFor="file-upload"
                    className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                  >
                    <span
                      className={`text-caption font-bold block ${
                        isLoading
                          ? 'text-[#6B6357]/60 no-underline'
                          : 'text-[#0A0A0A] hover:underline'
                      }`}
                    >
                      Choose an Income Certificate to pre-check
                    </span>
                    <span className="text-[11px] text-[#6B6357] block mt-1 font-mono">
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
                        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                        className="mt-4 p-3.5 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] text-caption font-semibold text-[#0A0A0A] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {previewUrl ? (
                              <ImageIcon className="h-4 w-4 text-[#2A5B4A] shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-[#2A5B4A] shrink-0" />
                            )}
                            <span className="truncate max-w-[200px] font-mono text-caption">{file.name}</span>
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
                            className="text-[#6B6357] hover:text-[#C97B5A] p-1 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {previewUrl && (
                          <div className="pt-2 border-t border-[#D9CFBB] flex justify-center">
                            <img
                              src={previewUrl}
                              alt="Document Preview"
                              className="max-h-36 rounded-lg object-contain border border-[#D9CFBB]"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isLoading && processingStage && (
                  <div className="p-3.5 rounded-full bg-[#F5EFE0] border border-[#D9CFBB] text-caption text-[#0A0A0A] flex items-center gap-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-[#2A5B4A] shrink-0" />
                    <span className="font-medium">{processingStage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold cursor-pointer rounded-full min-h-[44px]"
                  size="md"
                  disabled={isLoading || !file}
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isLoading ? 'Processing Document...' : 'Run Pre-check Validation'}
                </Button>
              </form>

              {/* Pre-check Rules Tested Guide */}
              <div className="text-caption text-[#6B6357] space-y-2 pt-4 border-t border-[#D9CFBB] font-normal">
                <div className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wider text-[#0A0A0A]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2A5B4A]" />
                  <span>Pre-check Compliance Rules:</span>
                </div>
                <ul className="grid grid-cols-1 gap-1.5 pl-1 text-caption">
                  <li className="flex items-center gap-2 text-[#6B6357]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
                    <span><strong className="font-semibold text-[#0A0A0A]">Name present:</strong> Verifies applicant name is clearly readable.</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#6B6357]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
                    <span><strong className="font-semibold text-[#0A0A0A]">Certificate number:</strong> Verifies alphanumeric format (≥6 chars).</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#6B6357]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
                    <span><strong className="font-semibold text-[#0A0A0A]">Expiry check:</strong> Confirms certificate date is not expired.</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#6B6357]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
                    <span><strong className="font-semibold text-[#0A0A0A]">Mandatory extraction:</strong> Confirms all required fields are intact.</span>
                  </li>
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="space-y-6 bg-[#EDE4D0] border-[#D9CFBB] rounded-2xl p-6 sm:p-8">
              <div className="pb-3 border-b border-[#D9CFBB]">
                <h2 className="font-serif text-section-heading font-normal text-[#0A0A0A] tracking-tight">
                  Lookup Previous Pre-check
                </h2>
                <p className="text-caption text-[#6B6357] mt-0.5 font-normal">
                  Retrieve existing document OCR & validation report
                </p>
              </div>

              <p className="text-body text-[#6B6357] leading-relaxed font-normal">
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
                  leftIcon={<Search className="h-4 w-4 text-[#6B6357]" />}
                  className="rounded-full min-h-[44px]"
                />

                <Button
                  type="submit"
                  className="w-full font-semibold cursor-pointer rounded-full min-h-[44px]"
                  size="md"
                  disabled={isLoading || !lookupId.trim()}
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isLoading ? 'Retrieving Document...' : 'Lookup Reference ID'}
                </Button>
              </form>

              <div className="p-3.5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] text-caption text-[#6B6357] flex items-start gap-2 font-normal">
                <Info className="h-4 w-4 text-[#C9A24A] shrink-0 mt-0.5" />
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
                className="w-full py-2.5 px-4 rounded-full border border-[#D9CFBB] bg-[#F5EFE0] hover:bg-[#EDE4D0] text-[#0A0A0A] font-semibold text-caption transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#6B6357]" />
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
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-[#EDE4D0] border-[#D9CFBB] p-4 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-[#0A0A0A] text-[#C9A24A] flex items-center justify-center shrink-0">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-micro font-semibold uppercase tracking-wider text-[#6B6357] block">
                          Document Reference ID:
                        </span>
                        <span className="font-mono text-caption font-semibold text-[#0A0A0A] truncate block">
                          {documentId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCounterSlipOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-caption font-semibold text-[#0A0A0A] bg-[#F5EFE0] border border-[#D9CFBB] hover:bg-[#EDE4D0] rounded-full shrink-0 transition-colors cursor-pointer"
                        title="Generate Official Pre-Submission Counter Slip"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 text-[#2A5B4A]" />
                        <span>Pre-submission Counter Slip</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-caption font-semibold text-[#0A0A0A] bg-[#F5EFE0] border border-[#D9CFBB] rounded-full hover:bg-[#EDE4D0] shrink-0 transition-colors cursor-pointer"
                      >
                        {copiedId ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#2A5B4A]" />
                            <span className="text-[#2A5B4A] font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-[#6B6357]" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
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
                <Card className="bg-[#EDE4D0] border-[#D9CFBB] p-6 space-y-3.5 rounded-2xl">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#D9CFBB]">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[#2A5B4A]" />
                      <h3 className="font-serif text-section-heading font-normal text-[#0A0A0A]">Extracted Data Fields</h3>
                    </div>
                    <span className="text-caption font-mono text-[#6B6357]">Tesseract OCR Pipeline</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-caption pt-1">
                    <div className="p-3.5 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] space-y-1">
                      <dt className="text-[#6B6357] font-normal">Applicant Name:</dt>
                      <dd className="font-semibold text-[#0A0A0A] text-caption">
                        {extractedData.name ? (
                          <span>{extractedData.name}</span>
                        ) : (
                          <span className="inline-block bg-[#C97B5A]/10 text-[#C97B5A] px-2 py-0.5 rounded-full text-micro font-semibold border border-[#C97B5A]/30">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>

                    <div className="p-3.5 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] space-y-1">
                      <dt className="text-[#6B6357] font-normal">Certificate No:</dt>
                      <dd className="font-semibold text-[#0A0A0A] text-caption font-mono">
                        {extractedData.certificate_number ? (
                          <span>{extractedData.certificate_number}</span>
                        ) : (
                          <span className="inline-block bg-[#C97B5A]/10 text-[#C97B5A] px-2 py-0.5 rounded-full text-micro font-semibold border border-[#C97B5A]/30">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>

                    <div className="p-3.5 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] space-y-1">
                      <dt className="text-[#6B6357] font-normal">Expiry Date:</dt>
                      <dd className="font-semibold text-[#0A0A0A] text-caption font-mono">
                        {extractedData.expiry_date ? (
                          <span>{extractedData.expiry_date}</span>
                        ) : (
                          <span className="inline-block bg-[#C97B5A]/10 text-[#C97B5A] px-2 py-0.5 rounded-full text-micro font-semibold border border-[#C97B5A]/30">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </Card>
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
