#!/usr/bin/env node

/**
 * Script de configuração para desenvolvimento local
 * Facilita o setup do ambiente de desenvolvimento com Azure Functions
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Configurando ambiente de desenvolvimento NetBridge.Dev...\n')

// Verificar se o Azure Functions Core Tools está instalado
const checkAzureFunctions = () => {
  console.log('📋 Verificando Azure Functions Core Tools...')
  
  try {
    const { execSync } = require('child_process')
    const version = execSync('func --version', { encoding: 'utf8' })
    console.log(`✅ Azure Functions Core Tools encontrado: ${version.trim()}`)
    return true
  } catch (error) {
    console.log('❌ Azure Functions Core Tools não encontrado')
    console.log('📥 Para instalar, execute:')
    console.log('   npm install -g azure-functions-core-tools@4 --unsafe-perm true')
    return false
  }
}

// Verificar se o arquivo .env.local existe
const checkEnvFile = () => {
  console.log('\n📋 Verificando arquivo de configuração...')
  
  const envPath = path.join(__dirname, '..', '.env.local')
  
  if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env.local encontrado')
    return true
  } else {
    console.log('❌ Arquivo .env.local não encontrado')
    console.log('📝 Criando arquivo .env.local...')
    
    const envContent = `# Configuração para desenvolvimento local
VITE_API_BASE_URL=http://localhost:7071
VITE_ENVIRONMENT=development

# Configuração para produção (será sobrescrita no Azure)
# VITE_API_BASE_URL=https://your-function-app.azurewebsites.net
# VITE_ENVIRONMENT=production`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Arquivo .env.local criado')
    return true
  }
}

// Verificar se a pasta api existe
const checkApiFolder = () => {
  console.log('\n📋 Verificando pasta da API...')
  
  const apiPath = path.join(__dirname, '..', 'api')
  
  if (fs.existsSync(apiPath)) {
    console.log('✅ Pasta api/ encontrada')
    return true
  } else {
    console.log('❌ Pasta api/ não encontrada')
    console.log('📁 A pasta api/ deve conter as Azure Functions')
    return false
  }
}

// Mostrar instruções de uso
const showInstructions = () => {
  console.log('\n🎯 Instruções para desenvolvimento:')
  console.log('')
  console.log('1️⃣ Para iniciar as Azure Functions:')
  console.log('   cd api')
  console.log('   func start --cors "*"')
  console.log('')
  console.log('2️⃣ Para iniciar o frontend (em outro terminal):')
  console.log('   npm run dev')
  console.log('')
  console.log('3️⃣ URLs de desenvolvimento:')
  console.log('   Frontend: http://localhost:5173')
  console.log('   API: http://localhost:7071')
  console.log('')
  console.log('💡 Dicas:')
  console.log('   - O frontend automaticamente usará a API local')
  console.log('   - Se a API não estiver rodando, dados mock serão usados')
  console.log('   - CORS está habilitado para desenvolvimento')
  console.log('')
}

// Executar verificações
const main = () => {
  const azureFunctionsOk = checkAzureFunctions()
  const envFileOk = checkEnvFile()
  const apiFolderOk = checkApiFolder()
  
  console.log('\n📊 Resumo da configuração:')
  console.log(`   Azure Functions: ${azureFunctionsOk ? '✅' : '❌'}`)
  console.log(`   Arquivo .env.local: ${envFileOk ? '✅' : '❌'}`)
  console.log(`   Pasta api/: ${apiFolderOk ? '✅' : '❌'}`)
  
  if (azureFunctionsOk && envFileOk && apiFolderOk) {
    console.log('\n🎉 Ambiente configurado com sucesso!')
  } else {
    console.log('\n⚠️  Algumas configurações precisam ser ajustadas')
  }
  
  showInstructions()
}

main()

