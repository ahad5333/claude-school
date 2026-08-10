import { useState, useMemo, useEffect } from 'react'
import { TERMS, CATEGORIES } from '../data/cheatsheetTerms.js'
import './CheatSheet.css'

function initials(term) {
  return term
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function CheatSheet() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TERMS.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category
      const matchesQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.example.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="cs-page">
      <div className="container">
        <div className="cs-header">
          <span className="cs-eyebrow">Quick revision</span>
          <h1 className="cs-title">Cheat sheet</h1>
          <p className="cs-intro">
            Every term from every lesson, in one place — a short definition plus a real-life
            example for each, so a five-minute scan before you build something jogs it all back.
          </p>
        </div>

        <div className="cs-controls">
          <input
            type="text"
            className="cs-search"
            placeholder="Search a term…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="cs-filters">
            <button
              type="button"
              className={`cs-filter ${category === 'All' ? 'on' : ''}`}
              onClick={() => setCategory('All')}
            >
              All ({TERMS.length})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`cs-filter ${category === c ? 'on' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="cs-empty">No terms match "{query}" — try a different word.</p>
        ) : (
          <div className="cs-grid">
            {filtered.map((t) => (
              <div key={t.term} className={`cs-card cs-card-${t.accent}`}>
                <div className="cs-card-head">
                  <span className="cs-badge">{initials(t.term)}</span>
                  <div>
                    <h3 className="cs-term">{t.term}</h3>
                    <span className="cs-category">{t.category}</span>
                  </div>
                </div>
                <p className="cs-definition">{t.definition}</p>
                <div className="cs-example">
                  <span className="cs-example-label">Real-life example</span>
                  <p className="cs-example-text">{t.example}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
