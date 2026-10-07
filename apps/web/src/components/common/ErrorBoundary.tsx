import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
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
    console.error("Zonalyze Uncaught Runtime Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Subtle tactical grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-black pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold font-mono tracking-tight text-white mb-2">
              Telemetry Render Interrupted
            </h2>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected engine or render condition occurred while initializing the map view.
              {this.state.error?.message && (
                <span className="block mt-2 font-mono text-xs text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/40 break-words">
                  {this.state.error.message}
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-cyan-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload View</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = "#home";
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
