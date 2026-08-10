import { useState, useEffect } from 'react'
import './LiveApiDemo.css'

// The site's first LIVE demo. It calls the /api/complete endpoint on the
// backend, which forwards to Claude and returns the reply. The API key
// lives only on the server — this component never sees it.
//
// Backend states handled:
//   - not running        -> friendly "start the server" message
//   - running, no key    -> "add your API key" message
//   - running, with key  -> real Claude responses

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Sonnet', note: 'balanced' },
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku', note: 'fast + cheap' }
]

const EXAMPLES = [
  'Explain recursion in one sentence.',
  'Write a haiku about debugging.',
  'What is a REST API, in plain terms?'
]

export default function LiveApiDemo() {
  const [prompt, setPrompt] = useState(EXAMPLES[0])
  const [model, setModel] = useState(MODELS[0].id)
  const [temperature, setTemperature] = useState(1)
  const [response, setResponse] = useState('')
  const [usage, setUsage] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [backend, setBackend] = useState('checking') // checking | ready | nokey | down

  // On mount, check whether the backend is up and has a key.
  useEffect(() => {
    let active = true
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        setBackend(d.hasKey ? 'ready' : 'nokey')
      })
      .catch(() => active && setBackend('down'))
    return () => { active = false }
  }, [])

  const run = async () => {
    if (!prompt.trim()) return
    setStatus('loading')
    setResponse('')
    setUsage(null)
    setErrorMsg('')
    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt, model, temperature })
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
        return
      }
      setResponse(data.text)
      setUsage(data.usage)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not reach the backend. Is it running? (npm run server)')
    }
  }

  const backendBanner = () => {
    if (backend === 'checking') return null
    if (backend === 'ready') {
      return <div className="lad-banner lad-banner-ok">Backend connected — responses below are live from Claude.</div>
    }
    if (backend === 'nokey') {
      return <div className="lad-banner lad-banner-warn">Backend is running but has no API key. Set <code>ANTHROPIC_API_KEY</code> and restart the server.</div>
    }
    return <div className="lad-banner lad-banner-warn">Backend not detected. Run <code>npm run server</code> in a second terminal to enable live responses.</div>
  }

  return (
    <div className="lad">
      <div className="lad-header">
        <span className="lad-tag">Live · calls Claude for real</span>
        <span className="lad-hint">This runs through your backend, not the browser</span>
      </div>

      {backendBanner()}

      <label className="lad-label">Your prompt</label>
      <textarea
        className="lad-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Ask Claude anything…"
      />

      <div className="lad-examples">
        {EXAMPLES.map((ex) => (
          <button key={ex} className="lad-chip" onClick={() => setPrompt(ex)} type="button">
            {ex}
          </button>
        ))}
      </div>

      <div className="lad-controls">
        <div className="lad-control">
          <label className="lad-label">Model</label>
          <div className="lad-models">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`lad-model ${model === m.id ? 'on' : ''}`}
                onClick={() => setModel(m.id)}
              >
                <span className="lad-model-label">{m.label}</span>
                <span className="lad-model-note">{m.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lad-control">
          <label className="lad-label">
            Temperature <span className="lad-temp-val">{temperature.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0" max="1" step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="lad-range"
          />
        </div>
      </div>

      <button
        className="lad-run"
        onClick={run}
        disabled={status === 'loading'}
        type="button"
      >
        {status === 'loading' ? 'Claude is thinking…' : 'Send to Claude →'}
      </button>

      {(response || status === 'error' || status === 'loading') && (
        <div className="lad-output">
          <div className="lad-output-head">
            <span className="lad-output-label">Response</span>
            {usage && (
              <span className="lad-usage">
                {usage.input_tokens} in · {usage.output_tokens} out
              </span>
            )}
          </div>
          <div className="lad-response">
            {status === 'loading' && <span className="lad-loading">Generating…</span>}
            {status === 'error' && <span className="lad-error">{errorMsg}</span>}
            {status === 'done' && response}
          </div>
        </div>
      )}
    </div>
  )
}
