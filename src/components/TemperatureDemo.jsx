import { useState, useEffect } from 'react'
import './TemperatureDemo.css'

// Live demo for the temperature lesson. Sends the SAME prompt at three
// different temperatures at once, so the learner can see how the dial
// changes Claude's output — identical/safe at 0, varied/creative at 1.
// Calls the same /api/complete backend endpoint as the API lesson.

const TEMPS = [
  { value: 0.0, label: '0.0', tag: 'Deterministic', note: 'Same answer every time' },
  { value: 0.7, label: '0.7', tag: 'Balanced', note: 'A little variety' },
  { value: 1.0, label: '1.0', tag: 'Creative', note: 'Most surprising' }
]

const EXAMPLES = [
  'Write a one-line tagline for a coffee shop.',
  'Give me a name for a pet robot.',
  'Describe the ocean in one sentence.'
]

export default function TemperatureDemo() {
  const [prompt, setPrompt] = useState(EXAMPLES[0])
  const [results, setResults] = useState({}) // keyed by temp value
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [backend, setBackend] = useState('checking')

  useEffect(() => {
    let active = true
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => active && setBackend(d.hasKey ? 'ready' : 'nokey'))
      .catch(() => active && setBackend('down'))
    return () => { active = false }
  }, [])

  const run = async () => {
    if (!prompt.trim()) return
    setStatus('loading')
    setResults({})
    setErrorMsg('')

    try {
      // Fire all three requests in parallel — they're independent calls.
      const calls = TEMPS.map((t) =>
        fetch('/api/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            prompt,
            temperature: t.value,
            model: 'claude-haiku-4-5-20251001', // fast + cheap for a 3x call
            maxTokens: 60
          })
        }).then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Request failed')
          return { temp: t.value, text: data.text }
        })
      )

      const settled = await Promise.allSettled(calls)
      const next = {}
      let anyError = null
      settled.forEach((s, i) => {
        const temp = TEMPS[i].value
        if (s.status === 'fulfilled') next[temp] = s.value.text
        else anyError = s.reason?.message || 'Request failed'
      })
      setResults(next)
      if (Object.keys(next).length === 0) {
        setStatus('error')
        setErrorMsg(anyError || 'Could not reach the backend.')
      } else {
        setStatus('done')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not reach the backend. Is it running? (npm run server)')
    }
  }

  const banner = () => {
    if (backend === 'checking') return null
    if (backend === 'ready') return null
    if (backend === 'nokey') {
      return <div className="td-banner">Backend is running but has no API key. Set <code>ANTHROPIC_API_KEY</code> and restart the server to run this live.</div>
    }
    return <div className="td-banner">Backend not detected. Run <code>npm run server</code> in a second terminal to enable this demo.</div>
  }

  return (
    <div className="td">
      <div className="td-header">
        <span className="td-tag">Live · same prompt, three temperatures</span>
        <span className="td-hint">Run it and compare the columns</span>
      </div>

      {banner()}

      <label className="td-label">Your prompt</label>
      <textarea
        className="td-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
      />

      <div className="td-examples">
        {EXAMPLES.map((ex) => (
          <button key={ex} className="td-chip" onClick={() => setPrompt(ex)} type="button">
            {ex}
          </button>
        ))}
      </div>

      <button className="td-run" onClick={run} disabled={status === 'loading'} type="button">
        {status === 'loading' ? 'Running all three…' : 'Send at all three temperatures →'}
      </button>

      {status === 'error' && <p className="td-error">{errorMsg}</p>}

      <div className="td-grid">
        {TEMPS.map((t) => (
          <div key={t.value} className="td-col">
            <div className="td-col-head">
              <span className="td-col-temp">{t.label}</span>
              <span className="td-col-tag">{t.tag}</span>
            </div>
            <p className="td-col-note">{t.note}</p>
            <div className="td-col-body">
              {status === 'loading' && <span className="td-loading">…</span>}
              {status === 'done' && (results[t.value] || <span className="td-loading">—</span>)}
              {status === 'idle' && <span className="td-placeholder">Response appears here</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="td-footnote">
        Run it a few times. At 0.0 the answer barely changes between runs. At 1.0 it
        shifts every time — that's the temperature dial widening the range of tokens
        Claude will pick from.
      </p>
    </div>
  )
}
