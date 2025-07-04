# 🚀 Guia de Desenvolvimento Local - NetBridge.Dev

Este guia explica como configurar e executar o projeto NetBridge.Dev localmente, incluindo a integração com Azure Functions.

## 📋 Pré-requisitos

### Obrigatórios
- **Node.js** 20+ LTS
- **npm** 10+
- **Git**

### Para Azure Functions (Opcional)
- **Azure Functions Core Tools** v4
- **.NET 8 SDK** (para as functions C#)

## 🛠️ Configuração Inicial

### 1. Clone e Instale Dependências
```bash
git clone https://github.com/LeoCLacerda/Netbridge-dev-blog.git
cd Netbridge-dev-blog
npm install
```

### 2. Configure o Ambiente de Desenvolvimento
```bash
npm run dev:setup
```

Este comando irá:
- ✅ Verificar se o Azure Functions Core Tools está instalado
- ✅ Criar o arquivo `.env.local` com as configurações corretas
- ✅ Verificar a estrutura do projeto
- 📋 Mostrar instruções detalhadas

### 3. Instalar Azure Functions Core Tools (se necessário)
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

## 🚀 Executando o Projeto

### Opção 1: Frontend + API (Recomendado)
```bash
# Terminal 1: Iniciar Azure Functions
npm run dev:api

# Terminal 2: Iniciar Frontend
npm run dev:frontend
```

### Opção 2: Apenas Frontend (com dados mock)
```bash
npm run dev
```

### Opção 3: Tudo junto (experimental)
```bash
npm run dev:full
```

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:5173
- **API (Azure Functions)**: http://localhost:7071
- **API Admin**: http://localhost:7071/admin/host/status

## 🔧 Configuração da API

### Arquivo `.env.local`
```env
VITE_API_BASE_URL=http://localhost:7071
VITE_ENVIRONMENT=development
```

### Estrutura da API
```
api/
├── PostsFunction.cs      # Gerenciamento de posts
├── CommentsFunction.cs   # Sistema de comentários
├── host.json            # Configuração do Azure Functions
└── local.settings.json  # Configurações locais (não versionado)
```

## 🎯 Funcionalidades

### ✅ Funcionando Localmente
- ✅ Interface React responsiva
- ✅ Navegação entre páginas
- ✅ Sistema de comentários (frontend)
- ✅ Design responsivo
- ✅ Logo e ícones customizados

### 🔄 Em Desenvolvimento
- 🔄 Integração completa com Azure Functions
- 🔄 Persistência de comentários
- 🔄 Sistema de contato funcional

### 📋 Dados Mock
Quando a API não está disponível, o sistema usa dados mock para:
- Lista de posts do blog
- Comentários de exemplo
- Informações de contato

## 🐛 Solução de Problemas

### Erro: "Azure Functions não encontrado"
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### Erro: "CORS blocked"
Certifique-se de que as Azure Functions estão rodando com CORS habilitado:
```bash
cd api
func start --cors "*"
```

### Erro: "Port 5173 already in use"
```bash
# Matar processo na porta
npx kill-port 5173

# Ou usar porta diferente
npm run dev -- --port 3000
```

### Erro: "Port 7071 already in use"
```bash
# Matar processo na porta
npx kill-port 7071

# Ou verificar se já há uma instância rodando
func start --port 7072
```

## 📁 Estrutura do Projeto

```
Netbridge-dev-blog/
├── src/
│   ├── components/          # Componentes React
│   ├── config/             # Configurações (API, etc)
│   └── main.jsx            # Ponto de entrada
├── public/
│   └── images/             # Assets visuais
├── api/                    # Azure Functions
├── scripts/                # Scripts de desenvolvimento
├── .env.local             # Configurações locais
└── package.json           # Dependências e scripts
```

## 🔄 Workflow de Desenvolvimento

1. **Fazer alterações** no código React ou Azure Functions
2. **Testar localmente** com `npm run dev:full`
3. **Commit e push** para a branch `portal-dev`
4. **Deploy automático** via GitHub Actions para Azure Static Web Apps

## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia apenas o frontend |
| `npm run dev:setup` | Configura ambiente de desenvolvimento |
| `npm run dev:api` | Inicia apenas as Azure Functions |
| `npm run dev:frontend` | Inicia frontend com host 0.0.0.0 |
| `npm run dev:full` | Inicia frontend + API simultaneamente |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build de produção |

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia primeiro
2. Execute `npm run dev:setup` para diagnóstico
3. Consulte os logs do console do navegador
4. Verifique os logs das Azure Functions

---

**NetBridge.Dev** - Conectando tecnologias, construindo o futuro 🌉

