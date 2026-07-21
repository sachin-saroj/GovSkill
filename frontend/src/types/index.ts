export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Module {
  id: string;
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface QuizAttempt {
  id?: string;
  user_email: string;
  module_title: string;
  score: number;
  total: number;
  submitted_at?: string;
}

export interface ValidationRuleResult {
  ruleName: string;
  passed: boolean;
  explanation?: string;
}

export interface DocumentUploadResponse {
  document_id: string;
  extracted_data: Record<string, any>;
  validation_results: ValidationRuleResult[];
}
