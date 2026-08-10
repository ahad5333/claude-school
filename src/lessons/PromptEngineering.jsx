import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import PromptBuilder from '../components/PromptBuilder.jsx'
import './PromptEngineering.css'

// A small before/after block, local to this lesson.
function BeforeAfter({ before, after, afterNote }) {
  return (
    <div className="ba">
      <div className="ba-col ba-before">
        <span className="ba-tag ba-tag-bad">Vague</span>
        <p className="ba-text">{before}</p>
      </div>
      <div className="ba-col ba-after">
        <span className="ba-tag ba-tag-good">Engineered</span>
        <p className="ba-text">{after}</p>
        {afterNote && <p className="ba-note">{afterNote}</p>}
      </div>
    </div>
  )
}

export default function PromptEngineering() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="03"
        level="Intermediate"
        duration="10 min"
        title="Writing great prompts"
        intro="Same model, same effort — but a well-structured prompt and a vague one produce completely different results. The biggest lever on output quality isn't a hidden setting. It's how you ask."
        image="/images/prompt-engineering.svg"
      />

      <Section label="The formula" title="Every strong prompt has four parts">
        <p>
          You don't always need all four, but the more you include, the sharper the
          result. Think of it as briefing a brilliant new hire who has zero context
          about your project: <strong>Role</strong> tells them who to be,{' '}
          <strong>Context</strong> tells them what they're working on,{' '}
          <strong>Task</strong> tells them exactly what to do, and{' '}
          <strong>Format</strong> tells them how to hand it back.
        </p>
        <p>
          Build one below. Toggle each part on and off and watch both the prompt and
          the quality score respond.
        </p>

        <PromptBuilder />
      </Section>

      <Section label="See the difference" title="The same request, two ways">
        <p>
          Here's what this looks like in real work. Both prompts ask for the same thing —
          but one makes Claude guess, and the other doesn't.
        </p>

        <BeforeAfter
          before="Write code for a login form"
          after="You are a senior React developer. I'm building a SaaS dashboard with React, TypeScript, and Tailwind CSS. Build a login form component with email and password fields, inline validation, a loading state on submit, and accessibility labels. Output only the component code with TypeScript prop types — no explanation."
          afterNote="Roughly 20 extra seconds of typing. The result lands close to production-ready on the first try, instead of after three rounds of corrections."
        />

        <Callout tone="amber">
          <strong>The core insight:</strong> bad output usually isn't the model failing —
          it's the model guessing, because the prompt left something unsaid. Every part
          you add is one less thing it has to assume.
        </Callout>
      </Section>

      <Section label="The principles" title="Four habits that sharpen any prompt">
        <KeyPoints
          points={[
            'Be specific, not polite. "Review this function for race conditions" beats "can you take a look?". Claude needs precision, not pleasantries.',
            'Give positive instructions. Tell Claude what to do, not just what to avoid: "respond in a formal tone" works better than "don\'t be casual".',
            'Show an example. If you want a particular style or format, include a sample of it. One good example is worth a paragraph of description — this is few-shot prompting.',
            'Ask for reasoning on hard problems. Adding "think step by step before answering" measurably improves accuracy on logic, math, and debugging tasks.'
          ]}
        />

        <Callout tone="cyan">
          <strong>Why "think step by step" works:</strong> it lets Claude reason through
          intermediate tokens instead of jumping straight to a conclusion. Remember from
          Lesson 01 — the model generates one token at a time, so giving it room to work
          through the problem produces better final answers.
        </Callout>
      </Section>

      <Section label="Try it yourself" title="A 30-second exercise">
        <p>
          Open Claude in another tab. Take a prompt you'd normally type quickly — something
          like "help me write an email" — and rewrite it with all four parts. Give it a role,
          the context around the email, the specific task, and the format you want. Compare
          the two results side by side. The difference is the whole lesson.
        </p>
      </Section>

      <Section>
        <NextLesson />
      </Section>
    </article>
  )
}
