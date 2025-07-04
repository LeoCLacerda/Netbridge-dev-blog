import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('welcome')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [blogData, setBlogData] = useState(null)
  const [isLoadingBlog, setIsLoadingBlog] = useState(false)

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Função para navegar entre páginas
  const navigateToPage = async (page) => {
    if (page === currentPage) return

    setIsTransitioning(true)
    
    // Se for blog, carregar dados da Azure Function
    if (page === 'blog' && !blogData) {
      setIsLoadingBlog(true)
      try {
        const response = await fetch('/api/PostsFunction') // Chamada para a Azure Function
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setBlogData(data)
      } catch (error) {
        console.error('Erro ao carregar dados do blog:', error)
        // Pode-se adicionar um estado de erro para exibir na UI
      } finally {
        setIsLoadingBlog(false)
      }
    }

    setTimeout(() => {
      setCurrentPage(page)
      setIsTransitioning(false)
    }, 300)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={navigateToPage}
            isTransitioning={isTransitioning}
          />
          <MainContent 
            currentPage={currentPage}
            isTransitioning={isTransitioning}
            blogData={blogData}
            isLoadingBlog={isLoadingBlog}
            onNavigate={navigateToPage}
          />
        </div>
      </div>
    </Router>
  )
}

export default App


