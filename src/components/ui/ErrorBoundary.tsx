import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  lang?: string;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const ERRORS: Record<string, { title: string; desc: string; btn: string }> = {
        en: { title: 'Something went wrong', desc: 'Sorry, this component encountered a problem. Please refresh the page.', btn: 'Reload Tool' },
        id: { title: 'Terjadi Kesalahan', desc: 'Maaf, komponen ini mengalami masalah. Silakan muat ulang halaman.', btn: 'Muat Ulang' },
        es: { title: 'Ocurrió un Error', desc: 'Lo sentimos, este componente encontró un problema. Por favor recarga la página.', btn: 'Recargar' },
      };
      const lang = this.props.lang as string;
      const error = ERRORS[lang] || ERRORS.en;
      const { title, desc: defaultDesc, btn: buttonText } = error;

      return (
        <div className="w-full rounded-3xl bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-100 dark:border-rose-800/50 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[300px]">
          <div className="w-16 h-16 bg-white shrink-0 flex items-center justify-center rounded-2xl text-rose-500 shadow-sm border border-rose-100 dark:border-rose-800/50">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-rose-900 font-outfit">{title}</h3>
          <p className="text-rose-700 dark:text-rose-400 max-w-sm">
            {this.props.fallbackMessage || defaultDesc}
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-white/50 rounded-xl text-left w-full overflow-auto max-h-[150px] border border-rose-200 dark:border-rose-800/50">
              <pre className="text-xs text-rose-900 font-mono">
                {this.state.error.message}
              </pre>
            </div>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:bg-rose-900/40 transition-colors border border-rose-200 dark:border-rose-800/50"
          >
            <RefreshCw size={18} />
            {buttonText}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
