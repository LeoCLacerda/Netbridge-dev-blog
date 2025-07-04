import React from 'react'

const LoadingSpinner = ({ text = "Carregando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          {/* Ícone customizado de loading */}
          <img 
            src="/images/icons/loading-spinner.png" 
            alt="Carregando"
            className="loading-icon-custom"
            onError={(e) => {
              // Fallback para spinner CSS se a imagem falhar
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'block'
            }}
          />
          {/* Spinner CSS como fallback */}
          <div className="loading-spinner-fallback" style={{display: 'none'}}></div>
        </div>
        <div className="loading-text">{text}</div>
      </div>
    </div>
  )
}

export default LoadingSpinner

