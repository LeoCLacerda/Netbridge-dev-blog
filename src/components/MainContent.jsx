import React, { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPost from './pages/BlogPost'
import PublishPage from './pages/PublishPage'
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

  const handleSubmitComment = async (commentData) => {
    try {
      const response = await fetch('/api/CommentsFunction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text(); // Ou response.json() se a função retornar JSON
      console.log('Comentário enviado com sucesso:', result);
      alert('Comentário enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setShowCommentModal(false);
    }
  };

  const renderPage = () => {
    if (isLoadingBlog && currentPage === 'blog') {
      return <LoadingSpinner text="Carregando posts do blog..." />
    }

    switch (currentPage) {
      case 'contact':
        return <ContactPage />
      case 'about':
        return <AboutPage />
      case 'publish':
        return <PublishPage />
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


