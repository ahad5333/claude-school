// The single source of truth for every lesson on the site.
// To add a new topic later: add an entry here, create its page component,
// and add one <Route> in App.jsx. The homepage updates automatically.

export const lessons = [
  {
    slug: 'what-is-an-llm',
    number: '01',
    title: 'What is a large language model?',
    summary: 'The core idea behind Claude — predicting the next token, one at a time. Includes a live prediction demo.',
    level: 'Beginner',
    duration: '8 min',
    accent: 'amber',
    status: 'live',
    image: '/images/what-is-an-llm.svg'
  },
  {
    slug: 'temperature-and-sampling',
    number: '02',
    title: 'Temperature and sampling',
    summary: 'How Claude decides which word comes next — with a live demo running the same prompt at three temperatures.',
    level: 'Beginner',
    duration: '7 min',
    accent: 'cyan',
    status: 'live',
    image: '/images/temperature-and-sampling.svg'
  },
  {
    slug: 'prompt-engineering',
    number: '03',
    title: 'Writing great prompts',
    summary: 'The four-part prompt formula, before/after examples, and an interactive prompt builder.',
    level: 'Intermediate',
    duration: '10 min',
    accent: 'violet',
    status: 'live',
    image: '/images/prompt-engineering.svg'
  },
  {
    slug: 'claude-api',
    number: '04',
    title: 'The Claude API',
    summary: 'Call Claude from your own code with Python and JavaScript — with a live playground that runs real requests.',
    level: 'Advanced',
    duration: '12 min',
    accent: 'amber',
    status: 'live',
    image: '/images/claude-api.svg'
  },
  {
    slug: 'tool-use',
    number: '05',
    title: 'Tool use — Claude calls your functions',
    summary: 'The concept that unlocks agents. Claude requests a function, your code runs it, Claude uses the result — with an interactive loop demo.',
    level: 'Advanced',
    duration: '11 min',
    accent: 'teal',
    status: 'live',
    image: '/images/tool-use.svg'
  },
  {
    slug: 'rag',
    number: '06',
    title: 'RAG — giving Claude your own knowledge',
    summary: 'How retrieval-augmented generation lets Claude answer from your documents without stuffing everything into the prompt.',
    level: 'Advanced',
    duration: '10 min',
    accent: 'violet',
    status: 'live',
    image: '/images/rag.svg'
  },
  {
    slug: 'agents',
    number: '07',
    title: 'Building and evaluating AI agents',
    summary: 'How looped tool use becomes a true agent, with a real evaluation mindset and a multi-step demo.',
    level: 'Advanced',
    duration: '12 min',
    accent: 'teal',
    status: 'live',
    image: '/images/agents.png'
  },
  {
    slug: 'mcp',
    number: '09',
    title: 'MCP — the USB-C of AI tools',
    summary: 'How MCP standardizes tool discovery and turns N×M integrations into N+M.',
    level: 'Advanced',
    duration: '9 min',
    accent: 'violet',
    status: 'live',
    image: '/images/mcp.png'
  },
  {
    slug: 'claude-code',
    number: '10',
    title: 'Claude Code mastery',
    summary: 'Five levers for running code safely: permission modes, CLAUDE.md, slash commands, subagents, and MCP.',
    level: 'Advanced',
    duration: '10 min',
    accent: 'amber',
    status: 'live',
    image: '/images/claude-code.png'
  }
]

export const getLesson = (slug) => lessons.find((l) => l.slug === slug)
