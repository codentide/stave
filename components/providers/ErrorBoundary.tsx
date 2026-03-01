'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="text-6xl">⚠️</div>
              <h1 className="text-2xl font-bold text-foreground">Algo salió mal</h1>
              <p className="text-foreground/64 text-center max-w-md">
                {this.state.error?.message || 'Ocurrió un error inesperado'}
              </p>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-foreground/8 text-foreground rounded-md hover:bg-foreground/12 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
