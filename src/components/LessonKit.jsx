import { Link, useLocation } from 'react-router-dom'
import { lessons } from '../lessons/index.js'
import './LessonKit.css'

// Reusable building blocks so every lesson page is quick to assemble.
// Import these and fill them with content — the styling stays consistent.

export function LessonHeader({ number, title, level, duration, intro, image }) {
  const location = useLocation()
  const currentSlug = location.pathname.replace('/lesson/', '')
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === currentSlug)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0

  return (
    <header className="lk-header">
      <div className="container">
        <Link to="/" className="lk-back">← All lessons</Link>
        <span className="eyebrow">Lesson {number} · {level}</span>
        {image && (
          <div className="lk-hero-visual">
            <img src={image} alt="" />
          </div>
        )}
        <h1 className="lk-title">{title}</h1>
        <p className="lk-intro">{intro}</p>
        <span className="lk-duration">{duration} read</span>

        <div className="lk-journey">
          <div className="lk-journey-meta">
            <span className="lk-journey-label">Learning path</span>
            <span className="lk-journey-count">Lesson {number} of {lessons.length}</span>
          </div>
          <div className="lk-progress-bar" aria-hidden="true">
            <div className="lk-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="lk-nav-links">
            {previousLesson ? (
              <Link to={`/lesson/${previousLesson.slug}`} className="lk-nav-link">
                ← {previousLesson.title}
              </Link>
            ) : (
              <span className="lk-nav-chip">Start here</span>
            )}
            {nextLesson ? (
              <Link to={`/lesson/${nextLesson.slug}`} className="lk-nav-link">
                {nextLesson.title} →
              </Link>
            ) : (
              <span className="lk-nav-chip">End of path</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export function Section({ label, title, children }) {
  return (
    <section className="lk-section">
      <div className="container lk-narrow">
        {label && <span className="eyebrow">{label}</span>}
        {title && <h2 className="lk-section-title">{title}</h2>}
        {children}
      </div>
    </section>
  )
}

export function Callout({ children, tone = 'amber' }) {
  return (
    <div className={`lk-callout lk-callout-${tone}`}>
      {children}
    </div>
  )
}

export function LessonSummary({ title = 'What to remember', points, takeaway }) {
  return (
    <section className="lk-summary">
      <div className="container lk-narrow">
        <div className="lk-summary-card">
          <span className="eyebrow">Study summary</span>
          <h2 className="lk-summary-title">{title}</h2>
          {takeaway && <p className="lk-summary-takeaway">{takeaway}</p>}
          <ul className="lk-summary-list">
            {points.map((point, index) => (
              <li key={`${point}-${index}`}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function KeyPoints({ points }) {
  return (
    <ul className="lk-keypoints">
      {points.map((p, i) => (
        <li key={i}>
          <span className="lk-kp-num">{String(i + 1).padStart(2, '0')}</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  )
}

export function NextLesson() {
  const location = useLocation()
  const currentSlug = location.pathname.replace('/lesson/', '')
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === currentSlug)
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  if (!next) {
    return (
      <div className="lk-next lk-next-soon">
        <span className="eyebrow">Up next</span>
        <p className="lk-next-title">More advanced lessons coming soon</p>
        <span className="lk-next-badge">Coming soon</span>
      </div>
    )
  }
  return (
    <Link to={`/lesson/${next.slug}`} className="lk-next">
      <span className="eyebrow">Up next</span>
      <p className="lk-next-title">{next.title} →</p>
    </Link>
  )
}
