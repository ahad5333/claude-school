import { useState } from 'react'
import './RagDemo.css'

const LIBRARY = [
  {
    id: 1,
    title: 'Return policy',
    text: 'Items can be returned within 30 days of delivery for a full refund. The item must be unused and in original packaging. Refunds are processed within 5 business days of receiving the return.'
  },
  {
    id: 2,
    title: 'Shipping times',
    text: 'Standard shipping takes 5-7 business days within the country. Express shipping takes 1-2 business days and costs an additional fee. International orders take 10-20 business days depending on customs.'
  },
  {
    id: 3,
    title: 'Warranty coverage',
    text: 'All electronics come with a 1-year manufacturer warranty covering defects in materials and workmanship. The warranty does not cover accidental damage, water damage, or normal wear and tear.'
  },
  {
    id: 4,
    title: 'Account security',
    text: 'We recommend enabling two-factor authentication on your account. Passwords must be at least 8 characters. If you suspect unauthorized access, reset your password immediately and contact support.'
  },
  {
    id: 5,
    title: 'Payment methods',
    text: 'We accept major credit cards, debit cards, and PayPal. Payment is charged at the time of order. We do not store your full card number on our servers.'
  }
]

const EXAMPLES = [
  'Can I get my money back if I do not like the item?',
  'How long until my order arrives internationally?',
  'Is water damage covered under warranty?'
]

function scoreChunk(question, chunkText) {
  const qWords = question.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 3)
  const cWords = new Set(chunkText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/))
  const matches = qWords.filter((w) => cWords.has(w)).length
  return qWords.length ? matches / qWords.length : 0
}

export default function RagDemo() {
  const [question, setQuestion] = useState(EXAMPLES[0])
  const [retrieved, setRetrieved] = useState(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const run = async () => {
    if (!question.trim()) return

    setAnswer('')
    setStatus('retrieving')

    const scored = LIBRARY
      .map((doc) => ({ ...doc, score: scoreChunk(question, doc.text) }))
      .sort((a, b) => b.score - a.score)
    const top = scored.slice(0, 2)
    setRetrieved(scored)

    await new Promise((resolve) => setTimeout(resolve, 700))

    setStatus('generating')
    const context = top.map((c) => `${c.title}: ${c.text}`).join('\n\n')
    const prompt = `Answer the user's question using ONLY the context below. If the context doesn't contain the answer, say so.\n\nContext:\n${context}\n\nQuestion: ${question}`

    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt, temperature: 0, maxTokens: 150 })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setAnswer(data.text)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not reach the backend. Is it running? (npm run server)')
    }
  }

  return (
    <div className="rag">
      <div className="rag-header">
        <span className="rag-tag">Interactive · retrieval + real generation</span>
      </div>

      <label className="rag-label">Ask a question about the (fake) support docs</label>
      <textarea
        className="rag-input"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={2}
      />

      <div className="rag-examples">
        {EXAMPLES.map((example) => (
          <button key={example} className="rag-chip" onClick={() => setQuestion(example)} type="button">
            {example}
          </button>
        ))}
      </div>

      <button className="rag-run" onClick={run} disabled={status === 'retrieving' || status === 'generating'} type="button">
        {status === 'retrieving' ? 'Retrieving chunks…' : status === 'generating' ? 'Claude is answering…' : 'Run retrieval →'}
      </button>

      {retrieved && (
        <div className="rag-lib">
          <span className="rag-lib-label">Document library — ranked by relevance</span>
          {retrieved.map((doc) => (
            <div key={doc.id} className={`rag-doc ${doc.score > 0 ? 'used' : 'unused'}`}>
              <div className="rag-doc-head">
                <span className="rag-doc-title">{doc.title}</span>
                <span className="rag-doc-score">{(doc.score * 100).toFixed(0)}% match</span>
              </div>
              <div className="rag-doc-bar">
                <div className="rag-doc-fill" style={{ width: `${Math.max(doc.score * 100, 3)}%` }} />
              </div>
              {doc.score > 0 && <p className="rag-doc-text">{doc.text}</p>}
            </div>
          ))}
        </div>
      )}

      {(status === 'generating' || status === 'done' || status === 'error') && (
        <div className="rag-answer">
          <span className="rag-answer-label">Claude's answer — built only from the top chunks above</span>
          <div className="rag-answer-body">
            {status === 'generating' && <span className="rag-loading">Generating…</span>}
            {status === 'error' && <span className="rag-error">{errorMsg}</span>}
            {status === 'done' && answer}
          </div>
        </div>
      )}
    </div>
  )
}
