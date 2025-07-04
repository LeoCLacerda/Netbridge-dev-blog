import React from 'react'
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react'

const BlogPost = ({ post, onBack, onShowComments, lastPosts, onPostSelect }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-container">
      <div className="blog-main">
        <div className="blog-post-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            Voltar para o blog
          </button>
        </div>
        
        <article className="blog-post-full">
          <h1 className="page-title">{post.title}</h1>
          
          <div className="post-meta-full">
            <span className="post-meta-item">
              <User size={16} />
              {post.author}
            </span>
            <span className="post-meta-item">
              <Calendar size={16} />
              {formatDate(post.date)}
            </span>
          </div>
          
          <div className="post-content">
            <p className="page-text">{post.content}</p>
            
            {/* Conteúdo expandido do post */}
            <p className="page-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <p className="page-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <h3 className="section-title">Conclusão</h3>
            <p className="page-text">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
          
          <div className="post-actions">
            <button className="comment-button" onClick={onShowComments}>
              <MessageCircle size={20} />
              Deixar um comentário
            </button>
          </div>
        </article>
      </div>
      
      <aside className="blog-sidebar">
        <h3 className="last-posts-title">Últimos Posts</h3>
        <ul className="last-posts-list">
          {lastPosts.map((lastPost) => (
            <li 
              key={lastPost.id} 
              className="last-post-item"
              onClick={() => onPostSelect(lastPost.id)}
            >
              <div className="last-post-title">{lastPost.title}</div>
              <div className="last-post-date">{formatDate(lastPost.date)}</div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default BlogPost

