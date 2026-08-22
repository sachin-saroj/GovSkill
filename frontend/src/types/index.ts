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

export interface AdminQuizQuestion {
  id: string;
  module_id: string;
  question: string;
  options: string[];
  correct_option_index: number;
}

export interface EmployeeSkillItem {
  module_id: string;
  module_title: string;
  lessons_completed: boolean;
  best_score: number;
  total_questions: number;
  score_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  updated_at: string;
}

export interface EmployeeSkillStatusResponse {
  overall_skill_score: number;
  total_modules: number;
  certified_modules: number;
  skills: EmployeeSkillItem[];
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

export interface AdminSkillOverviewResponse {
  total_employees: number;
  total_certifications: number;
  overall_certification_rate: number;
}

