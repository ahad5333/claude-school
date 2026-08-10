import { useState } from 'react'
import './TokenPredictor.css'

// A self-contained interactive demo: shows how a model builds a sentence
// one token at a time by predicting the most likely next word.
// This version uses pre-scripted probabilities so it runs with zero backend.
// (In lesson 02 we swap in real Claude API calls.)

const SEQUENCE = [
  { context: ['The', 'sky', 'is'], candidates: [['blue', 72], ['clear', 15], ['dark', 8], ['grey', 5]] },
  { context: ['The', 'sky', 'is', 'blue'], candidates: [['and', 45], ['with', 20], ['today', 18], ['above', 17]] },
  { context: ['The', 'sky', 'is', 'blue', 'and'], candidates: [['the', 38], ['clouds', 30], ['calm', 22], ['bright', 10]] },
  { context: ['The', 'sky', 'is', 'blue', 'and', 'the'], candidates: [['sun', 55], ['clouds', 28], ['air', 12], ['birds', 5]] }
]

const BAR_COLORS = ['#ffb545', '#4fd1c5', '#a78bfa', '#647089']

export default function TokenPredictor() {
  const [step, setStep] = useState(0)
  const current = SEQUENCE[Math.min(step, SEQUENCE.length - 1)]
  const done = step >= SEQUENCE.length
  const chosenWord = step > 0 ? SEQUENCE[step - 1].candidates[0][0] : null

  const builtContext = done
    ? [...SEQUENCE[SEQUENCE.length - 1].context, SEQUENCE[SEQUENCE.length - 1].candidates[0][0]]
    : current.context

  const next = () => setStep((s) => s + 1)
  const reset = () => setStep(0)

  return (
    <div className="tp">
      <div className="tp-header">
        <span className="tp-tag">Interactive · try it</span>
        <span className="tp-hint">Press predict to build the sentence, one token at a time</span>
      </div>

      <div className="tp-sentence">
        {builtContext.map((tok, i) => (
          <span key={i} className="tp-token tp-token-in">{tok}</span>
        ))}
        {!done && <span className="tp-token tp-token-predict">?</span>}
      </div>

      {!done && (
        <div className="tp-bars">
          {current.candidates.map(([word, pct], i) => (
            <div className="tp-bar-row" key={word}>
              <span className="tp-bar-label">"{word}"</span>
              <div className="tp-bar-track">
                <div
                  className="tp-bar-fill"
                  style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
                />
              </div>
              <span className="tp-bar-pct">{pct}%</span>
            </div>
          ))}
        </div>
      )}

      <p className="tp-note">
        {done
          ? 'That is exactly how Claude writes every response — one token at a time, always choosing from a probability distribution.'
          : step === 0
            ? 'The model scores every word in its ~32,000-token vocabulary. Here are the top four candidates.'
            : `It picked "${chosenWord}" — the highest-probability token. Now the context is longer, so the next prediction shifts.`}
      </p>

      <div className="tp-actions">
        {!done
          ? <button className="btn btn-primary" onClick={next}>Predict next token</button>
          : <button className="btn btn-primary" onClick={reset}>Run it again</button>}
        {step > 0 && !done && <button className="btn" onClick={reset}>Reset</button>}
      </div>
    </div>
  )
}
