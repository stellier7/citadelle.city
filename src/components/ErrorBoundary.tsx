import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ Something went wrong</h1>
            <div className="bg-zinc-900 border border-red-500 rounded-lg p-6 mb-4">
              <h2 className="text-xl font-bold mb-2">Error:</h2>
              <pre className="text-red-400 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
            </div>
            {this.state.errorInfo && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2">Stack Trace:</h2>
                <pre className="text-gray-400 text-sm whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
