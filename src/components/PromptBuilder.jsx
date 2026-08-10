import { useState } from 'react'
import './PromptBuilder.css'

// Interactive demo for the prompting lesson.
// The learner toggles each of the four prompt parts on/off and watches
// both the assembled prompt and a quality score respond. Fully client-side.

const PARTS = {
  role: {
    label: '1 · Role — who Claude should be',
    desc: 'Assigns expertise. Puts Claude in the right frame before it starts.',
    text: 'You are a senior React developer who values clean, accessible code.',
    color: 'role'
  },
  context: {
    label: '2 · Context — the background it needs',
    desc: "What you're building, constraints, what came before. Removes guesswork.",
    text: "I'm building an e-commerce checkout in React with TypeScript and Tailwind. It must work on mobile.",
    color: 'context'
  },
  task: {
    label: '3 · Task — what you actually want (required)',
    desc: 'The specific action. Be precise: "review for bugs" beats "look at this".',
    text: 'Build a reusable quantity-selector component with plus/minus buttons and a number input.',
    color: 'task'
  },
  format: {
    label: '4 · Format — how the answer should look',
    desc: 'Output shape: JSON, bullet list, code only, max length. Makes results usable.',
    text: 'Output only the component code with TypeScript prop types — no explanation.',
    color: 'format'
  }
}

const ORDER = ['role', 'context', 'task', 'format']

const QUALITY = {
  1: { pct: 25, color: '#ff6a6a', label: 'Vague', tip: 'Just the task works, but Claude has to guess your stack, your constraints, and how you want the answer shaped. You will spend follow-up messages fixing those guesses.' },
  2: { pct: 55, color: '#ffb545', label: 'Okay', tip: 'Adding one more part already sharpens it. Notice how much less Claude has to assume.' },
  3: { pct: 80, color: '#8fd15a', label: 'Good', tip: 'Three parts is the sweet spot for most real work — Claude knows who to be, what you are building, and exactly what to do.' },
  4: { pct: 100, color: '#4fd1c5', label: 'Excellent', tip: 'All four parts. Claude has zero ambiguity: right expertise, full context, precise task, and a defined output shape. This is what a pro prompt looks like.' }
}

export default function PromptBuilder() {
  const [on, setOn] = useState({ role: false, context: false, task: true, format: false })

  const toggle = (part) => {
    if (part === 'task') return // task is always required
    setOn((prev) => ({ ...prev, [part]: !prev[part] }))
  }

  const active = ORDER.filter((p) => on[p])
  const q = QUALITY[active.length] || QUALITY[1]

  return (
    <div className="pbuild">
      <div className="pbuild-header">
        <span className="pbuild-tag">Interactive · build a prompt</span>
        <span className="pbuild-hint">Toggle each part and watch quality climb</span>
      </div>

      <div className="pbuild-toggles">
        {ORDER.map((part) => (
          <button
            key={part}
            className={`pbuild-toggle ${on[part] ? 'on' : ''}`}
            onClick={() => toggle(part)}
            type="button"
          >
            <span className="pbuild-switch" aria-hidden="true" />
            <span className="pbuild-tbody">
              <span className="pbuild-tlabel">{PARTS[part].label}</span>
              <span className="pbuild-tdesc">{PARTS[part].desc}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="pbuild-output">
        <span className="pbuild-output-label">Your prompt</span>
        <div className="pbuild-prompt">
          {active.length === 0
            ? <span className="pbuild-empty">Turn on at least the task…</span>
            : active.map((p) => (
                <span key={p} className={`pbuild-frag frag-${PARTS[p].color}`}>
                  {PARTS[p].text}
                </span>
              ))}
        </div>
      </div>

      <div className="pbuild-quality">
        <span className="pbuild-q-caption">Quality</span>
        <div className="pbuild-q-track">
          <div
            className="pbuild-q-fill"
            style={{ width: `${q.pct}%`, background: q.color }}
          />
        </div>
        <span className="pbuild-q-label" style={{ color: q.color }}>{q.label}</span>
      </div>

      <p className="pbuild-tip">{q.tip}</p>
    </div>
  )
}
