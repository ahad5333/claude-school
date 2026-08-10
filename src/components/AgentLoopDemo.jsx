import { useState } from 'react'
import './AgentLoopDemo.css'

// Interactive demo for the agents lesson. Walks through a realistic agent
// run on a multi-part task, click by click. Unlike the single-exchange
// ToolLoopDemo (Lesson 05), this one LOOPS back to Plan after Decide when
// the goal isn't fully met yet — and tracks a running step count + cost
// estimate, making the evaluation ideas (step count, cost per run) visible
// rather than just described.

// A realistic run: two full loop passes before the agent has enough to
// answer. Each entry is one click-stop.
const STEPS = [
  { stage: 'plan', title: 'Plan', detail: 'Goal: "Find the cheapest flight Delhi to Mumbai next Friday, and tell me the baggage allowance." Claude decides its first move.', payload: 'next action: call flight_search(from, to, date)' },
  { stage: 'act', title: 'Act', detail: 'Claude pauses and requests the tool — the same tool_use pause from Lesson 05.', payload: 'flight_search({ from: "DEL", to: "BOM", date: "next Friday" })' },
  { stage: 'observe', title: 'Observe', detail: 'Your code runs the real function and returns the result as a tool_result message.', payload: '4 flights found\ncheapest: IndiGo, 6:40am, ₹3,200' },
  { stage: 'decide', title: 'Decide', detail: 'Claude checks: does this fully answer the goal? It has a price, but not baggage rules — not done yet. Loop back to Plan.', payload: 'goal met? NO — missing baggage info', loop: true },
  { stage: 'plan', title: 'Plan (loop 2)', detail: 'Claude plans its next move to close the remaining gap.', payload: 'next action: call baggage_policy(airline, fare_class)' },
  { stage: 'act', title: 'Act', detail: 'A second tool call — a different tool this time, chosen because it fits the remaining gap.', payload: 'baggage_policy({ airline: "IndiGo", fare_class: "saver" })' },
  { stage: 'observe', title: 'Observe', detail: 'Result comes back and gets appended to the growing messages array.', payload: '1 free checked bag (15kg)\ncabin bag included' },
  { stage: 'decide', title: 'Decide', detail: 'Claude checks again: price and baggage rules are both covered now. Goal met — stop looping.', payload: 'goal met? YES — proceed to final answer' },
  { stage: 'stop', title: 'Stop', detail: 'Claude answers in plain text. stop_reason is no longer "tool_use", so the loop exits.', payload: '"Cheapest option is IndiGo at 6:40am for ₹3,200,\nwith one free 15kg checked bag included."' }
]

const COST_PER_STEP = 0.004 // illustrative per-step cost estimate, in dollars

const STAGE_COLORS = {
  plan: 'plan', act: 'act', observe: 'observe', decide: 'decide', stop: 'stop'
}

export default function AgentLoopDemo() {
  const [i, setI] = useState(0)
  const step = STEPS[i]
  const atEnd = i === STEPS.length - 1
  const stepsSoFar = i + 1
  const costSoFar = (stepsSoFar * COST_PER_STEP).toFixed(3)

  return (
    <div className="ald">
      <div className="ald-header">
        <span className="ald-tag">Interactive · click through a real agent run</span>
        <span className="ald-progress">{i + 1} / {STEPS.length}</span>
      </div>

      <div className="ald-meters">
        <div className="ald-meter">
          <span className="ald-meter-label">Steps so far</span>
          <span className="ald-meter-value">{stepsSoFar}</span>
        </div>
        <div className="ald-meter">
          <span className="ald-meter-label">Estimated cost</span>
          <span className="ald-meter-value">${costSoFar}</span>
        </div>
        <div className="ald-meter">
          <span className="ald-meter-label">Loop passes</span>
          <span className="ald-meter-value">{i < 4 ? 1 : 2}</span>
        </div>
      </div>

      <div className={`ald-card ald-card-${STAGE_COLORS[step.stage]}`}>
        <div className="ald-card-head">
          <span className={`ald-stage-badge ald-stage-${STAGE_COLORS[step.stage]}`}>{step.title}</span>
          {step.loop && <span className="ald-loop-badge">↻ loops back to plan</span>}
        </div>
        <p className="ald-card-detail">{step.detail}</p>
        <pre className="ald-payload"><code>{step.payload}</code></pre>
      </div>

      <div className="ald-dots">
        {STEPS.map((s, idx) => (
          <span
            key={idx}
            className={`ald-dot ald-dot-${STAGE_COLORS[s.stage]} ${idx === i ? 'on' : ''} ${idx < i ? 'done' : ''}`}
          />
        ))}
      </div>

      <div className="ald-actions">
        {i > 0 && (
          <button className="ald-btn" onClick={() => setI((n) => n - 1)} type="button">← Back</button>
        )}
        {!atEnd ? (
          <button className="ald-btn ald-btn-primary" onClick={() => setI((n) => n + 1)} type="button">Next step →</button>
        ) : (
          <button className="ald-btn ald-btn-primary" onClick={() => setI(0)} type="button">Run again ↺</button>
        )}
      </div>

      {atEnd && (
        <p className="ald-footnote">
          This run took <strong>{STEPS.length} steps</strong> across <strong>2 loop passes</strong> for
          roughly <strong>${(STEPS.length * COST_PER_STEP).toFixed(3)}</strong>. In a real eval, you'd track
          these numbers across dozens of test cases — a sudden jump in step count on similar tasks is
          usually a sign the agent is thrashing.
        </p>
      )}
    </div>
  )
}
