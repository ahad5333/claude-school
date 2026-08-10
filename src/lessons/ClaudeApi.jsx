import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import LiveApiDemo from '../components/LiveApiDemo.jsx'
import './ClaudeApi.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function ClaudeApi() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="04"
        level="Advanced"
        duration="12 min"
        title="The Claude API"
        intro="This is where Claude stops being a chat tool and becomes a building block in your own apps. Everything runs through one endpoint — once you understand a single message request, every advanced feature is just an addition to it."
        image="/images/claude-api.svg"
      />

      <Section label="Try it live" title="Send a real request to Claude">
        <p>
          Below is a real API playground. Type a prompt, pick a model, set the temperature,
          and send it — the response comes straight from Claude, routed through your own
          backend. This is the same call you'll write in code, made visible.
        </p>

        <LiveApiDemo />

        <Callout tone="cyan">
          <strong>How this works:</strong> your browser sends the prompt to your backend
          (<code>/api/complete</code>), the backend adds your secret API key and forwards
          it to Claude, then passes the reply back. Your key never touches the browser —
          that's the golden rule of API security.
        </Callout>
      </Section>

      <Section label="The one endpoint" title="Everything is a message request">
        <p>
          Whether you're building a chatbot, a summarizer, or an agent, it's all the same
          call: <code>POST /v1/messages</code>. You send a model, a list of messages, and a
          token limit — you get back a reply. Here's the entire program in Python:
        </p>

        <CodeBlock lang="python">{`import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain recursion in one sentence."}
    ],
)

print(message.content[0].text)`}</CodeBlock>

        <p>And the exact same thing in Node.js — the pattern your backend already uses:</p>

        <CodeBlock lang="javascript">{`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Explain recursion in one sentence." },
  ],
});

console.log(message.content[0].text);`}</CodeBlock>
      </Section>

      <Section label="The pieces" title="Five things, and that's the whole API">
        <KeyPoints
          points={[
            'model — which Claude to use. Opus for the hardest reasoning, Sonnet for balance, Haiku for fast and cheap. Match the model to the job.',
            'max_tokens — a ceiling on reply length, not a target. The reply just won\'t exceed it.',
            'messages — the conversation as an array. Each item has a role ("user" or "assistant") and content.',
            'system — an optional top-level field for instructions that shape Claude\'s role, tone, and rules.',
            'The response — Claude\'s reply comes back in content, an array of blocks. Read the text with content[0].text.'
          ]}
        />
      </Section>

      <Section label="The big gotcha" title="The API has no memory">
        <p>
          Every request is completely independent. Claude doesn't remember your last message
          unless you send the whole conversation history again. This is the same context-window
          idea from Lesson 01 — you assemble the context yourself on every call.
        </p>

        <CodeBlock lang="javascript">{`const messages = [
  { role: "user", content: "My name is Ahad." },
  { role: "assistant", content: "Nice to meet you, Ahad!" },
  { role: "user", content: "What's my name?" }  // works only because
                                                 // the history is included
];`}</CodeBlock>

        <Callout tone="amber">
          <strong>This is the core of every chatbot:</strong> keep appending each new user
          message and Claude's reply to the <code>messages</code> array, and resend the whole
          thing each turn. Managing that growing array is what building a conversational app
          actually is.
        </Callout>
      </Section>

      <Section label="Before you run it" title="Setup checklist">
        <KeyPoints
          points={[
            'Get an API key from console.anthropic.com — it starts with sk-ant-.',
            'Never put the key in your code or frontend. Load it from an environment variable: export ANTHROPIC_API_KEY=sk-ant-...',
            'Install the SDK: pip install anthropic (Python) or npm install @anthropic-ai/sdk (Node).',
            'For anything user-facing, stream long responses so your app feels instant instead of frozen.',
            'Wrap calls in try/catch — handle rate limits (slow down and retry) and auth errors (bad key).'
          ]}
        />
      </Section>

      <Section>
        <NextLesson
          to={null}
          title="Tool use — letting Claude call your own functions and become an agent"
        />
      </Section>
    </article>
  )
}
