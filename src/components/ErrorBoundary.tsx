import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', direction: 'rtl', textAlign: 'center' }}>
          <h2 style={{ color: '#E53E3E' }}>خطایی رخ داد</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#718096', marginTop: 16 }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#A0AEC0', fontSize: 12, marginTop: 8 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
