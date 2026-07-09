import { Component } from "react";
import { reportError } from "../../services/errorReporter";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    reportError('ErrorBoundary', error, { componentStack: errorInfo?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-bg dark:bg-dark-bg">
          <div className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-2">
            Something went wrong
          </div>
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6 max-w-[400px]">
            An unexpected error occurred. Please try refreshing the page.
          </div>
          <button
            className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
