import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, Variants } from 'framer-motion';
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
  Cpu,
  Layers,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EcosystemVisual from '@/components/landing/EcosystemVisual';
import HeroVisual from '@/components/landing/HeroVisual';
import InteractiveTiltCard from '@/components/landing/InteractiveTiltCard';
import Section3D from '@/components/landing/Section3D';
import { staggerContainerVariants, viewportOnce } from '@/lib/motion';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const heroItemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 280, damping: 24 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper text-slate-900 selection:bg-amber-100 selection:text-ink font-body overflow-x-hidden">
      {/* 1. Immersive Civic 3D Hero Section */}
      <Section3D depth={25} className="bg-gradient-to-b from-ink via-slate-900 to-[#0F172A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Layered Ambient Lighting */}
        <div className="absolute inset-0 bg-civic-dark-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-marigold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          {/* Staggered Hero Header Content */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-5 max-w-4xl mx-auto"
          >
            {/* Top DPI Pill Badge */}
            <motion.div variants={heroItemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-marigold shadow-civic-md backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-marigold animate-pulse" />
                <span>National Digital Public Infrastructure • Local Governance Platform</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={heroItemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display"
            >
              Precision Digital Skills & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-white to-emerald-300 bg-clip-text text-transparent">
                Citizen Document Verification
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={heroItemVariants}
              className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-normal"
            >
              GovSkill empowers local administrative officers with grounded AI curriculum training and server-scored certification, while GovAssist provides citizens with instant self-service pre-submission income certificate verification.
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div
              variants={heroItemVariants}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link to="/citizen">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-civic-lg font-semibold hover:shadow-emerald-600/30 cursor-pointer"
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
                  className="bg-white/10 hover:bg-white/20 text-white border-slate-600 shadow-civic-md font-semibold backdrop-blur-md cursor-pointer"
                  leftIcon={<Shield className="h-5 w-5 text-marigold" />}
                >
                  {user ? 'Go to Officer Workspace' : 'Officer & Supervisor Login'}
                </Button>
              </Link>
            </motion.div>

            {/* Key Trust Pillars Bar */}
            <motion.div
              variants={heroItemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 w-full max-w-4xl text-left"
            >
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-civic-xs backdrop-blur-sm">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">100% Deterministic Rules</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-civic-xs backdrop-blur-sm">
                <Bot className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Grounded Gemini AI Tutor</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-civic-xs backdrop-blur-sm">
                <Award className="h-4 w-4 text-marigold shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Server-Scored Quiz Scoring</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-civic-xs backdrop-blur-sm">
                <LayoutDashboard className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Department Readiness Metrics</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive 3D Hero Visual Showcase */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Section3D>

      {/* 2. Interactive Dynamic Architecture Ecosystem Section */}
      <Section3D depth={30} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F172A] via-ink to-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300">
              <Cpu className="h-3.5 w-3.5 text-marigold" />
              <span>Full System Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Interactive Digital Public Infrastructure
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore how citizen pre-verification connects to deterministic validation rules, grounded AI explanations, and employee competency certification.
            </p>
          </motion.div>

          <EcosystemVisual />
        </div>
      </Section3D>

      {/* 3. Dual Ecosystem 3D Tilt Cards Section */}
      <Section3D depth={20} className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge variant="info" size="md">
              Two Pillars • One Unified Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-display">
              Designed for Public Administration Excellence
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bridging administrative staff capability and citizen self-service through transparent rule verification and grounded artificial intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GovSkill Pillar Card with 3D Tilt */}
            <InteractiveTiltCard
              maxTilt={3.5}
              className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-ink flex items-center justify-center font-bold shadow-civic-xs border border-amber-200/60">
                      <Shield className="h-6 w-6 text-ink" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ink font-display">GovSkill</h3>
                      <p className="text-xs text-slate-500 font-medium">Employee Competency & Training Platform</p>
                    </div>
                  </div>
                  <Badge variant="info">Internal Staff</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Interactive administrative curriculum designed to train desk officers, verification assistants, and supervisors on complex government procedures with guaranteed grounding.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-paper border border-stone-200 hover:border-stone-300 transition-colors">
                    <BookOpen className="h-4 w-4 text-ink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">Structured Administrative Modules</h4>
                      <p className="text-[11px] text-slate-600">Comprehensive guides on document standards, revenue guidelines, and validation protocols.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-paper border border-stone-200 hover:border-stone-300 transition-colors">
                    <Bot className="h-4 w-4 text-ink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">Grounded Gemini AI Tutor</h4>
                      <p className="text-[11px] text-slate-600">Interactive assistance strictly bound to module guidelines with zero speculative hallucination.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-paper border border-stone-200 hover:border-stone-300 transition-colors">
                    <Award className="h-4 w-4 text-marigold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">Server-Scored Certified Quizzes</h4>
                      <p className="text-[11px] text-slate-600">Automated competency evaluation with instant generation of verified skill certificates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">For Officers & Supervisors</span>
                <Link to="/login">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Access Training Portal
                  </Button>
                </Link>
              </div>
            </InteractiveTiltCard>

            {/* GovAssist Pillar Card with 3D Tilt */}
            <InteractiveTiltCard
              maxTilt={3.5}
              className="bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-civic-xs border border-emerald-200/60">
                      <FileCheck className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ink font-display">GovAssist</h3>
                      <p className="text-xs text-slate-500 font-medium">Citizen Pre-Submission Document Checker</p>
                    </div>
                  </div>
                  <Badge variant="success">Citizen Self-Service</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Self-service income certificate validation using OCR extraction and a deterministic 4-rule compliance engine to verify documents before visiting local administrative offices.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                    <FileText className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">Instant OCR Text & Field Extraction</h4>
                      <p className="text-[11px] text-slate-600">Extracts certificate number, issuing officer designation, issuance date, and validity automatically.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                    <Lock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">4-Rule Deterministic Evaluation</h4>
                      <p className="text-[11px] text-slate-600">Verifies document format, issuing authority level, validity timeline, and seal clarity.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                    <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-ink">Plain-Language AI Rule Explanations</h4>
                      <p className="text-[11px] text-slate-600">Translates failed validation rules into clear, actionable citizen guidance for swift correction.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">No Citizen Login Required</span>
                <Link to="/citizen">
                  <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Launch Pre-Check Tool
                  </Button>
                </Link>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>
      </Section3D>

      {/* 4. How the Ecosystem Connects / Workflow Storytelling */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-stone-300 text-xs font-bold text-ink">
              <Layers className="h-3.5 w-3.5 text-marigold" />
              <span>Step-by-Step Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-display">
              How the System Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Four streamlined steps from citizen pre-submission to verified officer qualification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="p-6 rounded-3xl border border-stone-200 bg-paper space-y-3 relative hover:shadow-xl transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-ink font-display">Citizen Pre-Checks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applicant uploads income certificate. OCR and deterministic rules check validity before physical queueing.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="p-6 rounded-3xl border border-stone-200 bg-paper space-y-3 relative hover:shadow-xl transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-ink text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-ink font-display">Officer Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Government employees review administrative procedures and consult the grounded AI tutor for nuanced clarification.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.35, delay: 0.19 }}
              className="p-6 rounded-3xl border border-stone-200 bg-paper space-y-3 relative hover:shadow-xl transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-marigold text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-ink font-display">Certified Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainees take server-evaluated quizzes to verify competency and earn official digital skill credentials.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.35, delay: 0.26 }}
              className="p-6 rounded-3xl border border-stone-200 bg-paper space-y-3 relative hover:shadow-xl transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-ink font-display">Supervisor Oversight</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Department supervisors track employee readiness scorecards, audit histories, and compliance readiness.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Ready to Get Started Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-ink via-slate-900 to-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-civic-dark-pattern opacity-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Ready to Explore GovSkill & GovAssist?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Test citizen pre-verification immediately or sign in with officer demo credentials to experience the training curriculum.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link to="/citizen">
              <Button size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-civic-lg cursor-pointer">
                Test Citizen Tool
              </Button>
            </Link>
            <Link to="/login">
              <Button size="md" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-slate-600 font-semibold shadow-civic-md cursor-pointer">
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
