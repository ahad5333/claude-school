import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-brand">
          Claude<span className="footer-accent">School</span>
        </p>
        <p className="footer-note">
          An open, hands-on guide to how large language models actually work.
          Built while learning.
        </p>
      </div>
    </footer>
  )
}
