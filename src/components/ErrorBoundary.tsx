import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    FallbackComponent?: React.ComponentType<{ error: Error }>;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.FallbackComponent) {
                return <this.props.FallbackComponent error={this.state.error} />;
            }
            
            // Default error UI
            return (
                <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
                        <h2 className="text-xl font-semibold text-[#ff4444] mb-4">Something went wrong</h2>
                        <pre className="text-sm text-gray-400 break-words whitespace-pre-wrap">
                            {this.state.error.message}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full btn btn-primary"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
} 