import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  componentDidCatch(e, info) { console.error('🔴 REACT ERROR:', e.toString(), info.componentStack) }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 32, fontFamily: 'monospace', background: '#fff1f1', minHeight: '100vh', color: '#c00' }}>
        <h2>⚠️ Erreur détectée</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, marginTop: 12 }}>{String(this.state.error)}</pre>
        <button onClick={() => this.setState({ error: null })} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>Réessayer</button>
      </div>
    )
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
