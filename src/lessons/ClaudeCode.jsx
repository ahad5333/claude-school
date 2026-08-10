import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import PermissionModeDemo from '../components/PermissionModeDemo.jsx'
import './ClaudeCode.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function ClaudeCode() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="10"
        level="Advanced"
        duration="10 min"
        title="Claude Code mastery"
        intro="Five levers separate asking Claude to write code from running it as a genuine daily tool: permission modes, CLAUDE.md, slash commands, subagents, and MCP servers — the same MCP from Lesson 09, now live inside your terminal."
      />

      <Section label="See it live" title="How much rope you give it">
        <p>
          Click through the four permission modes. Each trades control for speed differently —
          the right move is switching between them mid-session, not picking one and forgetting
          it.
        </p>

        <PermissionModeDemo />

        <Callout tone="amber">
          <strong>A real change worth knowing:</strong> starting August 14, 2026, Auto becomes
          the default for new sessions on Pro, Max, and Team plans — replacing the old
          ask-before-every-edit default. A classifier reviews every action before it runs and
          blocks anything that escalates beyond what you asked for.
        </Callout>
      </Section>

      <Section label="Lever 1" title="CLAUDE.md — the project's memory">
        <p>
          A file at your project root that Claude reads automatically at the start of every
          session. Think of it as the onboarding doc you'd give a new contractor: build
          commands, lint commands, conventions, and the things Claude keeps getting wrong that
          you're tired of repeating.
        </p>

        <CodeBlock lang="markdown">{`# Project: habibi-halal-express
## Build
npm run build
## Lint
npm run lint -- --fix
## Test
npm test
## Conventions
- Use TypeScript strict mode
- No default exports
- Commit format: feat/fix/chore(scope): description`}</CodeBlock>

        <Callout tone="cyan">
          <strong>Run <code>/init</code> first, always.</strong> It scans your repo and drafts
          a CLAUDE.md for you automatically — genuinely worth doing on day one of any project,
          since it saves Claude from re-discovering "is there a build command?" every single
          session.
        </Callout>
      </Section>

      <Section label="Lever 2" title="Slash commands — saved prompts you invoke by typing /">
        <p>
          If you catch yourself typing the same instruction repeatedly — "review this PR
          against our style guide," "write tests for the function I just wrote" — that's a
          slash command waiting to happen. Save it once as a markdown file, and it becomes
          reusable for you and anyone else on the project.
        </p>
      </Section>

      <Section label="Lever 3" title="Subagents — specialized instances with their own context">
        <p>
          When a task would flood your main conversation with noise you don't need — reading
          through 40 files to answer one question, running a test suite and parsing the output
          — a subagent does that work in an isolated context and hands back just the answer.
          Your main session stays clean instead of filling up with intermediate exploration.
        </p>
      </Section>

      <Section label="Lever 4" title="MCP servers — the connectors from Lesson 09, live in your terminal">
        <p>
          This is where MCP stops being abstract. Connect a GitHub MCP server and Claude Code
          can read issues and open PRs directly. Connect a Postgres one and it can query your
          actual database while debugging — no custom code, just a connection.
        </p>
      </Section>

      <Section label="Tying it together" title="What each lever actually controls">
        <KeyPoints
          points={[
            'CLAUDE.md is what Claude knows without being told — project context, loaded automatically.',
            'Slash commands are shortcuts for what you\'d type anyway — saved once, reused forever.',
            'Subagents are how you keep a big task from cluttering your main conversation.',
            'Permission modes are how much rope you give it while it works.',
            'Get CLAUDE.md right first. It\'s the one that pays off every single session after you write it once.'
          ]}
        />
      </Section>

      <Section>
        <NextLesson />
      </Section>
    </article>
  )
}
