import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] flex items-center justify-center p-6 md:p-12 bg-[#F5EFE0]"
          data-testid="error-boundary-container"
        >
          <div className="max-w-lg w-full bg-[#FFFFFF] border border-[#D9CFBB] p-8 shadow-sm rounded-none text-center space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAECE8] text-[#B83A24] flex items-center justify-center text-xl font-bold">
              !
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-normal text-[#0A0A0A] tracking-tight">
                {this.props.fallbackTitle || 'An Unexpected Error Occurred'}
              </h2>
              <p className="font-sans text-sm text-[#6B6357] leading-relaxed">
                {this.props.fallbackMessage ||
                  'The application encountered an unexpected issue while rendering this section. Your progress and data are safe.'}
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-[#FBF9F4] border border-[#EBE3D5] text-left text-xs text-[#8A8172] font-mono break-words">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0A0A0A] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider hover:bg-[#262626] transition-colors"
                data-testid="error-boundary-retry-btn"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFFFFF] text-[#0A0A0A] border border-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE0] transition-colors"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 text-[#6B6357] hover:text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
