import React, { useState } from 'react'
import { MessageCircle, User, Calendar, Reply } from 'lucide-react'

const CommentsSection = ({ postId, onAddComment }) => {
  // Comentários de exemplo populados
  const [comments] = useState([
    {
      id: 1,
      author: "João Silva",
      email: "joao.silva@email.com",
      date: "2024-12-15T10:30:00Z",
      message: "Excelente artigo! As explicações sobre .NET Core estão muito claras e práticas. Já implementei algumas das técnicas mencionadas no meu projeto e funcionaram perfeitamente.",
      avatar: "JS"
    },
    {
      id: 2,
      author: "Maria Santos",
      email: "maria.santos@empresa.com",
      date: "2024-12-14T15:45:00Z",
      message: "Muito útil! Estava procurando exatamente essas informações sobre Azure Functions. A integração com React ficou muito bem explicada. Parabéns pelo conteúdo!",
      avatar: "MS"
    },
    {
      id: 3,
      author: "Carlos Oliveira",
      email: "carlos.dev@tech.com",
      date: "2024-12-13T09:20:00Z",
      message: "Ótimo post! Gostaria de ver mais conteúdo sobre performance optimization em aplicações .NET. Vocês têm planos de abordar esse tópico?",
      avatar: "CO"
    },
    {
      id: 4,
      author: "Ana Costa",
      email: "ana.costa@startup.io",
      date: "2024-12-12T14:10:00Z",
      message: "Implementei a solução sugerida e reduzi o tempo de resposta da API em 40%. Muito obrigada pela dica sobre caching! 🚀",
      avatar: "AC"
    },
    {
      id: 5,
      author: "Pedro Ferreira",
      email: "pedro.f@devcompany.com",
      date: "2024-12-11T11:55:00Z",
      message: "Conteúdo de qualidade como sempre! A NetBridge.Dev está se tornando minha referência para desenvolvimento .NET. Continuem com o excelente trabalho!",
      avatar: "PF"
    }
  ])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 dia atrás"
    if (diffDays < 7) return `${diffDays} dias atrás`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`
    
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAvatarColor = (author) => {
    const colors = [
      '#4facfe', '#00f2fe', '#667eea', '#764ba2', 
      '#f093fb', '#f5576c', '#4ecdc4', '#44a08d'
    ]
    const index = author.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h3 className="comments-title">
          <MessageCircle size={24} />
          Comentários ({comments.length})
        </h3>
        <button 
          className="add-comment-btn"
          onClick={onAddComment}
        >
          <Reply size={18} />
          Adicionar Comentário
        </button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar" style={{ backgroundColor: getAvatarColor(comment.author) }}>
              {comment.avatar}
            </div>
            
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">
                  <Calendar size={14} />
                  {formatDate(comment.date)}
                </span>
              </div>
              
              <p className="comment-message">{comment.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="comments-note">
        <p>
          <em>
            💡 Os comentários são moderados e processados através do Azure Functions. 
            Novos comentários aparecerão após aprovação.
          </em>
        </p>
      </div>
    </section>
  )
}

export default CommentsSection

