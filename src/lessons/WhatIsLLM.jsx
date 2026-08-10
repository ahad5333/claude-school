import { useEffect } from 'react'
import { LessonHeader, Section, Callout, LessonSummary, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import TokenPredictor from '../components/TokenPredictor.jsx'

export default function WhatIsLLM() {
  // Scroll to top when the lesson opens
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="01"
        level="Beginner"
        duration="8 min"
        title="What is a large language model?"
        intro="Before you can build anything with Claude, you need one mental model in your head. It is simpler than you would expect — and once it clicks, everything else makes sense."
        image="/images/what-is-an-llm.svg"
      />

      <LessonSummary
        title="What to remember"
        takeaway="The core mental model is simple: Claude generates text by repeatedly predicting the next token from context."
        points={[
          'An LLM predicts the next token, not a full sentence in one shot.',
          'Every choice changes the context, so the next prediction is shaped by the last one.',
          'Tokens are chunks of text, and the model scores the entire vocabulary at each step.',
          'The impressive behavior you see is an emergent side effect of prediction at scale.'
        ]}
      />

      <Section label="The core idea" title="It predicts the next word. That's it.">
        <p>
          A large language model, or <strong>LLM</strong>, is a machine that does one
          thing: it looks at some text and predicts what word most likely comes next.
          It then adds that word, looks again, and predicts the next one. Over and over.
        </p>
        <p>
          If I write <em>"The sky is..."</em>, your brain instantly fills in <em>"blue"</em>.
          You learned that from years of reading. An LLM learned the same way — except
          it read a large fraction of everything humans have ever written, and instead of
          a brain it uses a mathematical structure called a <strong>transformer</strong>{' '}
          with billions of adjustable numbers called <strong>parameters</strong>.
        </p>

        <Callout tone="amber">
          <strong>The whole engine in one sentence:</strong> an LLM turns text into a
          list of probabilities over every possible next word, then picks one — and
          repeats until the response is finished.
        </Callout>
      </Section>

      <Section label="See it happen" title="Watch a sentence get built, token by token">
        <p>
          Instead of reading about it, run it. Below is the exact process Claude uses
          to generate a response. Each blue box is a word already committed. The model
          scores the candidates for what comes next and picks the most likely one.
        </p>

        <TokenPredictor />

        <p>
          Notice how the probabilities <strong>shift after every choice</strong>. Once
          "blue" is committed, the model isn't guessing about a sky anymore — the growing
          context reshapes what's likely next. This is why Claude can stay coherent across
          a long answer: every token it writes becomes part of the context for the next one.
        </p>
      </Section>

      <Section label="Words vs tokens" title="What exactly is a 'token'?">
        <p>
          Models don't work with whole words — they work with <strong>tokens</strong>,
          which are chunks of text roughly 3–4 characters long. A word like{' '}
          <code>unhappy</code> might be two tokens: <code>un</code> + <code>happy</code>.
          Common words are usually one token; rare words get split into several.
        </p>
        <p>
          Claude's vocabulary contains roughly <strong>32,000 tokens</strong>. Every
          prediction is a probability spread across all of them — the model isn't choosing
          from a shortlist, it's scoring the entire vocabulary and picking from that.
        </p>
      </Section>

      <Section label="Why it feels smart" title="Intelligence as a side effect">
        <p>
          Here's the surprising part. Nobody programmed grammar, facts, or logic into the
          model. To get genuinely good at predicting the next token across billions of
          sentences, the model <strong>had to</strong> learn those things on its own —
          grammar, world facts, code patterns, reasoning, common sense. They emerged as
          side effects of one relentless task, practised at enormous scale.
        </p>

        <KeyPoints
          points={[
            'An LLM predicts the next token — that single task is the entire mechanism.',
            'It learned by reading a huge fraction of human text and getting better at that prediction.',
            'Tokens are word-chunks; Claude works with a vocabulary of about 32,000 of them.',
            'Reasoning, facts, and coding ability are emergent — side effects of scale, not hand-coded rules.',
            'Every response is generated one token at a time, always from a probability distribution.'
          ]}
        />

        <Callout tone="cyan">
          <strong>One caveat to remember:</strong> because the model always picks the most{' '}
          <em>plausible</em> next token — not the most <em>true</em> one — it can sometimes
          produce confident, well-formed text that is simply wrong. That's called a{' '}
          <strong>hallucination</strong>, and it's a direct consequence of how prediction works.
        </Callout>
      </Section>

      <Section>
        <NextLesson />
      </Section>
    </article>
  )
}
