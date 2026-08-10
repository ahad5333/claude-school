import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.js'
import ProgressTracker from '../components/ProgressTracker.jsx'
import './Home.css'

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">A guided learning journey</span>
          <h1 className="hero-title">
            Build intuition for <span className="hero-accent">Claude</span><br />
            one stack at a time.
          </h1>
          <p className="hero-sub">
            Start with how language models predict tokens, then move through sampling,
            prompting, APIs, and tool use. Each lesson adds one more layer of practical
            understanding so the whole system starts to click.
          </p>
          <div className="hero-actions">
            <Link to="/lesson/what-is-an-llm" className="btn btn-primary">
              Begin the path →
            </Link>
            <a href="#path" className="btn">See the roadmap</a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">06</span>
              <span className="stat-label">Live lessons</span>
            </div>
            <div className="stat">
              <span className="stat-num">5+</span>
              <span className="stat-label">Interactive concepts</span>
            </div>
            <div className="stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Growing weekly</span>
            </div>
          </div>
        </div>
      </section>

      <section className="course-flow">
        <div className="container">
          <div className="course-flow-card">
            <div className="course-flow-intro">
              <span className="eyebrow">How the course flows</span>
              <h2>Each lesson builds a clearer mental model.</h2>
            </div>
            <div className="course-flow-grid">
              <article className="flow-card">
                <h3>1. Learn the idea</h3>
                <p>Start with the core concept in plain language before touching any code or tooling.</p>
              </article>
              <article className="flow-card">
                <h3>2. Try the demo</h3>
                <p>Use the interactive example to make the idea concrete and easy to remember.</p>
              </article>
              <article className="flow-card">
                <h3>3. Connect the next step</h3>
                <p>Finish each lesson with a stronger sense of where the next concept fits in the bigger picture.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <ProgressTracker />

      <section className="learning-path" id="path">
        <div className="container">
          <div className="path-intro">
            <span className="eyebrow">Follow the path</span>
            <h2 className="lessons-heading">Study it stack by stack</h2>
            <p className="path-copy">
              Every lesson builds on the last one. Learn the core idea, then apply it in a
              live demo, and finish with the confidence to build with Claude in your own apps.
            </p>
          </div>

          <div className="path-list">
            {lessons.map((lesson, index) => {
              const isLive = lesson.status === 'live'
              return (
                <div
                  key={lesson.slug}
                  className={`path-step ${isLive ? 'path-step-live' : 'path-step-soon'}`}
                >
                  <div className="path-step-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="path-step-body">
                    <div className="path-step-top">
                      <h3>{lesson.title}</h3>
                      <span className={`path-step-badge ${isLive ? 'badge-live' : 'badge-soon'}`}>
                        {isLive ? 'Live' : 'Coming soon'}
                      </span>
                    </div>
                    <p>{lesson.summary}</p>
                    {isLive ? (
                      <Link to={`/lesson/${lesson.slug}`} className="path-step-link">
                        Open lesson →
                      </Link>
                    ) : (
                      <span className="path-step-link path-step-link-soon">Coming soon</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="lessons" id="lessons">
        <div className="container">
          <span className="eyebrow">Choose your next lesson</span>
          <h2 className="lessons-heading">Pick the concept you want to explore next</h2>

          <div className="lesson-grid">
            <Link to="/cheatsheet" className={`lesson-card accent-amber is-live cheatsheet-card`}>
              <div className="lesson-card-visual">
                <img src="/images/cheatsheet_full.png" alt="Cheat sheet" />
              </div>
              <div className="lesson-card-top">
                <span className="lesson-number">CS</span>
                <span className={`lesson-badge badge-live`}>Revision</span>
              </div>
              <h3 className="lesson-title">Cheat sheet</h3>
              <p className="lesson-summary">All AI terms from the course in one searchable place for quick revision.</p>
              <div className="lesson-meta">
                <span>All levels</span>
                <span className="dot" aria-hidden="true">·</span>
                <span>Revision</span>
                <span className="lesson-go">Open →</span>
              </div>
            </Link>
            {lessons.map((lesson) => {
              const isLive = lesson.status === 'live'
              const Card = isLive ? Link : 'div'
              const props = isLive
                ? { to: `/lesson/${lesson.slug}` }
                : {}
              return (
                <Card
                  key={lesson.slug}
                  className={`lesson-card accent-${lesson.accent} ${isLive ? 'is-live' : 'is-soon'}`}
                  {...props}
                >
                  {lesson.image && (
                    <div className="lesson-card-visual">
                      <img src={lesson.image} alt="" />
                    </div>
                  )}
                  <div className="lesson-card-top">
                    <span className="lesson-number">{lesson.number}</span>
                    <span className={`lesson-badge ${isLive ? 'badge-live' : 'badge-soon'}`}>
                      {isLive ? 'Live' : 'Coming soon'}
                    </span>
                  </div>
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <p className="lesson-summary">{lesson.summary}</p>
                  <div className="lesson-meta">
                    <span>{lesson.level}</span>
                    <span className="dot" aria-hidden="true">·</span>
                    <span>{lesson.duration}</span>
                    {isLive && <span className="lesson-go">Open →</span>}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
