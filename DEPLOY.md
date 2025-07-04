# Guia de Deploy - NetBridge.Dev

## Compilação Local

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos para Compilar

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd netbridge-dev
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Execute em desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

4. **Compile para produção:**
```bash
npm run build
# ou
yarn build
```

5. **Teste o build localmente:**
```bash
npm run preview
# ou
yarn preview
```

## Deploy no Azure Static Web Apps

### Método 1: Via GitHub Actions (Recomendado)

1. **Faça push do código para GitHub**

2. **Acesse o Azure Portal:**
   - Vá para "Static Web Apps"
   - Clique em "Create"

3. **Configure o recurso:**
   - Subscription: Sua subscription
   - Resource Group: Crie ou selecione um existente
   - Name: netbridge-dev-site
   - Plan type: Free (para desenvolvimento)
   - Region: East US 2 (ou mais próxima)

4. **Configure o deployment:**
   - Source: GitHub
   - Organization: Sua organização
   - Repository: netbridge-dev
   - Branch: main

5. **Configure build details:**
   - Build Presets: React
   - App location: `/`
   - Api location: `api` (deixe vazio por enquanto)
   - Output location: `dist`

6. **Clique em "Review + create"**

### Método 2: Via Azure CLI

```bash
# Login no Azure
az login

# Criar resource group
az group create --name netbridge-dev-rg --location eastus2

# Criar Static Web App
az staticwebapp create \
  --name netbridge-dev-site \
  --resource-group netbridge-dev-rg \
  --source https://github.com/SEU-USUARIO/netbridge-dev \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### Método 3: Deploy Manual

1. **Compile o projeto:**
```bash
npm run build
```

2. **Instale Azure Static Web Apps CLI:**
```bash
npm install -g @azure/static-web-apps-cli
```

3. **Deploy:**
```bash
swa deploy ./dist --env production
```

## Configuração de Domínio Personalizado

### No Azure Portal:

1. **Acesse sua Static Web App**
2. **Vá para "Custom domains"**
3. **Clique em "Add"**
4. **Configure:**
   - Domain name: netbridge.dev
   - Hostname record type: CNAME
   - Value: seu-site.azurestaticapps.net

### Configuração DNS:

```
CNAME www netbridge-dev-site.azurestaticapps.net
CNAME @ netbridge-dev-site.azurestaticapps.net
```

## Integração com Azure Functions

### Estrutura de Pastas para Full-Stack:

```
netbridge-dev/
├── src/                 # Frontend React
├── api/                 # Azure Functions
│   ├── posts/
│   │   └── index.js
│   ├── comments/
│   │   └── index.js
│   ├── contact/
│   │   └── index.js
│   ├── host.json
│   └── package.json
├── package.json         # Frontend dependencies
└── README.md
```

### Exemplo de Azure Function (api/posts/index.js):

```javascript
const { app } = require('@azure/functions');

app.http('posts', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Posts function processed a request.');

        if (request.method === 'GET') {
            // Retornar lista de posts
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify([
                    {
                        id: 1,
                        title: "Introdução ao .NET 8",
                        description: "Descubra as novidades...",
                        content: "Conteúdo completo...",
                        date: "2024-01-15",
                        author: "NetBridge Team"
                    }
                ])
            };
        }

        if (request.method === 'POST') {
            // Criar novo post
            const post = await request.json();
            // Salvar no banco de dados
            return {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Post criado com sucesso' })
            };
        }
    }
});
```

## Configuração de Banco de Dados

### Azure SQL Database:

```javascript
// api/shared/database.js
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

module.exports = { sql, config };
```

### Variáveis de Ambiente:

No Azure Portal > Static Web Apps > Configuration:

```
DB_SERVER=netbridge-dev-server.database.windows.net
DB_NAME=netbridge-dev-db
DB_USER=netbridge-admin
DB_PASSWORD=SuaSenhaSegura123!
```

## Monitoramento e Analytics

### Application Insights:

```javascript
// src/utils/analytics.js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'SUA-INSTRUMENTATION-KEY'
    }
});

appInsights.loadAppInsights();
export default appInsights;
```

### Google Analytics:

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Problemas Comuns:

1. **Build falha:**
   - Verifique se todas as dependências estão instaladas
   - Confirme que não há erros de TypeScript/ESLint

2. **Deploy falha:**
   - Verifique as configurações de build no Azure
   - Confirme que o output location está correto (`dist`)

3. **API não funciona:**
   - Verifique se as Azure Functions estão na pasta `api/`
   - Confirme que o CORS está configurado corretamente

4. **Domínio personalizado não funciona:**
   - Verifique se os registros DNS estão corretos
   - Aguarde até 48h para propagação DNS

### Logs e Debug:

```bash
# Ver logs do Azure Static Web Apps
az staticwebapp show --name netbridge-dev-site --resource-group netbridge-dev-rg

# Ver logs das Functions
az functionapp log tail --name netbridge-dev-api --resource-group netbridge-dev-rg
```

## Backup e Versionamento

### Estratégia de Backup:
1. **Código:** GitHub (repositório privado)
2. **Banco de dados:** Azure SQL automated backups
3. **Assets:** Azure Storage com geo-redundancy

### Versionamento:
- **main:** Produção
- **develop:** Desenvolvimento
- **feature/*:** Features em desenvolvimento

---

Para suporte técnico: contato@netbridge.dev

