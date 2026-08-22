import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  FileCheck,
  BookOpen,
  Bot,
  Award,
  ArrowRight,
  Lock,
  Sparkles,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EcosystemVisual from '@/components/landing/EcosystemVisual';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-civic-950 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-civic-900">
        {/* Subtle Civic Ambient Backdrop */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-10">
          {/* Top Pill / Badge */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 border border-civic-700 text-xs font-semibold text-saffron-400 shadow-civic-xs">
              <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
              <span>Digital Public Infrastructure • Local Governance Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Precision Digital Skills & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-white to-emerald-300 bg-clip-text text-transparent">
                Citizen Document Verification
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              GovSkill empowers local administrative officers with grounded AI curriculum training and server-scored certification, while GovAssist provides citizens with instant self-service pre-submission income certificate verification.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link to="/citizen">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-civic-md font-semibold"
                  leftIcon={<FileCheck className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Citizen Pre-Check (GovAssist)
                </Button>
              </Link>

              <Link to={user ? (user.role === 'admin' ? '/admin' : '/progress') : '/login'}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-slate-600 shadow-civic-md font-semibold backdrop-blur-sm"
                  leftIcon={<Shield className="h-5 w-5 text-saffron-400" />}
                >
                  {user ? 'Go to Officer Workspace' : 'Officer & Supervisor Login'}
                </Button>
              </Link>
            </div>

            {/* Key Trust Pillars Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 w-full max-w-4xl text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">100% Deterministic Rules</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Bot className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Grounded Gemini AI Tutor</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Award className="h-4 w-4 text-saffron-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Server-Scored Quiz Scoring</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <LayoutDashboard className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Department Readiness Metrics</span>
              </div>
            </div>
          </div>

          {/* Interactive Ecosystem Visual */}
          <div className="pt-4">
            <EcosystemVisual />
          </div>
        </div>
      </section>

      {/* 2. Dual Ecosystem Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="info" size="md">
              Two Pillars • One Unified Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Public Administration Excellence
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bridging administrative staff capability and citizen self-service through transparent rule verification and grounded artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GovSkill Pillar Card */}
            <Card className="border-civic-200/90 shadow-civic-md bg-white flex flex-col justify-between" variant="default">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-civic-100 text-civic-800 flex items-center justify-center font-bold">
                      <Shield className="h-5 w-5 text-civic-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">GovSkill</h3>
                      <p className="text-xs text-slate-500 font-medium">Employee Competency & Training Platform</p>
                    </div>
                  </div>
                  <Badge variant="info">Internal Staff</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Interactive administrative curriculum designed to train desk officers, verification assistants, and supervisors on complex government procedures with guaranteed grounding.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                    <BookOpen className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Structured Administrative Modules</h4>
                      <p className="text-[11px] text-slate-600">Comprehensive guides on document standards, revenue guidelines, and validation protocols.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                    <Bot className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Grounded Gemini AI Tutor</h4>
                      <p className="text-[11px] text-slate-600">Interactive assistance strictly bound to module guidelines with zero speculative hallucination.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                    <Award className="h-4 w-4 text-saffron-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Server-Scored Certified Quizzes</h4>
                      <p className="text-[11px] text-slate-600">Automated competency evaluation with instant generation of verified skill certificates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">For Officers & Supervisors</span>
                <Link to="/login">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Access Training Portal
                  </Button>
                </Link>
              </div>
            </Card>

            {/* GovAssist Pillar Card */}
            <Card className="border-emerald-200/90 shadow-civic-md bg-white flex flex-col justify-between" variant="default">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <FileCheck className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">GovAssist</h3>
                      <p className="text-xs text-slate-500 font-medium">Citizen Pre-Submission Document Checker</p>
                    </div>
                  </div>
                  <Badge variant="success">Citizen Self-Service</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Self-service income certificate validation using OCR extraction and a deterministic 4-rule compliance engine to verify documents before visiting local administrative offices.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <FileText className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Instant OCR Text & Field Extraction</h4>
                      <p className="text-[11px] text-slate-600">Extracts certificate number, issuing officer designation, issuance date, and validity automatically.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <Lock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">4-Rule Deterministic Evaluation</h4>
                      <p className="text-[11px] text-slate-600">Verifies document format, issuing authority level, validity timeline, and seal clarity.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Plain-Language AI Rule Explanations</h4>
                      <p className="text-[11px] text-slate-600">Translates failed validation rules into clear, actionable citizen guidance for swift correction.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">No Citizen Login Required</span>
                <Link to="/citizen">
                  <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Launch Pre-Check Tool
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. How the Ecosystem Connects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How the System Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four streamlined steps from citizen pre-submission to verified officer qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
              <div className="h-8 w-8 rounded-lg bg-civic-800 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Citizen Pre-Checks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applicant uploads income certificate. OCR and deterministic rules check validity before physical queueing.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
              <div className="h-8 w-8 rounded-lg bg-civic-800 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Officer Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Government employees review administrative procedures and consult the grounded AI tutor for nuanced clarification.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
              <div className="h-8 w-8 rounded-lg bg-civic-800 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Certified Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainees take server-evaluated quizzes to verify competency and earn official digital skill credentials.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
              <div className="h-8 w-8 rounded-lg bg-civic-800 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Supervisor Oversight</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Department supervisors track employee readiness scorecards, audit histories, and compliance readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ready to Get Started Call to Action */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-civic-950 via-civic-900 to-civic-950 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Explore GovSkill & GovAssist?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Test citizen pre-verification immediately or sign in with officer demo credentials to experience the training curriculum.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link to="/citizen">
              <Button size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Test Citizen Tool
              </Button>
            </Link>
            <Link to="/login">
              <Button size="md" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-slate-600 font-semibold">
                Officer Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
