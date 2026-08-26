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
      className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Top Civic Header Banner */}
      <motion.div variants={fadeUpVariants}>
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-civic-md p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-civic-xs">
                <FileCheck className="h-5 w-5 text-emerald-700" />
              </span>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                  GovAssist Citizen Self-Service Portal
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
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

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Income Certificate Pre-submission Checker
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Upload your Income Certificate before formal submission to catch potential errors (expired dates, unreadable numbers, formatting issues).
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
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start justify-between gap-2.5 shadow-civic-xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Verification Notice</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
            {file && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUpload}
                className="text-xs shrink-0"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                <span>Retry</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Tab Navigation */}
      <motion.div variants={fadeUpVariants} className="flex border-b border-slate-200 gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'border-civic-800 text-civic-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <UploadCloud className="h-4 w-4 text-civic-700" />
          <span>Upload Document</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lookup')}
          className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'lookup'
              ? 'border-civic-800 text-civic-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Search className="h-4 w-4 text-civic-700" />
          <span>Lookup by Reference ID</span>
        </button>
      </motion.div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload or Lookup Form (5 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-5 space-y-6">
          {activeTab === 'upload' ? (
            <Card className="space-y-6 bg-white shadow-civic-md border-slate-200 rounded-3xl" variant="elevated">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Upload Income Certificate
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Digital scan, photograph, or PDF file
                </p>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                {/* Drag and Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all duration-200 ${
                    isLoading
                      ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                      : isDragging
                      ? 'border-civic-700 bg-civic-50 ring-4 ring-civic-200/50 scale-[1.01]'
                      : file
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-300 bg-slate-50/70 hover:border-civic-700 hover:bg-white'
                  }`}
                >
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-civic-xs text-civic-700 mx-auto mb-3 flex items-center justify-center border border-slate-200">
                    <UploadCloud className="h-6 w-6 text-civic-700" />
                  </div>

                  <label
                    htmlFor="file-upload"
                    className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                  >
                    <span
                      className={`text-sm font-bold block ${
                        isLoading
                          ? 'text-slate-400 no-underline'
                          : 'text-civic-800 hover:text-civic-900 hover:underline'
                      }`}
                    >
                      Choose a file to upload
                    </span>
                    <span className="text-xs text-slate-500 block mt-1.5 font-medium">
                      Supports PNG, JPG, or PDF (Max 5MB)
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
                        className="mt-4 p-3 bg-white rounded-2xl border border-emerald-200 text-xs font-semibold text-slate-900 space-y-2 shadow-civic-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {previewUrl ? (
                              <ImageIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                            )}
                            <span className="truncate max-w-[200px]">{file.name}</span>
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
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {previewUrl && (
                          <div className="pt-2 border-t border-slate-100 flex justify-center">
                            <img
                              src={previewUrl}
                              alt="Document Preview"
                              className="max-h-36 rounded-lg object-contain border border-slate-200 shadow-civic-xs"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isLoading && processingStage && (
                  <div className="p-3.5 rounded-2xl bg-civic-50 border border-civic-200 text-xs text-civic-900 flex items-center gap-2.5 shadow-civic-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-civic-700 shrink-0" />
                    <span className="font-medium">{processingStage}</span>
                  </div>
                )}

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                >
                  <Button
                    type="submit"
                    className="w-full font-semibold shadow-civic-sm cursor-pointer"
                    size="lg"
                    disabled={isLoading || !file}
                    isLoading={isLoading}
                    variant="primary"
                  >
                    {isLoading ? 'Processing Document...' : 'Run Pre-check Validation'}
                  </Button>
                </motion.div>
              </form>


              {/* Pre-check Rules Tested Guide */}
              <div className="text-xs text-slate-600 space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-civic-700" />
                  <span>Pre-check Compliance Rules:</span>
                </div>
                <ul className="grid grid-cols-1 gap-1.5 pl-1 text-[11px]">
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-civic-700" />
                    <span><strong>Name present:</strong> Verifies applicant name is clearly readable.</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-civic-700" />
                    <span><strong>Certificate number:</strong> Verifies alphanumeric format (≥6 chars).</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-civic-700" />
                    <span><strong>Expiry check:</strong> Confirms certificate date is not expired.</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-civic-700" />
                    <span><strong>Mandatory extraction:</strong> Confirms all required fields are intact.</span>
                  </li>
                </ul>
              </div>            </Card>
          ) : (
            <Card className="space-y-6 bg-white shadow-civic-md border-slate-200 rounded-3xl" variant="elevated">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Lookup Previous Pre-check
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Retrieve existing document OCR & validation report
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
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
                  leftIcon={<Search className="h-4 w-4" />}
                />

                <motion.div

                  whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                >
                  <Button
                    type="submit"
                    className="w-full font-semibold shadow-civic-sm cursor-pointer"
                    size="lg"
                    disabled={isLoading || !lookupId.trim()}
                    isLoading={isLoading}
                    variant="primary"
                  >
                    {isLoading ? 'Retrieving Document...' : 'Lookup Reference ID'}
                  </Button>
                </motion.div>
              </form>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2 shadow-civic-xs">
                <Info className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
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
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-civic-700 text-slate-700 hover:text-civic-900 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-civic-xs cursor-pointer active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5 text-civic-700" />
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
                <Card className="bg-civic-50/70 border-civic-200 p-4 shadow-civic-xs rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-civic-800 text-white flex items-center justify-center shrink-0 shadow-civic-xs">
                        <Tag className="h-4 w-4 text-saffron-400" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-civic-900 block">
                          Document Reference ID:
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-800 truncate block">
                          {documentId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        onClick={() => setIsCounterSlipOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-civic-900 bg-white border border-civic-300 hover:border-civic-700 rounded-xl hover:bg-slate-50 shrink-0 transition-colors shadow-civic-xs cursor-pointer"
                        title="Generate Official Pre-Submission Counter Slip"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 text-civic-700" />
                        <span>Pre-submission Counter Slip</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        onClick={handleCopyId}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-civic-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shrink-0 transition-colors shadow-civic-xs cursor-pointer"
                      >
                        {copiedId ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </motion.button>
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
                <Card className="bg-white border-slate-200 p-5 sm:p-6 shadow-civic-sm space-y-3.5 rounded-3xl">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-civic-700" />
                      <h3 className="text-sm font-bold text-slate-900">Extracted Data Fields</h3>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">Tesseract OCR Pipeline</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { y: -2 }}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 transition-all"
                    >
                      <dt className="text-slate-500 font-medium">Applicant Name:</dt>
                      <dd className="font-bold text-slate-900 text-sm">
                        {extractedData.name ? (
                          <span>{extractedData.name}</span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </motion.div>

                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { y: -2 }}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 transition-all"
                    >
                      <dt className="text-slate-500 font-medium">Certificate No:</dt>
                      <dd className="font-bold text-slate-900 text-sm font-mono">
                        {extractedData.certificate_number ? (
                          <span>{extractedData.certificate_number}</span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </motion.div>

                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { y: -2 }}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 transition-all"
                    >
                      <dt className="text-slate-500 font-medium">Expiry Date:</dt>
                      <dd className="font-bold text-slate-900 text-sm font-mono">
                        {extractedData.expiry_date ? (
                          <span>{extractedData.expiry_date}</span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Not detected
                          </span>
                        )}
                      </dd>
                    </motion.div>
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
