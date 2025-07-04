import React from 'react'

const Header = () => {
  return (
    <header className="header">
      <a href="/" className="logo-container">
        {/* Logo horizontal para desktop */}
        <img 
          src="/images/logos/netbridge-logo-horizontal.png" 
          alt="NetBridge.Dev" 
          className="logo-horizontal"
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
    </header>
  )
}

export default Header

