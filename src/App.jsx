import { useState, useEffect } from 'react'
import { HashRouter as Router } from 'react-router-dom' // Alterado para HashRouter
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
    
    // Se for blog, carregar dados
    if (page === 'blog' && !blogData) {
      setIsLoadingBlog(true)
      // Simular chamada de API
      setTimeout(() => {
        setBlogData({
          posts: [
            {
              id: 1,
              title: "Introdução ao .NET 8",
              description: "Descubra as novidades e melhorias do .NET 8 para desenvolvimento moderno.",
              content: "O .NET 8 representa um marco significativo no desenvolvimento de aplicações modernas...",
              date: "2024-01-15",
              author: "NetBridge Team"
            },
            {
              id: 2,
              title: "Azure Functions: Serverless Computing",
              description: "Como implementar soluções serverless eficientes com Azure Functions.",
              content: "Azure Functions oferece uma plataforma serverless robusta para desenvolvimento...",
              date: "2024-01-10",
              author: "NetBridge Team"
            },
            {
              id: 3,
              title: "React e .NET: Integração Perfeita",
              description: "Melhores práticas para integrar frontend React com backend .NET.",
              content: "A combinação de React no frontend com .NET no backend oferece...",
              date: "2024-01-05",
              author: "NetBridge Team"
            }
          ],
          lastPosts: Array.from({length: 10}, (_, i) => ({
            id: i + 1,
            title: `Post ${i + 1}`,
            date: `2024-01-${String(15 - i).padStart(2, '0')}`
          }))
        })
        setIsLoadingBlog(false)
      }, 1500)
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


