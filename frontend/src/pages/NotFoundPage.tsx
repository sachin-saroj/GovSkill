import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, FileCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-paper">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xl">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 text-ink flex items-center justify-center shadow-civic-xs">
          <Shield className="h-8 w-8 text-marigold" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-seal">
            Error 404 • Resource Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display">
            Official Record Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The requested administrative page or service endpoint does not exist or has been relocated within the portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button
              size="md"
              variant="primary"
              leftIcon={<Home className="h-4 w-4" />}
              className="w-full justify-center"
            >
              Portal Home
            </Button>
          </Link>
          <Link to="/citizen" className="w-full sm:w-auto">
            <Button
              size="md"
              variant="outline"
              leftIcon={<FileCheck className="h-4 w-4 text-emerald-700" />}
              className="w-full justify-center"
            >
              GovAssist Pre-Check
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
