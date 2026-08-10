import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import LessonWhatIsLLM from './lessons/WhatIsLLM.jsx'
import LessonTemperature from './lessons/Temperature.jsx'
import LessonPromptEngineering from './lessons/PromptEngineering.jsx'
import LessonClaudeApi from './lessons/ClaudeApi.jsx'
import LessonToolUse from './lessons/ToolUse.jsx'
import LessonRAG from './lessons/RAG.jsx'
import LessonAgents from './lessons/Agents.jsx'
import LessonMcp from './lessons/Mcp.jsx'
import LessonClaudeCode from './lessons/ClaudeCode.jsx'
import LessonMultiAgent from './lessons/MultiAgent.jsx'
import CheatSheet from './pages/CheatSheet.jsx'

function LessonProgressSync() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/lesson/')) {
      const slug = location.pathname.replace('/lesson/', '')
      window.localStorage.setItem('claude-school-last-lesson', slug)
    }
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <>
      <Navbar />
      <LessonProgressSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/what-is-an-llm" element={<LessonWhatIsLLM />} />
        <Route path="/lesson/temperature-and-sampling" element={<LessonTemperature />} />
        <Route path="/lesson/prompt-engineering" element={<LessonPromptEngineering />} />
        <Route path="/lesson/claude-api" element={<LessonClaudeApi />} />
        <Route path="/lesson/tool-use" element={<LessonToolUse />} />
        <Route path="/lesson/rag" element={<LessonRAG />} />
        <Route path="/lesson/agents" element={<LessonAgents />} />
        <Route path="/lesson/mcp" element={<LessonMcp />} />
        <Route path="/lesson/claude-code" element={<LessonClaudeCode />} />
        <Route path="/lesson/multi-agent" element={<LessonMultiAgent />} />
        <Route path="/cheatsheet" element={<CheatSheet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
