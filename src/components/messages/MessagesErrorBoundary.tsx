"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MessagesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("MessagesPage error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-300 mb-2 text-lg">Une erreur est survenue</p>
          <p className="text-gray-500 text-sm mb-6 max-w-md text-center">
            Impossible de charger les messages. Rafraîchis la page ou réessaie plus tard.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-3 rounded-full text-white font-bold"
            style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}
          >
            Rafraîchir
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
