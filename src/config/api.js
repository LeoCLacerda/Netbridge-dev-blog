// Configuração da API para desenvolvimento local e produção
const API_CONFIG = {
  // URL base da API (Azure Functions)
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071',
  
  // Ambiente atual
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Endpoints da API
  endpoints: {
    posts: '/api/posts',
    comments: '/api/comments',
    contact: '/api/contact'
  },
  
  // Configurações de timeout
  timeout: 10000,
  
  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Função para fazer chamadas HTTP
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`
  
  const config = {
    method: 'GET',
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...options.headers
    },
    ...options
  }

  try {
    console.log(`[API] ${config.method} ${url}`)
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`[API] Response:`, data)
    
    return data
  } catch (error) {
    console.error(`[API] Error calling ${endpoint}:`, error)
    
    // Em desenvolvimento, retornar dados mock se a API não estiver disponível
    if (API_CONFIG.environment === 'development') {
      console.warn(`[API] Returning mock data for ${endpoint}`)
      return getMockData(endpoint)
    }
    
    throw error
  }
}

// Dados mock para desenvolvimento quando a API não está disponível
const getMockData = (endpoint) => {
  const mockData = {
    '/api/posts': [
      {
        id: 1,
        title: "Introdução ao .NET Core",
        excerpt: "Aprenda os fundamentos do .NET Core e como começar seu primeiro projeto.",
        content: "O .NET Core é uma plataforma de desenvolvimento multiplataforma...",
        author: "NetBridge Team",
        date: "2024-12-15T10:00:00Z",
        tags: [".NET", "Core", "Tutorial"]
      },
      {
        id: 2,
        title: "React com Azure Functions",
        excerpt: "Como integrar uma aplicação React com Azure Functions para criar APIs serverless.",
        content: "A integração entre React e Azure Functions permite criar aplicações modernas...",
        author: "NetBridge Team",
        date: "2024-12-10T14:30:00Z",
        tags: ["React", "Azure", "Serverless"]
      }
    ],
    '/api/comments': [
      {
        id: 1,
        postId: 1,
        author: "João Silva",
        email: "joao@email.com",
        message: "Excelente artigo!",
        date: "2024-12-15T15:00:00Z"
      }
    ]
  }
  
  return mockData[endpoint] || []
}

// Funções específicas para cada endpoint
export const postsAPI = {
  getAll: () => apiCall(API_CONFIG.endpoints.posts),
  getById: (id) => apiCall(`${API_CONFIG.endpoints.posts}/${id}`),
  create: (post) => apiCall(API_CONFIG.endpoints.posts, {
    method: 'POST',
    body: JSON.stringify(post)
  })
}

export const commentsAPI = {
  getByPostId: (postId) => apiCall(`${API_CONFIG.endpoints.comments}?postId=${postId}`),
  create: (comment) => apiCall(API_CONFIG.endpoints.comments, {
    method: 'POST',
    body: JSON.stringify(comment)
  })
}

export const contactAPI = {
  send: (message) => apiCall(API_CONFIG.endpoints.contact, {
    method: 'POST',
    body: JSON.stringify(message)
  })
}

export default API_CONFIG

