import React from 'react'
import { Users, Target, Award, Lightbulb } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1 className="page-title">Sobre a NetBridge.Dev</h1>
      <p className="page-subtitle">Conectando ideias à realidade através da tecnologia</p>
      
      <div className="about-content">
        <div className="about-intro">
          <p className="page-text">
            A NetBridge.Dev nasceu da paixão por criar soluções tecnológicas que fazem a diferença. 
            Somos uma empresa especializada em desenvolvimento de aplicações modernas, focada em 
            entregar valor real através de código limpo, arquiteturas robustas e experiências 
            excepcionais para o usuário.
          </p>
        </div>
        
        <div className="about-values">
          <div className="value-card">
            <Target className="value-icon" />
            <h3 className="value-title">Nossa Missão</h3>
            <p className="value-description">
              Transformar ideias em soluções digitais inovadoras, utilizando as melhores 
              práticas de desenvolvimento e as tecnologias mais modernas do mercado.
            </p>
          </div>
          
          <div className="value-card">
            <Lightbulb className="value-icon" />
            <h3 className="value-title">Nossa Visão</h3>
            <p className="value-description">
              Ser referência em desenvolvimento .NET e React, criando pontes entre 
              necessidades complexas e soluções elegantes e eficientes.
            </p>
          </div>
          
          <div className="value-card">
            <Award className="value-icon" />
            <h3 className="value-title">Nossos Valores</h3>
            <p className="value-description">
              Excelência técnica, transparência, inovação contínua e compromisso 
              com a satisfação do cliente em cada projeto que desenvolvemos.
            </p>
          </div>
          
          <div className="value-card">
            <Users className="value-icon" />
            <h3 className="value-title">Nossa Equipe</h3>
            <p className="value-description">
              Profissionais experientes e apaixonados por tecnologia, sempre 
              atualizados com as últimas tendências e melhores práticas do mercado.
            </p>
          </div>
        </div>
        
        <div className="about-tech">
          <h3 className="section-title">Tecnologias que Dominamos</h3>
          <div className="tech-grid">
            <div className="tech-category">
              <h4 className="tech-category-title">Backend</h4>
              <ul className="tech-list">
                <li>.NET 8+</li>
                <li>ASP.NET Core</li>
                <li>Azure Functions</li>
                <li>Entity Framework</li>
                <li>SQL Server / PostgreSQL</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h4 className="tech-category-title">Frontend</h4>
              <ul className="tech-list">
                <li>React 18+</li>
                <li>TypeScript</li>
                <li>Next.js</li>
                <li>Tailwind CSS</li>
                <li>Vite</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h4 className="tech-category-title">Cloud & DevOps</h4>
              <ul className="tech-list">
                <li>Microsoft Azure</li>
                <li>Azure Static Web Apps</li>
                <li>Azure DevOps</li>
                <li>Docker</li>
                <li>CI/CD Pipelines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

