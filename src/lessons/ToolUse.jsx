import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import ToolLoopDemo from '../components/ToolLoopDemo.jsx'
import './ToolUse.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function ToolUse() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="05"
        level="Advanced"
        duration="11 min"
        title="Tool use — Claude calls your functions"
        intro="Everything so far has been Claude producing text. Tool use is where Claude can reach out and do things — search the web, query your database, run a calculation — and use the results. This one concept is the foundation of every AI agent."
        image="/images/tool-use.svg"
      />

      <Section label="The key idea" title="Claude never runs your code — it asks">
        <p>
          Here's the mental shift that makes tool use click. Claude doesn't execute your
          functions. It says <em>"I want to call this function with these arguments,"</em>{' '}
          pauses, and hands control back to you. Your code runs the function and returns the
          result. Then Claude continues. You stay in control the whole time.
        </p>
        <p>Step through the loop below — watch control pass back and forth.</p>

        <ToolLoopDemo />
      </Section>

      <Section label="Part 1" title="Define your tools">
        <p>
          A tool is just a description of a function Claude can request — written as a JSON
          schema with a name, a description, and its inputs. Claude never sees your actual
          code, only this description, which it uses to decide when the tool fits.
        </p>

        <CodeBlock lang="javascript">{`const tools = [{
  name: "get_weather",
  description: "Get the current weather for a city",
  input_schema: {
    type: "object",
    properties: {
      city: { type: "string", description: "The city name" }
    },
    required: ["city"]
  }
}];`}</CodeBlock>

        <Callout tone="cyan">
          <strong>The description does real work.</strong> It's how Claude decides whether this
          tool matches the user's request. Write it like you're explaining the function to a
          new teammate — clear and specific.
        </Callout>
      </Section>

      <Section label="Part 2" title="Send the tools, then check the response">
        <p>
          You pass the <code>tools</code> array in your API call. Now Claude has a choice:
          answer directly, or ask to use a tool. You detect which by checking{' '}
          <code>stop_reason</code>.
        </p>

        <CodeBlock lang="javascript">{`const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools: tools,
  messages: [{ role: "user", content: "What's the weather in Delhi?" }]
});

// Claude wants a tool if stop_reason is "tool_use"
if (message.stop_reason === "tool_use") {
  // the response contains a tool_use block telling you
  // which tool and what arguments
}`}</CodeBlock>
      </Section>

      <Section label="Part 3" title="Run the function, send the result back">
        <p>
          You execute your real function with the arguments Claude gave you, then continue the
          conversation by appending both Claude's request and your result to the messages
          array — the same growing-history pattern from the API lesson.
        </p>

        <CodeBlock lang="javascript">{`const toolUse = message.content.find(b => b.type === "tool_use");

// run YOUR real function
const result = getWeather(toolUse.input.city); // "34°C, sunny"

// continue the conversation with the result
const final = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools: tools,
  messages: [
    { role: "user", content: "What's the weather in Delhi?" },
    { role: "assistant", content: message.content },   // Claude's request
    { role: "user", content: [{                         // your result
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    }]}
  ]
});

console.log(final.content[0].text);
// "It's currently 34°C and sunny in Delhi."`}</CodeBlock>

        <Callout tone="amber">
          <strong>Notice what this is built from:</strong> it's the stateless messages array
          from the API lesson, plus two new message types — <code>tool_use</code> from Claude,
          and <code>tool_result</code> from you. Nothing here is truly new; it's a new use of
          what you already know.
        </Callout>
      </Section>

      <Section label="What this unlocks" title="From one call to a real agent">
        <KeyPoints
          points={[
            'You control everything. Claude can only request tools you defined — it can\'t run arbitrary code or touch anything you didn\'t hand it.',
            'A tool can do anything your code can. Query PostgreSQL, hit a third-party API, read a file, send an email — to Claude it\'s just "a function with inputs and an output".',
            'Real agents loop. Wrap the exchange in a while loop: keep running tools as long as stop_reason is "tool_use", until Claude answers in plain text.',
            'That loop — think, act, observe, repeat — is literally what an agent is. A research agent might search, read three pages, calculate, then answer, all in one loop.',
            'For dangerous actions (delete, send money, publish), put a human confirmation step in front. Claude proposes, a person approves, then it runs.'
          ]}
        />
      </Section>

      <Section>
        <NextLesson
          to={null}
          title="RAG — giving Claude knowledge from your own documents"
        />
      </Section>
    </article>
  )
}
