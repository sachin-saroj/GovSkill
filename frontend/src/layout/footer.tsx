import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, BookOpen, Bot, Award, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-civic-950 text-slate-300 border-t border-civic-900 mt-auto">
      {/* Civic Accent Line (Saffron, White, Green) */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-500 via-white to-emerald-500 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-civic-md bg-civic-800 text-white flex items-center justify-center border border-civic-700">
                <Shield className="h-4 w-4 text-saffron-400" />
              </div>
              <span className="font-semibold text-section-heading text-white tracking-tight">GovSkill</span>
            </div>
            <p className="text-caption text-slate-400 leading-relaxed font-normal">
              Unified digital capability and document pre-verification ecosystem for local government officers, administrative departments, and citizen self-service.
            </p>
            <div className="flex items-center gap-2 text-micro text-slate-400 font-medium">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deterministic Rule Verification Engine</span>
            </div>
          </div>

          {/* Employee Modules */}
          <div className="space-y-3">
            <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-100">
              Employee Training
            </h4>
            <ul className="space-y-2 text-caption font-normal">
              <li>
                <Link to="/progress" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Award className="h-3.5 w-3.5 text-saffron-500" />
                  <span>My Competency Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/module" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <BookOpen className="h-3.5 w-3.5 text-civic-400" />
                  <span>Administrative Curriculum</span>
                </Link>
              </li>
              <li>
                <Link to="/tutor" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Bot className="h-3.5 w-3.5 text-civic-400" />
                  <span>Grounded AI Tutor Assistance</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Award className="h-3.5 w-3.5 text-saffron-500" />
                  <span>Certification Assessments</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Pre-check & Verification */}
          <div className="space-y-3">
            <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-100">
              GovAssist Citizen Hub
            </h4>
            <ul className="space-y-2 text-caption">
              <li>
                <Link to="/citizen" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors">
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Income Certificate Pre-Check</span>
                </Link>
              </li>
              <li className="text-caption text-slate-400 pt-1 leading-relaxed font-normal">
                Pre-submission OCR and 4-rule compliance engine checks format, validity period, issuing authority, and seal clarity before physical submission.
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div className="space-y-3">
            <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-100">
              System Governance
            </h4>
            <div className="bg-civic-900/80 rounded-civic-md p-3 border border-civic-800 text-caption space-y-1.5 font-normal">
              <div className="flex items-center justify-between text-caption font-semibold text-slate-200">
                <span>Rule Execution</span>
                <span className="text-emerald-400">100% Deterministic</span>
              </div>
              <div className="flex items-center justify-between text-caption font-semibold text-slate-200">
                <span>AI Layer Scope</span>
                <span className="text-civic-300">Grounded Explanations</span>
              </div>
              <div className="flex items-center justify-between text-caption font-semibold text-slate-200">
                <span>Citizen Data</span>
                <span className="text-slate-400">Isolated & Transient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-civic-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-caption text-slate-500 font-normal">
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
