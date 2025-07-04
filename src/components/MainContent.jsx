import React, { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPost from './pages/BlogPost'
import LoadingSpinner from './LoadingSpinner'
import CommentModal from './CommentModal'

const MainContent = ({ 
  currentPage, 
  isTransitioning, 
  blogData, 
  isLoadingBlog, 
  onNavigate 
}) => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [showCommentModal, setShowCommentModal] = useState(false)

  const handlePostSelect = (post) => {
    setSelectedPost(post)
  }

  const handleBackToBlog = () => {
    setSelectedPost(null)
  }

  const handleShowComments = () => {
    setShowCommentModal(true)
  }

  const handleCloseComments = () => {
    setShowCommentModal(false)
  }

  const handleSubmitComment = (commentData) => {
    // Aqui você integraria com a API do Azure Functions
    console.log('Comentário enviado:', commentData)
    setShowCommentModal(false)
    // Simular feedback de sucesso
    alert('Comentário enviado com sucesso!')
  }

  const renderPage = () => {
    if (isLoadingBlog && currentPage === 'blog') {
      return <LoadingSpinner text="Carregando posts do blog..." />
    }

    switch (currentPage) {
      case 'contact':
        return <ContactPage />
      case 'about':
        return <AboutPage />
      case 'blog':
        if (selectedPost) {
          return (
            <BlogPost 
              post={selectedPost}
              onBack={handleBackToBlog}
              onShowComments={handleShowComments}
              lastPosts={blogData?.lastPosts || []}
              onPostSelect={(postId) => {
                const post = blogData?.posts.find(p => p.id === postId)
                if (post) setSelectedPost(post)
              }}
            />
          )
        }
        return (
          <BlogPage 
            posts={blogData?.posts || []}
            onPostSelect={handlePostSelect}
          />
        )
      default:
        return <WelcomePage />
    }
  }

  return (
    <main className="main-content">
      <div className="content-wrapper">
        <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
          {renderPage()}
        </div>
      </div>
      
      {showCommentModal && (
        <CommentModal 
          onClose={handleCloseComments}
          onSubmit={handleSubmitComment}
        />
      )}
    </main>
  )
}

export default MainContent

