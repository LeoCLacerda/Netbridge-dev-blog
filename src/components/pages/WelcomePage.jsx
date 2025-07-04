import React from 'react'
import { Code, Zap, Globe } from 'lucide-react'

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h1 className="page-title">Bem-vindo à NetBridge.Dev</h1>
      <p className="page-subtitle">Conectando tecnologias, construindo o futuro</p>
      
      <div className="welcome-content">
        <p className="page-text">
          Somos especialistas em desenvolvimento de soluções modernas utilizando as mais 
          avançadas tecnologias .NET e React. Nossa missão é criar pontes entre ideias 
          inovadoras and implementações robustas.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <Code className="feature-icon" />
            <h3 className="feature-title">Desenvolvimento .NET</h3>
            <p className="feature-description">
              Soluções backend robustas e escaláveis com as mais recentes versões do .NET
            </p>
          </div>
          
          <div className="feature-card">
            <Zap className="feature-icon" />
            <h3 className="feature-title">Azure Functions</h3>
            <p className="feature-description">
              Arquiteturas serverless eficientes para máxima performance e economia
            </p>
          </div>
          
          <div className="feature-card">
            <Globe className="feature-icon" />
            <h3 className="feature-title">Frontend Moderno</h3>
            <p className="feature-description">
              Interfaces responsivas e interativas com React e tecnologias modernas
            </p>
          </div>
        </div>
        
        <div className="cta-section">
          <p className="page-text">
            Explore nosso blog para conhecer as últimas tendências em desenvolvimento, 
            entre em contato para discutir seu próximo projeto, ou saiba mais sobre 
            nossa equipe e metodologia.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage

