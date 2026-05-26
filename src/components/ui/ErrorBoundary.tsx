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
      const isIndonesian = this.props.lang === 'id';
      const isSpanish = this.props.lang === 'es';
      
      const title = isIndonesian ? 'Terjadi Kesalahan' : isSpanish ? 'Ocurrió un Error' : 'Something went wrong';
      const defaultDesc = isIndonesian 
        ? 'Maaf, komponen ini mengalami masalah saat dimuat. Silakan muat ulang halaman.'
        : isSpanish 
        ? 'Lo sentimos, este componente encontró un problema. Por favor recarga la página.'
        : 'Sorry, this component encountered a problem while loading. Please refresh the page.';
        
      const buttonText = isIndonesian ? 'Muat Ulang' : isSpanish ? 'Recargar' : 'Reload Tool';

      return (
        <div className="w-full rounded-[2.5rem] bg--50 dark:bg--900/30 border-2 border--100 dark:border--800/50 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[300px]">
          <div className="w-16 h-16 bg-white shrink-0 flex items-center justify-center rounded-2xl text-rose-500 shadow-sm border border--100 dark:border--800/50">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-rose-900 font-outfit">{title}</h3>
          <p className="text--700 dark:text--400 max-w-sm">
            {this.props.fallbackMessage || defaultDesc}
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-white/50 rounded-xl text-left w-full overflow-auto max-h-[150px] border border--200 dark:border--800/50">
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
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text--600 dark:text--400 font-bold rounded-xl hover:bg--100 dark:bg--900/40 transition-colors border border--200 dark:border--800/50"
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
