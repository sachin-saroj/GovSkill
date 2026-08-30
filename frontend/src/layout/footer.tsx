import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, BookOpen, Bot, Award, Lock, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-slate-300 border-t border-slate-800 mt-auto font-body">
      {/* Civic Accent Line (Saffron/Marigold, White, Green) */}
      <div className="h-1 w-full bg-gradient-to-r from-marigold via-white to-emerald-500 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-700">
                <Shield className="h-4 w-4 text-marigold" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight font-display">GovSkill</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified digital capability and document pre-verification ecosystem for local government officers, administrative departments, and citizen self-service.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deterministic Rule Verification Engine</span>
            </div>
          </div>

          {/* Employee Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
              Employee Training
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/progress" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Award className="h-3.5 w-3.5 text-marigold" />
                  <span>My Competency Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/module" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  <span>Administrative Curriculum</span>
                </Link>
              </li>
              <li>
                <Link to="/tutor" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Bot className="h-3.5 w-3.5 text-blue-400" />
                  <span>Grounded AI Tutor Assistance</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Award className="h-3.5 w-3.5 text-marigold" />
                  <span>Certification Assessments</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Pre-check & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
              GovAssist Citizen Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors">
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Income Certificate Pre-Check</span>
                </Link>
              </li>
              <li className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Pre-submission OCR and 4-rule compliance engine checks format, validity period, issuing authority, and seal clarity before physical submission.
              </li>
            </ul>
          </div>

          {/* Standards & Transparency & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
              Civic Support & Governance
            </h4>
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span>Rule Engine</span>
                <span className="text-emerald-400">100% Deterministic</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span>AI Grounding</span>
                <span className="text-blue-300">Gemini 2.5 Flash</span>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                <a
                  href="mailto:support@govskill.gov.in"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-marigold shrink-0" />
                  <span>support@govskill.gov.in</span>
                </a>
                <a
                  href="tel:1800110022"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Toll-Free: 1800-110-022</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {currentYear} GovSkill Initiative • Local Administration Digital Services Platform</p>
          <p className="flex items-center gap-3">
            <span>Confidential & Secure Local Governance Stack</span>
            <span>•</span>
            <span className="text-slate-400">Designed for Public Service Excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
