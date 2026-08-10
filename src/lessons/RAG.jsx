import { useEffect } from 'react'
import { LessonHeader, Section, Callout, KeyPoints, NextLesson } from '../components/LessonKit.jsx'
import RagDemo from '../components/RagDemo.jsx'
import './RAG.css'

function CodeBlock({ lang, children }) {
  return (
    <div className="cb">
      <span className="cb-lang">{lang}</span>
      <pre className="cb-pre"><code>{children}</code></pre>
    </div>
  )
}

export default function RAG() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <article>
      <LessonHeader
        number="06"
        level="Advanced"
        duration="10 min"
        title="RAG — giving Claude your own knowledge"
        intro="Claude's knowledge is frozen at training time and knows nothing about your private data. RAG fixes that by retrieving only the most relevant chunks before generating an answer."
        image="/images/rag.svg"
      />

      <Section label="The problem" title="You cannot paste everything into the prompt">
        <p>
          The naive fix is to dump every document into the prompt. That breaks quickly. Real document sets are far larger than any context window, and stuffing in irrelevant text makes responses slower, costlier, and less accurate. RAG solves this by finding the few chunks that actually matter and sending only those.
        </p>
      </Section>

      <Section label="See it live" title="Retrieval, then generation">
        <p>
          Below is a small simulated support-docs library. Ask a question and watch the pipeline happen: first, retrieval scores each document by relevance, then only the top matches get sent to Claude for a real answer.
        </p>

        <RagDemo />

        <Callout tone="violet">
          <strong>Notice what Claude never sees:</strong> the documents that scored poorly never reach the prompt at all. That is the whole point of RAG.
        </Callout>
      </Section>

      <Section label="The real pipeline" title="Two phases, different times">
        <p>
          <strong>Ahead of time:</strong> break your documents into chunks, create embeddings, and store them in a vector database.
        </p>
        <p>
          <strong>At question time:</strong> embed the user's question, search for similar chunks, and inject only those into the prompt.
        </p>

        <Callout tone="amber">
          <strong>This is tool use again, wearing a different hat.</strong> Retrieval is a function call that returns relevant chunks, and Claude uses those chunks to answer.
        </Callout>
      </Section>

      <Section label="Your stack" title="pgvector — RAG in a database you know">
        <p>
          A very practical path is pgvector, a PostgreSQL extension that adds vector similarity search to a database you already use.
        </p>

        <CodeBlock lang="sql">{`CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536)
);

SELECT content
FROM documents
ORDER BY embedding <=> '[0.012, -0.034, ...]'
LIMIT 3;`}</CodeBlock>

        <p>
          That <code>&lt;=&gt;</code> operator is cosine distance, where smaller means more similar.
        </p>
      </Section>

      <Section label="Getting chunking right" title="Size matters more than you think">
        <KeyPoints
          points={[
            'Too large a chunk wastes tokens on irrelevant text within it.',
            'Too small a chunk loses the surrounding context the answer needed.',
            'A common starting point is 300-500 tokens per chunk.',
            'Add a little overlap between consecutive chunks so you never slice a sentence in half.'
          ]}
        />
      </Section>

      <Section>
        <NextLesson to={null} title="More advanced lessons coming soon" />
      </Section>
    </article>
  )
}
