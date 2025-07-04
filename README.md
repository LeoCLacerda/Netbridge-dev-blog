# NetBridge.Dev - Website React

## Visão Geral

Este é o projeto do site da NetBridge.Dev, desenvolvido em React com design moderno e preparado para integração com Azure Functions. O site apresenta um tema escuro com gradientes azuis, navegação dinâmica e sistema de blog preparado para backend.

## Características Implementadas

### ✅ Design e Layout
- **Tema**: Gradiente preto para azul escuro (#000000 → #1a1a2e → #16213e)
- **Layout**: Sidebar 25% + Conteúdo principal 75%
- **Bordas**: Bordas redondas (12px) em todos os componentes
- **Tipografia**: Font Inter com gradientes azuis nos títulos
- **Responsividade**: Layout adaptativo para mobile e desktop

### ✅ Navegação
- **Sidebar fixa** com 3 botões principais:
  - Contact (ícone de email)
  - .NET Blog (ícone de livro)
  - About (ícone de usuário)
- **Transições suaves** entre páginas (fade-in/fade-out)
- **Estados visuais** para botão ativo e hover

### ✅ Páginas Implementadas

#### 1. Welcome (Página Inicial)
- Apresentação da empresa
- Grid de 3 features principais
- Call-to-action para outras seções

#### 2. Contact
- Informações de contato (email, telefone, localização)
- Botão para envio de email direto
- Preparado para formulário de contato via Azure Functions

#### 3. About
- História e valores da empresa
- Missão, visão e equipe
- Grid de tecnologias utilizadas

#### 4. Blog (Preparado para Azure Functions)
- Lista de posts com preview
- Visualização individual de posts
- Sidebar com "Últimos Posts"
- Sistema de comentários com modal
- Estrutura preparada para API integration

### ✅ Animações e Interações
- **Loading spinner** inicial (2 segundos)
- **Fade-in sequencial** dos elementos (header → sidebar → conteúdo)
- **Transições suaves** entre páginas (300ms)
- **Hover effects** em todos os elementos interativos
- **Loading específico** para carregamento do blog

## Estrutura do Projeto

```
netbridge-dev/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainContent.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── CommentModal.jsx
│   │   └── pages/
│   │       ├── WelcomePage.jsx
│   │       ├── ContactPage.jsx
│   │       ├── AboutPage.jsx
│   │       ├── BlogPage.jsx
│   │       └── BlogPost.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── demo.html (versão estática para demonstração)
├── package.json
├── vite.config.js
└── README.md
```

## Tecnologias Utilizadas

- **React 19+** - Framework frontend
- **Vite** - Build tool e dev server
- **Lucide React** - Ícones SVG
- **CSS3** - Estilização com gradientes e animações
- **JavaScript ES6+** - Lógica da aplicação

## Preparação para Azure Functions

### Endpoints Preparados

O projeto está estruturado para integração com os seguintes endpoints do Azure Functions:

#### 1. Blog API
```javascript
// GET /api/posts - Listar todos os posts
// GET /api/posts/{id} - Obter post específico
// GET /api/posts/recent - Últimos 10 posts

// Estrutura esperada do post:
{
  id: number,
  title: string,
  description: string,
  content: string,
  date: string,
  author: string
}
```

#### 2. Comments API
```javascript
// POST /api/comments - Criar novo comentário
// GET /api/comments/{postId} - Obter comentários do post

// Estrutura do comentário:
{
  name: string,
  email: string,
  message: string,
  postId: number
}
```

#### 3. Contact API
```javascript
// POST /api/contact - Enviar mensagem de contato

// Estrutura da mensagem:
{
  name: string,
  email: string,
  subject: string,
  message: string
}
```

### Pontos de Integração

#### 1. App.jsx - Linha 25-45
```javascript
// Substituir simulação por chamadas reais da API
const loadBlogData = async () => {
  try {
    const [postsResponse, recentResponse] = await Promise.all([
      fetch('/api/posts'),
      fetch('/api/posts/recent')
    ]);
    
    const posts = await postsResponse.json();
    const recent = await recentResponse.json();
    
    setBlogData({ posts, lastPosts: recent });
  } catch (error) {
    console.error('Erro ao carregar blog:', error);
  }
};
```

#### 2. CommentModal.jsx - Linha 35-45
```javascript
// Integrar envio de comentários
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, postId: currentPostId })
    });
    
    if (response.ok) {
      // Sucesso
      onSubmit(formData);
    }
  } catch (error) {
    console.error('Erro ao enviar comentário:', error);
  }
};
```

#### 3. ContactPage.jsx
```javascript
// Adicionar formulário de contato integrado
const handleContactSubmit = async (formData) => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      // Mostrar mensagem de sucesso
    }
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
  }
};
```

## Como Executar

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acessar:** http://localhost:5173

### Build para Produção

1. **Gerar build:**
```bash
npm run build
```

2. **Preview do build:**
```bash
npm run preview
```

### Deploy no Azure Static Web Apps

1. **Configurar Azure Static Web Apps**
2. **Conectar repositório GitHub**
3. **Configurar build settings:**
   - App location: `/`
   - Api location: `api` (para Azure Functions)
   - Output location: `dist`

## Próximos Passos

### 1. Integração com Azure Functions
- [ ] Criar Azure Functions para blog, comentários e contato
- [ ] Configurar CORS para permitir requisições do frontend
- [ ] Implementar autenticação se necessário
- [ ] Configurar banco de dados (Azure SQL ou Cosmos DB)

### 2. Melhorias Futuras
- [ ] Sistema de busca no blog
- [ ] Paginação de posts
- [ ] Sistema de tags/categorias
- [ ] Newsletter signup
- [ ] Analytics integration
- [ ] SEO optimization

### 3. Testes
- [ ] Testes unitários com Jest
- [ ] Testes de integração
- [ ] Testes E2E com Playwright

## Suporte

Para dúvidas sobre o projeto, entre em contato:
- Email: contato@netbridge.dev
- Documentação: Este README.md

---

**NetBridge.Dev** - Conectando tecnologias, construindo o futuro

