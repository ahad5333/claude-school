import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import AgentLoopDemo from '../components/AgentLoopDemo.jsx'
import './Agents.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function Agents() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="07"
        level="Advanced"
        duration="12 min"
        title="Building and evaluating AI agents"
        intro="Tool use gave you one exchange — Claude asks for a tool, you run it, Claude answers. An agent is that same exchange, looped, with Claude checking after every step whether the goal is actually met before deciding to act again."
      />

      <Section label="See it live" title="A real multi-step agent run">
        <p>
          Step through an agent handling a two-part task: find a flight price, and check the
          baggage allowance. Watch what happens after the first Decide step — the goal isn't
          fully met yet, so it loops back to Plan instead of answering.
        </p>

        <AgentLoopDemo />

        <Callout tone="cyan">
          <strong>The genuinely new part is Decide.</strong> In Lesson 05, Claude called one
          tool and answered. Here it checks itself first — "have I actually satisfied what was
          asked?" That self-check is the entire difference between tool use and an agent.
        </Callout>
      </Section>

      <Section label="Building one" title="Same code, plus a while loop">
        <p>
          You already have every piece from Lesson 05. The only change is wrapping the
          exchange in a loop that keeps going as long as Claude asks for tools, and breaks once
          it answers in plain text.
        </p>

        <CodeBlock lang="javascript">{`let messages = [{ role: "user", content: userGoal }];

while (true) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: tools,
    messages: messages
  });

  messages.push({ role: "assistant", content: response.content });

  if (response.stop_reason !== "tool_use") {
    console.log(response.content[0].text);  // done
    break;
  }

  const toolUse = response.content.find(b => b.type === "tool_use");
  const result = await runTool(toolUse.name, toolUse.input);

  messages.push({
    role: "user",
    content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }]
  });
}`}</CodeBlock>

        <Callout tone="amber">
          <strong>Give it a hard stop.</strong> An agent that never terminates correctly can
          loop forever and burn money. Cap it — <code>{'for (let step = 0; step < 10; step++)'}</code>{' '}
          instead of <code>while (true)</code> — and handle hitting the limit without a clean
          answer.
        </Callout>
      </Section>

      <Section label="What makes it feel autonomous" title="Multiple tools, one judgment call">
        <KeyPoints
          points={[
            'The system prompt sets judgment, not just tone. "Verify you\'ve addressed every part of the request before answering" is what shapes the Decide step.',
            'Multiple tools compound the power. A research agent might have search, read_page, and calculate all available — Claude picks which it needs at each step.',
            'That per-step choice, not a scripted sequence, is what makes it genuinely autonomous rather than a fancy if/else chain.'
          ]}
        />
      </Section>

      <Section label="Evaluating agents" title="Where most people stop too early">
        <p>
          Here's the trap: you run your agent on three examples, it looks great, you ship it.
          Then it fails silently on case 47 in production. Evaluating agents means testing two
          different things that can go wrong — separately.
        </p>
        <p>
          <strong>Outcome evaluation</strong> — did it get the right answer? Build a test set of
          realistic tasks with known correct answers, run your agent on all of them, score
          pass/fail.
        </p>
        <p>
          <strong>Trajectory evaluation</strong> — did it get there the right way? This is
          unique to agents. It can reach the correct answer while doing something you don't
          want along the way — calling an expensive tool unnecessarily, taking 15 steps when 3
          would do. You have to look at the path, not just the destination.
        </p>

        <KeyPoints
          points={[
            'Success rate — percentage of test cases where the final answer matches expected.',
            'Step count — a sudden jump on similar tasks signals thrashing or being stuck.',
            'Tool call accuracy — right tool, right arguments, at each step.',
            'Cost per run — each loop iteration is an API call; an inefficient agent is a slow bill.',
            'Failure mode — does it fail gracefully ("I couldn\'t find that") or badly (hallucinates, loops to the cap)?'
          ]}
        />

        <Callout tone="violet">
          <strong>Using Claude to grade Claude.</strong> Past a few dozen test cases, hand-grading
          gets slow. A common trick: show Claude the agent's full transcript plus the expected
          outcome, and ask it to score whether the task was actually completed against a rubric.
          Worth knowing as its own technique — using a model to judge another model's output.
        </Callout>
      </Section>

      <Section>
        <NextLesson to={null} title="More advanced lessons coming soon" />
      </Section>
    </article>
  )
}
