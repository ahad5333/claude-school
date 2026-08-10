import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import McpDemo from '../components/McpDemo.jsx'
import './Mcp.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function Mcp() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="09"
        level="Advanced"
        duration="9 min"
        title="MCP — the USB-C of AI tools"
        intro="Before USB-C, every device had its own cable — connecting any two things meant someone built a cable for that exact pair. MCP does the same job for AI tools: build a tool once, and any MCP-compatible app can use it, instead of wiring it into your one app by hand."
      />

      <Section label="See it live" title="The actual math behind the tangle">
        <p>
          Add and remove apps and tools below and watch two numbers move. Without a shared
          protocol, every app needs its own integration with every tool — that count grows
          multiplicatively. With MCP, each app and each tool only needs to speak the protocol
          once.
        </p>

        <McpDemo />

        <Callout tone="violet">
          <strong>This is the whole pitch in one formula.</strong> Without MCP you're building
          N × M integrations. With MCP you're building N + M. The gap gets enormous fast — and
          you've already felt the smaller version of this problem in Lesson 05, wiring one tool
          into one app.
        </Callout>
      </Section>

      <Section label="What actually changes" title="Same tool shape, different home">
        <p>
          Your tool definitions — name, description, input schema — are exactly what you
          learned in Lesson 05. MCP doesn't change that shape. It standardizes how those
          definitions get <em>served</em> and <em>discovered</em>, instead of being hardcoded
          into your one app's source code.
        </p>

        <CodeBlock lang="javascript">{`// Without MCP: tool lives inside YOUR app's code
const tools = [{ name: "get_weather", description: "...", input_schema: {...} }];

// With MCP: same shape, served by a server ANY app can query
const mcpServer = new McpServer({ name: "weather-server", version: "1.0.0" });
mcpServer.tool("get_weather", "Get current weather for a city",
  { city: z.string() },
  async ({ city }) => ({ content: [{ type: "text", text: await fetchWeather(city) }] })
);`}</CodeBlock>

        <p>
          Any app that speaks MCP connects to that one server and immediately gets{' '}
          <code>get_weather</code> as an available tool — no custom integration code on the
          app's side. The server describes itself; the app just asks.
        </p>
      </Section>

      <Section label="Three pieces" title="You already understand two of them">
        <KeyPoints
          points={[
            'MCP server — exposes tools (and optionally resources, like read-only files or data). This is the new piece, written once per tool.',
            'MCP client — the AI app connecting to servers. Claude Desktop and Claude Code both ship this built in.',
            'The tool call itself — identical to Lesson 05. Claude still pauses, asks for a tool, gets a result back. MCP changes where the tool definition lives, not the loop itself.'
          ]}
        />
      </Section>

      <Section label="Why this matters for you" title="A real freelance scenario">
        <p>
          If a client asks "can Claude look at our Postgres database directly," you're not
          writing a custom integration from scratch. You connect an existing Postgres MCP
          server — several are already published — and Claude Desktop or Claude Code gets
          database access immediately.
        </p>

        <Callout tone="amber">
          <strong>Build once, use everywhere.</strong> Build an MCP server for one client's
          order system, and it works with Claude Desktop, Claude Code while you debug, and any
          future AI product that speaks MCP — no rewriting the integration for each new place
          you want to use it.
        </Callout>
      </Section>

      <Section>
        <NextLesson />
      </Section>
    </article>
  )
}
