import { useState } from 'react'
import './MultiAgentDemo.css'

// Interactive demo for the multi-agent lesson. Click "Run task" and watch
// an orchestrator dispatch work to three specialized workers running in
// parallel (staggered completion times, like real API calls would have),
// then combine their results into one final answer. Fully client-side —
// timings are simulated, not real API calls.

const WORKERS = [
  { id: 'research', name: 'Research worker', job: 'Gathers sources', result: 'Found 6 sources on remote work productivity, 3 peer-reviewed.', duration: 1400 },
  { id: 'writer', name: 'Writer worker', job: 'Drafts content', result: 'Drafted a 400-word summary from the research notes.', duration: 2000 },
  { id: 'factcheck', name: 'Fact-check worker', job: 'Verifies claims', result: 'Checked 4 claims — 1 flagged as needing a stronger source.', duration: 1100 }
]

export default function MultiAgentDemo() {
  const [status, setStatus] = useState('idle') // idle | running | combining | done
  const [workerStatus, setWorkerStatus] = useState({}) // id -> 'pending' | 'running' | 'done'

  const run = () => {
    setStatus('running')
    const initial = {}
    WORKERS.forEach((w) => { initial[w.id] = 'running' })
    setWorkerStatus(initial)

    let finished = 0
    WORKERS.forEach((w) => {
      setTimeout(() => {
        setWorkerStatus((prev) => ({ ...prev, [w.id]: 'done' }))
        finished += 1
        if (finished === WORKERS.length) {
          setStatus('combining')
          setTimeout(() => setStatus('done'), 700)
        }
      }, w.duration)
    })
  }

  const reset = () => {
    setStatus('idle')
    setWorkerStatus({})
  }

  return (
    <div className="mad">
      <div className="mad-header">
        <span className="mad-tag">Interactive · orchestrator dispatches to workers</span>
      </div>

      <div className="mad-orchestrator">
        <span className="mad-orch-label">Orchestrator</span>
        <span className="mad-orch-task">Task: "Write a fact-checked summary of remote work productivity research"</span>
      </div>

      <div className="mad-fan">
        {WORKERS.map((w) => {
          const s = workerStatus[w.id] || 'pending'
          return (
            <div key={w.id} className={`mad-worker mad-worker-${s}`}>
              <div className="mad-worker-head">
                <span className="mad-worker-name">{w.name}</span>
                <span className={`mad-worker-status mad-status-${s}`}>
                  {s === 'pending' ? 'waiting' : s === 'running' ? 'working…' : 'done'}
                </span>
              </div>
              <span className="mad-worker-job">{w.job}</span>
              {s === 'done' && <p className="mad-worker-result">{w.result}</p>}
            </div>
          )
        })}
      </div>

      <div className={`mad-combine ${status === 'combining' || status === 'done' ? 'active' : ''}`}>
        <span className="mad-combine-label">Orchestrator combines results</span>
        {status === 'done' && (
          <p className="mad-combine-text">
            Summary drafted from 6 sources, fact-checked with 1 claim flagged for a stronger
            citation before publishing.
          </p>
        )}
      </div>

      <button
        type="button"
        className="mad-run"
        onClick={status === 'idle' || status === 'done' ? (status === 'done' ? reset : run) : undefined}
        disabled={status === 'running' || status === 'combining'}
      >
        {status === 'idle' && 'Run task →'}
        {status === 'running' && 'Workers running in parallel…'}
        {status === 'combining' && 'Combining results…'}
        {status === 'done' && 'Run again ↺'}
      </button>

      {status === 'done' && (
        <p className="mad-footnote">
          Notice the three workers ran at different speeds and finished at different times —
          just like real API calls would. The orchestrator waited for all three before
          combining, the same way <code>Promise.all</code> waits for every parallel call to
          resolve.
        </p>
      )}
    </div>
  )
}
