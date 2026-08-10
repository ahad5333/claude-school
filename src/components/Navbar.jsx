import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-mark" aria-hidden="true" />
          Claude<span className="nav-logo-accent">School</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#lessons">Lessons</a>
          <Link to="/cheatsheet">Cheat sheet</Link>
          <a
            href="https://docs.claude.com"
            target="_blank"
            rel="noreferrer"
            className="nav-cta"
          >
            Claude Docs ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
