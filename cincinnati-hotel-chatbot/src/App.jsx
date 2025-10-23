import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import AdminPage from './pages/AdminPage'

function App() {
  // Load saved page from localStorage, default to 'home'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home'
  })

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'user':
        return <UserPage onNavigate={setCurrentPage} />
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <>
      {renderPage()}
    </>
  )
}

export default App