import React from 'react'
import { useLocation } from 'react-router-dom'
import LandingHeader from './LandingHeader'
import DashboardHeader from './DashboardHeader'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Use LandingHeader for home page, DashboardHeader for all other pages
  const isLandingPage = location.pathname === '/'
  
  return (
    <div className="light min-h-screen">
      {isLandingPage ? <LandingHeader /> : <DashboardHeader />}
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout