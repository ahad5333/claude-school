# ClaudeSchool

A hands-on, interactive guide to how Claude and large language models actually work.
Every concept comes with a live demo you can run in the browser.

Built while learning — each lesson is added as a new topic is understood.

## Tech stack

- **React 18 + Vite** — fast frontend
- **React Router** — page routing
- **Express (Node.js)** — backend that keeps your Anthropic API key server-side
- Design: custom "instrument panel" theme (ink-navy + amber), no framework CSS

## Project structure

```
claude-school/
├── index.html                 # entry HTML, loads fonts
├── package.json
├── vite.config.js             # dev server + /api proxy to backend
├── server/
│   └── index.js               # Express backend (Claude API proxy)
└── src/
    ├── main.jsx               # React root
    ├── App.jsx                # routes
    ├── styles/global.css      # design tokens + base styles
    ├── components/            # reusable UI
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── LessonKit.jsx       # lesson layout primitives (reuse for every topic)
    │   └── TokenPredictor.jsx  # interactive demo for lesson 01
    ├── pages/
    │   └── Home.jsx            # homepage + lesson grid
    └── lessons/
        ├── index.js           # lesson registry — ADD NEW TOPICS HERE
        └── WhatIsLLM.jsx       # lesson 01 content
```

## Run locally

```bash
npm install

# Frontend (http://localhost:5173)
npm run dev

# Backend, in a second terminal (needed from lesson 02 onward)
export ANTHROPIC_API_KEY=sk-ant-...
npm run server
```

## How to add a new lesson

1. Add an entry to `src/lessons/index.js` (set `status: 'live'` when ready).
2. Create the page component in `src/lessons/YourTopic.jsx` using the `LessonKit` primitives.
3. Add one `<Route>` in `src/App.jsx`.

That's it — the homepage grid updates automatically.

## Deploy

- **Frontend** → Vercel or Netlify. Run `npm run build`, deploy the `dist/` folder.
- **Backend** → Railway, Render, or Fly.io. Set `ANTHROPIC_API_KEY` as an environment
  variable there. Point the frontend's `/api` calls at the deployed backend URL.

Never put your API key in frontend code — it always stays on the server.
