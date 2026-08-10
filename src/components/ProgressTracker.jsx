import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.js'
import './ProgressTracker.css'

const STORAGE_KEY = 'claude-school-progress'
const LAST_LESSON_KEY = 'claude-school-last-lesson'
const STREAK_KEY = 'claude-school-streak'

function getTodayKey() {
  return new Date().toLocaleDateString('en-CA')
}

function getYesterdayKey() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toLocaleDateString('en-CA')
}

export default function ProgressTracker() {
  const [completed, setCompleted] = useState([])
  const [lastLessonSlug, setLastLessonSlug] = useState('')
  const [streak, setStreak] = useState({ count: 0, lastVisitDate: '' })

  useEffect(() => {
    try {
      const savedCompleted = window.localStorage.getItem(STORAGE_KEY)
      if (savedCompleted) {
        const parsedCompleted = JSON.parse(savedCompleted)
        if (Array.isArray(parsedCompleted)) {
          setCompleted(parsedCompleted)
        }
      }

      const savedLastLesson = window.localStorage.getItem(LAST_LESSON_KEY)
      if (savedLastLesson) {
        setLastLessonSlug(savedLastLesson)
      }

      const savedStreak = window.localStorage.getItem(STREAK_KEY)
      if (savedStreak) {
        const parsedStreak = JSON.parse(savedStreak)
        if (parsedStreak?.count && parsedStreak?.lastVisitDate) {
          setStreak(parsedStreak)
          return
        }
      }
    } catch {
      // Ignore malformed storage and continue with empty defaults.
    }

    const today = getTodayKey()
    const nextStreak = {
      count: 1,
      lastVisitDate: today
    }
    setStreak(nextStreak)
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(nextStreak))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  useEffect(() => {
    if (!lastLessonSlug) {
      return
    }
    window.localStorage.setItem(LAST_LESSON_KEY, lastLessonSlug)
  }, [lastLessonSlug])

  useEffect(() => {
    const today = getTodayKey()
    if (streak.lastVisitDate === today) {
      return
    }

    const nextStreak =
      streak.lastVisitDate === getYesterdayKey()
        ? { count: streak.count + 1, lastVisitDate: today }
        : { count: 1, lastVisitDate: today }

    setStreak(nextStreak)
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(nextStreak))
  }, [streak.count, streak.lastVisitDate])

  const completedCount = completed.length
  const progressPercent = Math.round((completedCount / lessons.length) * 100)

  const nextLesson = useMemo(() => {
    return lessons.find((lesson) => !completed.includes(lesson.slug)) || lessons[0]
  }, [completed])

  const currentLesson = useMemo(() => {
    return lessons.find((lesson) => lesson.slug === lastLessonSlug) || nextLesson
  }, [lastLessonSlug, nextLesson])

  const badges = useMemo(() => {
    const list = []
    if (completedCount >= 1) {
      list.push({ label: 'First Steps', tone: 'amber' })
    }
    if (streak.count >= 3 || completedCount >= 3) {
      list.push({ label: 'Momentum', tone: 'cyan' })
    }
    if (streak.count >= 7 || completedCount >= 5) {
      list.push({ label: 'On a Roll', tone: 'violet' })
    }
    return list
  }, [completedCount, streak.count])

  const toggleLesson = (slug) => {
    setCompleted((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    )
    setLastLessonSlug(slug)
  }

  return (
    <section className="progress-tracker">
      <div className="container">
        <div className="progress-card">
          <div className="progress-summary">
            <div>
              <span className="eyebrow">Your study progress</span>
              <h2 className="progress-title">Keep your learning streak alive</h2>
              <p className="progress-copy">
                Mark lessons as complete as you go. The tracker remembers your progress so you can
                pick up where you left off.
              </p>
            </div>
            <div
              className="progress-ring"
              aria-label={`${progressPercent}% complete`}
              style={{ background: `conic-gradient(var(--amber) ${progressPercent}%, rgba(255,255,255,0.08) 0)` }}
            >
              <span>{progressPercent}%</span>
            </div>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="progress-badges" aria-label="streak badges">
            <span className="progress-badge progress-badge-streak">🔥 {streak.count}-day streak</span>
            {badges.map((badge) => (
              <span key={badge.label} className={`progress-badge progress-badge-${badge.tone}`}>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="progress-meta">
            <div>
              <strong>{completedCount}</strong> of {lessons.length} lessons completed
            </div>
            <div className="progress-actions">
              {currentLesson && (
                <Link to={`/lesson/${currentLesson.slug}`} className="progress-next-link">
                  Resume from {currentLesson.title} →
                </Link>
              )}
              {nextLesson && (
                <Link to={`/lesson/${nextLesson.slug}`} className="progress-next-link progress-next-link-secondary">
                  Continue with {nextLesson.title} →
                </Link>
              )}
            </div>
          </div>

          <div className="progress-current-card">
            <div>
              <span className="eyebrow">Current focus</span>
              <h3>{currentLesson.title}</h3>
              <p>{currentLesson.summary}</p>
            </div>
            <Link to={`/lesson/${currentLesson.slug}`} className="progress-open-link">
              Open lesson →
            </Link>
          </div>

          <div className="progress-lesson-list">
            {lessons.map((lesson) => {
              const isDone = completed.includes(lesson.slug)
              const isCurrent = lesson.slug === currentLesson.slug
              return (
                <div
                  key={lesson.slug}
                  className={`progress-lesson ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                >
                  <div>
                    <div className="progress-lesson-title">{lesson.title}</div>
                    <div className="progress-lesson-meta">{lesson.level} · {lesson.duration}</div>
                  </div>
                  <button type="button" className="progress-toggle" onClick={() => toggleLesson(lesson.slug)}>
                    {isDone ? 'Undo' : 'Done'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
