import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <div className="not-found-card">
          <span className="eyebrow">404</span>
          <h1>That lesson path doesn’t exist yet.</h1>
          <p>
            The page may have moved, or the lesson is still being built. You can head back to
            the learning path or start from the first lesson.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link to="/lesson/what-is-an-llm" className="btn">
              Start lesson 01
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
