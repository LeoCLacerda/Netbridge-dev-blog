import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const ContactPage = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:contato@netbridge.dev?subject=Contato via Website'
  }

  return (
    <div className="contact-page">
      <h1 className="page-title">Entre em Contato</h1>
      <p className="page-subtitle">Vamos conversar sobre seu próximo projeto</p>
      
      <div className="contact-content">
        <p className="page-text">
          Estamos sempre prontos para discutir novas oportunidades e desafios. 
          Entre em contato conosco através dos canais abaixo ou envie um email 
          diretamente para nossa equipe.
        </p>
        
        <div className="contact-info">
          <div className="contact-card">
            <Mail className="contact-icon" />
            <h3 className="contact-title">Email</h3>
            <p className="contact-detail">contato@netbridge.dev</p>
            <button className="contact-button" onClick={handleEmailClick}>
              <Send size={16} />
              Enviar Email
            </button>
          </div>
          
          <div className="contact-card">
            <Phone className="contact-icon" />
            <h3 className="contact-title">Telefone</h3>
            <p className="contact-detail">+55 (11) 9999-9999</p>
            <p className="contact-note">Horário comercial: 9h às 18h</p>
          </div>
          
          <div className="contact-card">
            <MapPin className="contact-icon" />
            <h3 className="contact-title">Localização</h3>
            <p className="contact-detail">São Paulo, SP - Brasil</p>
            <p className="contact-note">Atendimento remoto e presencial</p>
          </div>
        </div>
        
        <div className="contact-form-section">
          <h3 className="section-title">Ou preencha o formulário abaixo:</h3>
          <p className="page-text">
            <em>
              Formulário de contato será integrado com Azure Functions em breve. 
              Por enquanto, utilize o botão "Enviar Email" acima para entrar em contato.
            </em>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage

