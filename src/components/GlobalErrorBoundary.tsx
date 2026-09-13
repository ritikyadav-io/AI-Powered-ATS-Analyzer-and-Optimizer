import React, { Component, ErrorInfo, ReactNode } from "react";
import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error caught by GlobalErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6 rounded-2xl border border-border/80 bg-card p-8 shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ElevateCv encountered an unexpected error while loading. Click below to reload the application.
              </p>
            </div>
            {this.state.error?.message && (
              <pre className="max-h-32 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-destructive text-left leading-relaxed">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-2.5 text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
