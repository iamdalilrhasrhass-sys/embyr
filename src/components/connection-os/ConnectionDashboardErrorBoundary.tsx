"use client";

import { Component, type ReactNode } from "react";

interface ConnectionDashboardErrorBoundaryProps {
  children: ReactNode;
}

interface ConnectionDashboardErrorBoundaryState {
  hasError: boolean;
}

export class ConnectionDashboardErrorBoundary extends Component<
  ConnectionDashboardErrorBoundaryProps,
  ConnectionDashboardErrorBoundaryState
> {
  state: ConnectionDashboardErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ConnectionDashboardErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Connection dashboard]", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#06020c] p-6 text-center text-white">
          <div className="max-w-md">
            <span aria-hidden="true" className="text-3xl">
              ◇
            </span>
            <h1 className="mt-4 font-serif text-2xl">
              Embir a besoin d’un instant
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Recharge la page pour reprendre ta sélection sans perdre tes
              connexions.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#d4a574] px-6 py-3 text-sm font-bold text-[#0a0614]"
            >
              Recharger
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
