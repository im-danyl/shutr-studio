import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import StyleLibrary from './pages/StyleLibrary'
import Generate from './pages/Generate'
import Results from './pages/Results'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/styles" element={<StyleLibrary />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/results/:id" element={<Results />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App