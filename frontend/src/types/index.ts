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
  competency?: string;
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
  competency?: string;
}

export interface CompetencyScoreItem {
  competency: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}

export interface QuizSubmitResponse {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  attempt_number: number;
  best_score: number;
  status: string;
  competency_breakdown: CompetencyScoreItem[];
  strengths: string[];
  weak_areas: string[];
  recommended_action: string;
  submitted_at: string;
}

export interface EmployeeSkillItem {
  module_id: string;
  module_title: string;
  lessons_completed: boolean;
  best_score: number;
  total_questions: number;
  score_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  readiness_state?: 'Not Started' | 'In Progress' | 'Assessment Pending' | 'Needs Improvement' | 'Operational' | 'Certified' | string;
  updated_at: string;
  proficiency?: 'Strong' | 'Developing' | 'Needs Attention' | 'Not Started';
  attempts_count?: number;
  initial_score?: number | null;
  score_improvement_delta?: number | null;
  last_activity_at?: string;
  last_accessed_section?: number;
  started_at?: string;
  completed_at?: string;
}

export interface CompetencySummary {
  overall_score: number;
  modules_completed: number;
  certified_modules: number;
  total_modules: number;
  modules_remaining: number;
  learning_status: string;
  readiness_level: string;
  strongest_competency?: string | null;
  weakest_competency?: string | null;
  average_assessment_score?: number;
  readiness_criteria?: string[];
  readiness_explanation?: string;
}

export interface SkillGapItem {
  module_id: string;
  skill: string;
  proficiency: 'Needs Attention' | 'Developing' | string;
  current_score_pct: number;
  target_threshold?: number;
  gap_percentage?: number;
  evidence: string;
  recommended_action: string;
}

export interface NextActionRecommendation {
  action_type: 'read_lesson' | 'take_quiz' | 'retake_quiz' | 'start_training' | 'all_certified' | string;
  module_id?: string | null;
  module_title?: string | null;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | string;
  link: string;
}

export interface AssessmentHistoryItem {
  attempt_id: string;
  module_id: string;
  module_title: string;
  score: number;
  total: number;
  score_percentage: number;
  attempt_number: number;
  passed: boolean;
  improvement_from_previous?: number | null;
  submitted_at: string;
}

export interface LearningActivityItem {
  activity_type: 'certification' | 'quiz_attempt' | 'quiz_improved' | 'lesson_completed' | 'lesson_started' | string;
  title: string;
  module_title: string;
  timestamp: string;
  detail: string;
}

export interface EmployeeSkillStatusResponse {
  overall_skill_score: number;
  total_modules: number;
  certified_modules: number;
  skills: EmployeeSkillItem[];
  summary: CompetencySummary;
  skill_gaps: SkillGapItem[];
  recommended_action: NextActionRecommendation;
  assessment_history: AssessmentHistoryItem[];
  recent_activity: LearningActivityItem[];
}

export interface ValidationRuleResult {
  ruleName: string;
  passed: boolean;
  field?: string;
  reason?: string;
  severity?: 'critical' | 'warning' | 'info';
  recommended_action?: string;
  explanation?: string;
}

export interface DocumentUploadResponse {
  document_id: string;
  overall_status?: 'PASSED' | 'ACTION_REQUIRED' | string;
  extracted_data: Record<string, any>;
  validation_results: ValidationRuleResult[];
  passed_rules_count?: number;
  total_rules_count?: number;
  timestamp?: string;
  recommended_next_step?: string;
}

export interface AdminSkillOverviewResponse {
  total_employees: number;
  total_certifications: number;
  overall_certification_rate: number;
  total_modules: number;
  total_quiz_attempts: number;
  average_quiz_score_pct: number;
}

export interface TutorAskResponse {
  answer: string;
  matched_module_id?: string | null;
  matched_module_title: string;
  grounding_status: 'grounded' | 'insufficient_context' | 'fallback';
  suggested_followups?: string[];
  source_sections?: string[];
  mode?: string;
}


