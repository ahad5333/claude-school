// Minimal Express backend.
// Its job: keep your Anthropic API key on the server (never in the browser)
// and expose simple endpoints the frontend demos can call.
//
// You don't need this for Lesson 01 (that demo is fully client-side),
// but Lesson 02 onward will call /api/complete for live Claude responses.
//
// Run it with:  npm run server
// Requires: ANTHROPIC_API_KEY in your environment.

import express from 'express'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001
const API_KEY = process.env.ANTHROPIC_API_KEY

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(API_KEY) })
})

// Live completion endpoint used by later interactive lessons.
app.post('/api/complete', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY.' })
  }

  const { prompt, temperature = 1, maxTokens = 300 } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Provide a "prompt" string.' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Claude API error' })
    }

    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')

    res.json({ text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`ClaudeSchool API running on http://localhost:${PORT}`)
})
