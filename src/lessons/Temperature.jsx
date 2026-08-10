import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import TemperatureDemo from '../components/TemperatureDemo.jsx'
import './Temperature.css'

// A small static bar showing how the probability distribution sharpens
// or flattens with temperature. Pure CSS, no backend.
function DistBars({ label, temp, bars }) {
  return (
    <div className="tmp-dist">
      <div className="tmp-dist-head">
        <span className="tmp-dist-temp">{label}</span>
        <span className="tmp-dist-caption">{temp}</span>
      </div>
      {bars.map((b, i) => (
        <div className="tmp-dist-row" key={i}>
          <span className="tmp-dist-word">{b.word}</span>
          <div className="tmp-dist-track">
            <div className="tmp-dist-fill" style={{ width: `${b.pct}%` }} />
          </div>
          <span className="tmp-dist-pct">{b.pct}%</span>
        </div>
      ))}
    </div>
  )
}

export default function Temperature() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="02"
        level="Beginner"
        duration="7 min"
        title="Temperature and sampling"
        intro="You've seen that Claude predicts a probability for every possible next token. Temperature is the single dial that decides how boldly it picks from those probabilities — the difference between a safe, predictable answer and a creative, surprising one."
        image="/images/temperature-and-sampling.svg"
      />

      <Section label="See it live" title="The same prompt, three temperatures">
        <p>
          Nothing explains this faster than watching it. Type a prompt below and send it at
          three temperatures at once. Look at the columns: on the left, the answer is safe and
          repeatable; on the right, it's varied and creative. Run it a few times and watch how
          much more the right column changes between runs.
        </p>

        <TemperatureDemo />
      </Section>

      <Section label="What's happening" title="Sharpening or flattening the odds">
        <p>
          Remember from Lesson 01 — after processing your input, Claude has a probability for
          every possible next token. Temperature is applied to those probabilities before one
          is chosen. <strong>Low temperature sharpens</strong> the distribution, making the
          top choice dominate. <strong>High temperature flattens</strong> it, giving unlikely
          tokens a real chance.
        </p>

        <div className="tmp-dists">
          <DistBars
            label="0.2"
            temp="Sharp — top token wins"
            bars={[
              { word: '"blue"', pct: 92 },
              { word: '"clear"', pct: 5 },
              { word: '"grey"', pct: 3 }
            ]}
          />
          <DistBars
            label="1.0"
            temp="Flat — real spread"
            bars={[
              { word: '"blue"', pct: 48 },
              { word: '"clear"', pct: 30 },
              { word: '"grey"', pct: 22 }
            ]}
          />
        </div>

        <Callout tone="cyan">
          <strong>At temperature 0</strong>, Claude always picks the single most likely token —
          so the same prompt gives the same answer every time. This is called greedy or
          deterministic decoding.
        </Callout>
      </Section>

      <Section label="When to use what" title="Choosing a temperature in your code">
        <p>
          In the API you pass <code>temperature</code> as a value between 0 and 1. There's no
          single right answer — it depends entirely on the job:
        </p>

        <KeyPoints
          points={[
            'temperature: 0 — code generation, data extraction, JSON output, factual lookups. You want reliability and repeatability.',
            'temperature: 0.3 to 0.5 — summarization, question answering. Mostly stable, with a little natural variation.',
            'temperature: 0.7 to 1.0 — conversational replies, creative writing, brainstorming. Variety is a feature here.'
          ]}
        />

        <Callout tone="amber">
          <strong>Rule of thumb:</strong> if you'll parse the output in code or need the same
          result every time, go low. If a human will read it and you want it to feel natural or
          creative, go higher. When unsure, the API default of around 1.0 is a reasonable
          middle.
        </Callout>
      </Section>

      <Section label="Two more dials" title="top_p and top_k, briefly">
        <p>
          Temperature is the main control, but two companions show up in the API.{' '}
          <code>top_p</code> (nucleus sampling) only considers the smallest set of tokens whose
          probabilities add up to <em>p</em> — cutting off the long tail of bizarre choices.{' '}
          <code>top_k</code> is simpler still: only consider the top K tokens, ignore the rest.
          Both work alongside temperature to keep output from going completely off the rails at
          high settings. You'll reach for temperature far more often than these.
        </p>
      </Section>

      <Section>
        <NextLesson />
      </Section>
    </article>
  )
}
