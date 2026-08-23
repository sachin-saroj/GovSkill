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

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 selection:bg-civic-200 selection:text-civic-900">
      {/* 1. Immersive 3D Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-civic-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Layered Ambient Lighting Backdrops */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          {/* Staggered Hero Header Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-5 max-w-4xl mx-auto"
          >
            {/* Top DPI Pill Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-civic-700/80 text-xs font-semibold text-saffron-400 shadow-civic-md backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-saffron-400 animate-pulse" />
                <span>National Digital Public Infrastructure • Local Governance Platform</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Precision Digital Skills & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-white to-emerald-300 bg-clip-text text-transparent">
                Citizen Document Verification
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-normal"
            >
              GovSkill empowers local administrative officers with grounded AI curriculum training and server-scored certification, while GovAssist provides citizens with instant self-service pre-submission income certificate verification.
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link to="/citizen">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-civic-lg font-semibold hover:shadow-emerald-600/30 transition-all cursor-pointer"
                    leftIcon={<FileCheck className="h-5 w-5" />}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Citizen Pre-Check (GovAssist)
                  </Button>
                </motion.div>
              </Link>

              <Link to={user ? (user.role === 'admin' ? '/admin' : '/progress') : '/login'}>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-slate-600 shadow-civic-md font-semibold backdrop-blur-md transition-all cursor-pointer"
                    leftIcon={<Shield className="h-5 w-5 text-saffron-400" />}
                  >
                    {user ? 'Go to Officer Workspace' : 'Officer & Supervisor Login'}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Key Trust Pillars Bar */}
            <motion.div
              variants={itemVariants}
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
                <Award className="h-4 w-4 text-saffron-400 shrink-0" />
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
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Dynamic Architecture Ecosystem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-900 border border-civic-700 text-xs font-bold text-civic-300">
              <Cpu className="h-3.5 w-3.5 text-civic-400" />
              <span>Full System Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Digital Public Infrastructure
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore how citizen pre-verification connects to deterministic validation rules, grounded AI explanations, and employee competency certification.
            </p>
          </motion.div>

          <EcosystemVisual />
        </div>
      </section>

      {/* 3. Dual Ecosystem 3D Tilt Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <Badge variant="info" size="md">
              Two Pillars • One Unified Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Public Administration Excellence
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bridging administrative staff capability and citizen self-service through transparent rule verification and grounded artificial intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GovSkill Pillar Card with 3D Tilt */}
            <InteractiveTiltCard
              maxTilt={6}
              className="bg-white border border-civic-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-civic-100 text-civic-800 flex items-center justify-center font-bold shadow-civic-xs">
                      <Shield className="h-6 w-6 text-civic-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">GovSkill</h3>
                      <p className="text-xs text-slate-500 font-medium">Employee Competency & Training Platform</p>
                    </div>
                  </div>
                  <Badge variant="info">Internal Staff</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Interactive administrative curriculum designed to train desk officers, verification assistants, and supervisors on complex government procedures with guaranteed grounding.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                    <BookOpen className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Structured Administrative Modules</h4>
                      <p className="text-[11px] text-slate-600">Comprehensive guides on document standards, revenue guidelines, and validation protocols.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                    <Bot className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Grounded Gemini AI Tutor</h4>
                      <p className="text-[11px] text-slate-600">Interactive assistance strictly bound to module guidelines with zero speculative hallucination.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                    <Award className="h-4 w-4 text-saffron-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Server-Scored Certified Quizzes</h4>
                      <p className="text-[11px] text-slate-600">Automated competency evaluation with instant generation of verified skill certificates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
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
              maxTilt={6}
              className="bg-white border border-emerald-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-civic-xs">
                      <FileCheck className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">GovAssist</h3>
                      <p className="text-xs text-slate-500 font-medium">Citizen Pre-Submission Document Checker</p>
                    </div>
                  </div>
                  <Badge variant="success">Citizen Self-Service</Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Self-service income certificate validation using OCR extraction and a deterministic 4-rule compliance engine to verify documents before visiting local administrative offices.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 hover:border-emerald-200 transition-colors">
                    <FileText className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Instant OCR Text & Field Extraction</h4>
                      <p className="text-[11px] text-slate-600">Extracts certificate number, issuing officer designation, issuance date, and validity automatically.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 hover:border-emerald-200 transition-colors">
                    <Lock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">4-Rule Deterministic Evaluation</h4>
                      <p className="text-[11px] text-slate-600">Verifies document format, issuing authority level, validity timeline, and seal clarity.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 hover:border-emerald-200 transition-colors">
                    <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Plain-Language AI Rule Explanations</h4>
                      <p className="text-[11px] text-slate-600">Translates failed validation rules into clear, actionable citizen guidance for swift correction.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
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
      </section>

      {/* 4. How the Ecosystem Connects / Workflow Storytelling */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <Layers className="h-3.5 w-3.5 text-civic-700" />
              <span>Step-by-Step Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How the System Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four streamlined steps from citizen pre-submission to verified officer qualification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-3 relative hover:shadow-civic-lg transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Citizen Pre-Checks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applicant uploads income certificate. OCR and deterministic rules check validity before physical queueing.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-3 relative hover:shadow-civic-lg transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-civic-700 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Officer Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Government employees review administrative procedures and consult the grounded AI tutor for nuanced clarification.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-3 relative hover:shadow-civic-lg transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-saffron-600 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Certified Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainees take server-evaluated quizzes to verify competency and earn official digital skill credentials.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-3 relative hover:shadow-civic-lg transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-civic-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Supervisor Oversight</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Department supervisors track employee readiness scorecards, audit histories, and compliance readiness.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Ready to Get Started Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-civic-950 via-civic-900 to-civic-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Explore GovSkill & GovAssist?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Test citizen pre-verification immediately or sign in with officer demo credentials to experience the training curriculum.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <Link to="/citizen">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              >
                <Button size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-civic-lg cursor-pointer">
                  Test Citizen Tool
                </Button>
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              >
                <Button size="md" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-slate-600 font-semibold shadow-civic-md cursor-pointer">
                  Officer Sign In
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
