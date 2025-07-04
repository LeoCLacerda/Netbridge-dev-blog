import React from 'react'
import { Calendar, User } from 'lucide-react'

const BlogPage = ({ posts, onPostSelect }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-page">
      <h1 className="page-title">.NET Blog</h1>
      <p className="page-subtitle">Insights, tutoriais e novidades do mundo .NET</p>
      
      <div className="blog-posts">
        {posts.map((post) => (
          <article key={post.id} className="blog-post-card">
            <h2 className="blog-post-title">{post.title}</h2>
            <p className="blog-post-description">{post.description}</p>
            
            <div className="blog-post-meta">
              <div className="post-meta-info">
                <span className="post-meta-item">
                  <User size={16} />
                  {post.author}
                </span>
                <span className="post-meta-item">
                  <Calendar size={16} />
                  {formatDate(post.date)}
                </span>
              </div>
              
              <button 
                className="read-more-btn"
                onClick={() => onPostSelect(post)}
              >
                Ler mais
              </button>
            </div>
          </article>
        ))}
        
        {posts.length === 0 && (
          <div className="no-posts">
            <p className="page-text">
              Nenhum post encontrado. Em breve teremos conteúdo incrível sobre .NET!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage

