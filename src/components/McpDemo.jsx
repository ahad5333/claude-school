import { useState } from 'react'
import './McpDemo.css'

// Interactive demo for the MCP lesson. Lets the learner add/remove apps and
// tools and watch two numbers update live: how many custom integrations
// you'd need WITHOUT a shared protocol (N x M) versus WITH one (N + M).
// This is the actual math behind the USB-C mental model from the lesson —
// made tangible instead of just asserted.

const ALL_APPS = ['Your app', 'Claude Desktop', 'Claude Code', 'A client\'s app']
const ALL_TOOLS = ['GitHub', 'Postgres', 'Slack', 'Google Drive']

export default function McpDemo() {
  const [apps, setApps] = useState(['Your app', 'Claude Desktop', 'Claude Code'])
  const [tools, setTools] = useState(['GitHub', 'Postgres', 'Slack'])

  const toggle = (list, setList, item) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const n = apps.length
  const m = tools.length
  const without = n * m
  const withMcp = n + m

  return (
    <div className="mcp">
      <div className="mcp-header">
        <span className="mcp-tag">Interactive · the actual math</span>
      </div>

      <div className="mcp-pickers">
        <div className="mcp-picker">
          <span className="mcp-picker-label">Apps ({n})</span>
          <div className="mcp-chips">
            {ALL_APPS.map((a) => (
              <button
                key={a}
                type="button"
                className={`mcp-chip ${apps.includes(a) ? 'on' : ''}`}
                onClick={() => toggle(apps, setApps, a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="mcp-picker">
          <span className="mcp-picker-label">Tools ({m})</span>
          <div className="mcp-chips">
            {ALL_TOOLS.map((t) => (
              <button
                key={t}
                type="button"
                className={`mcp-chip mcp-chip-tool ${tools.includes(t) ? 'on' : ''}`}
                onClick={() => toggle(tools, setTools, t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mcp-results">
        <div className="mcp-result mcp-result-without">
          <span className="mcp-result-label">Without a shared protocol</span>
          <span className="mcp-result-formula">{n} apps × {m} tools</span>
          <span className="mcp-result-value">{without}</span>
          <span className="mcp-result-caption">custom integrations to write and maintain</span>
        </div>
        <div className="mcp-result mcp-result-with">
          <span className="mcp-result-label">With MCP</span>
          <span className="mcp-result-formula">{n} apps + {m} tools</span>
          <span className="mcp-result-value">{withMcp}</span>
          <span className="mcp-result-caption">things to build — each connects once</span>
        </div>
      </div>

      {without > withMcp && (
        <p className="mcp-footnote">
          Add more apps or tools and watch the gap widen — the "without" side grows
          multiplicatively, the "with MCP" side only grows by one integration per new
          app or tool.
        </p>
      )}
    </div>
  )
}
