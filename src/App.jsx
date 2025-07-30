import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/styles" 
            element={
              <ProtectedRoute>
                <StyleLibrary />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate" 
            element={
              <ProtectedRoute>
                <Generate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:id" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App