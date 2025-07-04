import React from 'react'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo-container">
          {/* Logo tecnológico wide para desktop */}
          <img 
            src="/images/logos/netbridge-logo-tech-wide.png" 
            alt="NetBridge.Dev" 
            className="logo-tech-wide"
          />
          {/* Logo tecnológico horizontal para tablet */}
          <img 
            src="/images/logos/netbridge-logo-tech-horizontal.png" 
            alt="NetBridge.Dev" 
            className="logo-tech-horizontal"
          />
          {/* Logo ícone para mobile */}
          <img 
            src="/images/logos/netbridge-icon.png" 
            alt="NetBridge.Dev" 
            className="logo-icon"
          />
          {/* Texto como fallback */}
          <span className="logo-text">NetBridge.Dev</span>
        </a>
      </div>
    </header>
  )
}

export default Header

