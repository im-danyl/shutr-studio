import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import StyleLibrary from './pages/StyleLibrary'
import Generate from './pages/Generate'
import Results from './pages/Results'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Routes with Layout */}
        <Route path="/*" element={
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
        } />
      </Routes>
    </Router>
  )
}

export default App