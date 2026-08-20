import React, { useState } from 'react';
import api from '@/lib/api';
import { DocumentUploadResponse, ValidationRuleResult } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ValidationResultCard from '@/components/document/ValidationResultCard';
import { FileText, UploadCloud, FileCheck, AlertCircle } from 'lucide-react';

export const CitizenUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ValidationRuleResult[] | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Income Certificate document image or PDF first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post<DocumentUploadResponse>('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(res.data.validation_results);
      setExtractedData(res.data.extracted_data);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail?.error?.message ||
        'Failed to upload and process citizen document.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#E2E6EB] pb-4">
        <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm mb-1">
          <FileCheck className="h-4 w-4" />
          <span>GovAssist Citizen Self-Service Portal</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1A1F2B]">
          Income Certificate Pre-submission Checker
        </h1>
        <p className="text-sm text-[#5A6472] mt-1">
          Upload your Income Certificate before formal submission to catch potential errors (expired dates, unreadable numbers, formatting issues).
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <Card className="space-y-6">
          <h2 className="text-lg font-semibold text-[#1A1F2B]">Upload Income Certificate</h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[#E2E6EB] hover:border-[#1E4D8C] rounded-xl p-6 text-center transition-colors bg-[#F7F9FB]">
              <UploadCloud className="h-10 w-10 text-[#1E4D8C] mx-auto mb-2" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-semibold text-[#1E4D8C] hover:underline block">
                  Choose a file to upload
                </span>
                <span className="text-xs text-[#5A6472] block mt-1">
                  Supports PNG, JPG, or PDF (Max 5MB)
                </span>
                <input
                  id="file-upload"
                  aria-label="Choose a file to upload"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-4 p-2 bg-white rounded-lg border border-[#E2E6EB] text-xs font-medium text-[#1A1F2B] flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4 text-[#1E4D8C]" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !file}>
              {isLoading ? 'Processing Document...' : 'Run Pre-check Validation'}
            </Button>
          </form>

          <div className="text-xs text-[#5A6472] space-y-1 pt-2 border-t border-[#E2E6EB]">
            <p className="font-semibold text-[#1A1F2B]">Pre-check Rules Tested:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Name present check</li>
              <li>Certificate number format check</li>
              <li>Certificate expiry check</li>
              <li>Required fields extraction check</li>
            </ul>
          </div>
        </Card>

        {/* Validation Results Display */}
        <div className="space-y-6">
          {extractedData && Object.keys(extractedData).length > 0 && (
            <Card className="bg-[#F7F9FB] border-[#E2E6EB]">
              <h3 className="text-sm font-semibold text-[#1A1F2B] mb-2">Extracted Data Fields</h3>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-[#5A6472]">Applicant Name:</dt>
                  <dd className="font-medium text-[#1A1F2B]">
                    {extractedData.name || <span className="inline-block bg-[#C0392B]/10 text-[#C0392B] px-2 py-0.5 rounded text-[10px] font-bold">Not detected</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#5A6472]">Certificate No:</dt>
                  <dd className="font-medium text-[#1A1F2B]">
                    {extractedData.certificate_number || <span className="inline-block bg-[#C0392B]/10 text-[#C0392B] px-2 py-0.5 rounded text-[10px] font-bold">Not detected</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#5A6472]">Expiry Date:</dt>
                  <dd className="font-medium text-[#1A1F2B]">
                    {extractedData.expiry_date || <span className="inline-block bg-[#C0392B]/10 text-[#C0392B] px-2 py-0.5 rounded text-[10px] font-bold">Not detected</span>}
                  </dd>
                </div>
              </dl>
            </Card>
          )}

          <ValidationResultCard results={results} isLoading={isLoading} error={null} />
        </div>
      </div>
    </div>
  );
};
export default CitizenUploadPage;
