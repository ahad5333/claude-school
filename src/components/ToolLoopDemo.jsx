import { useState } from 'react'
import './ToolLoopDemo.css'

// Interactive demo for the tool-use lesson. The learner clicks through the
// four steps of the loop and watches control pass between "your code" and
// "Claude", with the real data (tool request, args, result) shown at each
// step. Fully client-side — it's a scripted illustration, not a live call.

const STEPS = [
  {
    side: 'you',
    title: 'You send the question + tools',
    detail: 'Your code calls Claude with the user question AND a menu of available tools.',
    payload: `messages: ["What's the weather in Delhi?"]
tools: [ get_weather(city) ]`
  },
  {
    side: 'claude',
    title: 'Claude pauses and asks for a tool',
    detail: 'Claude decides it needs data it does not have. Instead of answering, it stops and requests a tool call. stop_reason becomes "tool_use".',
    payload: `stop_reason: "tool_use"
tool_use: get_weather({ city: "Delhi" })`
  },
  {
    side: 'you',
    title: 'Your code runs the real function',
    detail: 'You execute your actual getWeather() function with the arguments Claude gave you. This is where you hit a real API, database, or calculation.',
    payload: `const result = getWeather("Delhi")
// -> "34°C, sunny"`
  },
  {
    side: 'claude',
    title: 'Claude writes the final answer',
    detail: 'You send the result back as a tool_result message. Claude uses it to write a natural reply — and this time it answers in plain text.',
    payload: `"It's currently 34°C and sunny in Delhi."`
  }
]

export default function ToolLoopDemo() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const atEnd = step === STEPS.length - 1

  return (
    <div className="tl">
      <div className="tl-header">
        <span className="tl-tag">Interactive · step through the loop</span>
        <span className="tl-progress">{step + 1} / {STEPS.length}</span>
      </div>

      {/* Two lanes: your code (left) and Claude (right) */}
      <div className="tl-lanes">
        <div className={`tl-lane ${current.side === 'you' ? 'active' : ''}`}>
          <span className="tl-lane-label">Your code</span>
        </div>
        <div className={`tl-lane ${current.side === 'claude' ? 'active' : ''}`}>
          <span className="tl-lane-label">Claude</span>
        </div>
      </div>

      {/* The step card, aligned to whichever side is acting */}
      <div className={`tl-card tl-card-${current.side}`}>
        <div className="tl-card-head">
          <span className="tl-step-num">Step {step + 1}</span>
          <span className={`tl-side-badge tl-side-${current.side}`}>
            {current.side === 'you' ? 'Your code' : 'Claude'}
          </span>
        </div>
        <h4 className="tl-card-title">{current.title}</h4>
        <p className="tl-card-detail">{current.detail}</p>
        <pre className="tl-payload"><code>{current.payload}</code></pre>
      </div>

      <div className="tl-dots">
        {STEPS.map((_, i) => (
          <span key={i} className={`tl-dot ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`} />
        ))}
      </div>

      <div className="tl-actions">
        {step > 0 && (
          <button className="tl-btn" onClick={() => setStep((s) => s - 1)} type="button">
            ← Back
          </button>
        )}
        {!atEnd ? (
          <button className="tl-btn tl-btn-primary" onClick={() => setStep((s) => s + 1)} type="button">
            Next step →
          </button>
        ) : (
          <button className="tl-btn tl-btn-primary" onClick={() => setStep(0)} type="button">
            Run it again ↺
          </button>
        )}
      </div>

      {atEnd && (
        <p className="tl-footnote">
          That's one full loop. Real agents wrap this in a <code>while</code> loop — Claude can
          request tool after tool (search, then read, then calculate) until it finally answers
          in plain text. That think-act-observe cycle is what an agent <em>is</em>.
        </p>
      )}
    </div>
  )
}
