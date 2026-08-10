import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import MultiAgentDemo from '../components/MultiAgentDemo.jsx'
import './MultiAgent.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function MultiAgent() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="11"
        level="Advanced"
        duration="10 min"
        title="Multi-agent systems"
        intro="Instead of one agent looping through every step alone, an orchestrator agent breaks a task into pieces and delegates them to specialized worker agents — each one a complete agent loop from Lesson 07, running one narrow slice of the bigger job."
      />

      <Section label="See it live" title="One task, three workers, one combined answer">
        <p>
          Run the task below and watch the orchestrator dispatch to three workers running in
          parallel. Notice they finish at different times — just like real API calls would —
          and the orchestrator waits for all three before combining their results.
        </p>

        <MultiAgentDemo />

        <Callout tone="amber">
          <strong>Two real reasons to split work like this.</strong> Context stays clean — a
          research worker can read 40 pages without flooding the main conversation with all 40.
          And specialization improves quality — a worker whose entire job is "verify claims"
          does that better than a generalist juggling five responsibilities at once.
        </Callout>
      </Section>

      <Section label="Building one" title="Genuinely just nested tool calls">
        <p>
          The orchestrator treats each worker as a tool it can call. The worker happens to be a
          full agent loop instead of a single function, but from the orchestrator's
          perspective, it's just another tool that takes an input and returns a result.
        </p>

        <CodeBlock lang="javascript">{`const tools = [
  { name: "research_worker", description: "Gathers sources on a topic", input_schema: {...} },
  { name: "writer_worker", description: "Drafts content from research notes", input_schema: {...} },
  { name: "factcheck_worker", description: "Verifies claims against sources", input_schema: {...} }
];

// Inside your tool-runner, each "tool" actually runs its own full agent loop
async function runTool(name, input) {
  if (name === "research_worker") return await runResearchAgent(input.topic);
  if (name === "writer_worker") return await runWriterAgent(input.notes);
  if (name === "factcheck_worker") return await runFactCheckAgent(input.draft);
}`}</CodeBlock>

        <p>
          The orchestrator's <code>while</code> loop looks identical to Lesson 07's. The only
          difference is what's on the other side of each tool call — a full agent instead of a
          plain function.
        </p>
      </Section>

      <Section label="Coordination patterns" title="Three worth knowing">
        <KeyPoints
          points={[
            'Orchestrator-worker — one planner, several specialists, parallel execution. Best when subtasks are independent (what you just ran above).',
            'Sequential pipeline — researcher hands off to writer hands off to editor, each depending on the previous one\'s output. Best when order genuinely matters.',
            'Debate/review — two agents check each other\'s work (one drafts, another critiques) before a final answer ships. Best for catching errors a single agent would miss in itself.'
          ]}
        />
      </Section>

      <Section label="The honest cost" title="Where evaluation gets harder">
        <p>
          Multi-agent systems multiply your API cost by however many agents run — three workers
          means roughly three times the tokens of a single agent for the same task. Use this
          pattern when subtasks genuinely benefit from isolation or specialization, not by
          default.
        </p>

        <Callout tone="cyan">
          <strong>Evaluation gets a new failure mode: coordination bugs.</strong> The research
          worker and writer worker can each individually pass their own tests while still
          handing off garbled or mismatched information between them. The seams are where
          multi-agent systems actually break — test the handoffs, not just each agent alone.
        </Callout>
      </Section>

      <Section>
        <NextLesson to={null} title="More advanced lessons coming soon" />
      </Section>
    </article>
  )
}
