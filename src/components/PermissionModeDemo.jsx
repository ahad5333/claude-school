import { useState } from 'react'
import './PermissionModeDemo.css'

// Interactive demo for the Claude Code lesson. Click through the four
// permission modes and see what each one actually gates — read, write,
// execute — plus a short description of when to reach for it.

const MODES = [
  {
    name: 'Plan',
    read: true, write: false, exec: false,
    desc: 'Claude reads and researches your codebase, then hands back a written plan. Nothing changes until you approve it. Use for multi-file refactors or unfamiliar code.'
  },
  {
    name: 'Ask (default)',
    read: true, write: false, exec: false,
    desc: 'Claude reads freely but stops to ask before every file edit and every command. The conservative baseline — full control, most interruptions.'
  },
  {
    name: 'Accept edits',
    read: true, write: true, exec: false,
    desc: 'File edits apply automatically. Commands — tests, installs, git — still pause for your approval. Good once you trust the direction.'
  },
  {
    name: 'Auto',
    read: true, write: true, exec: true,
    desc: 'Claude edits and runs commands without prompting. A classifier screens every action first and blocks anything that escalates scope or looks hostile. Becoming the new default on Pro/Max/Team plans.'
  }
]

function Indicator({ label, icon, on }) {
  return (
    <div className={`pmd-indicator ${on ? 'on' : 'off'}`}>
      <span className="pmd-indicator-icon">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export default function PermissionModeDemo() {
  const [active, setActive] = useState(1) // start on "Ask (default)"
  const mode = MODES[active]

  return (
    <div className="pmd">
      <div className="pmd-header">
        <span className="pmd-tag">Interactive · click through each mode</span>
      </div>

      <div className="pmd-tabs">
        {MODES.map((m, i) => (
          <button
            key={m.name}
            type="button"
            className={`pmd-tab ${i === active ? 'on' : ''}`}
            onClick={() => setActive(i)}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="pmd-panel">
        <div className="pmd-indicators">
          <Indicator label="Read files" icon="◎" on={mode.read} />
          <Indicator label="Write files" icon="✎" on={mode.write} />
          <Indicator label="Run commands" icon="▶" on={mode.exec} />
        </div>
        <p className="pmd-desc">{mode.desc}</p>
      </div>

      <p className="pmd-footnote">
        Cycle between these mid-session with <code>Shift+Tab</code>. Start in Plan for
        unfamiliar code, switch to Accept edits once you trust the direction, drop back to Ask
        for anything sensitive — a migration, a payment file.
      </p>
    </div>
  )
}
