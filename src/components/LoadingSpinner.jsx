import React from 'react'

const LoadingSpinner = ({ text = "Carregando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">{text}</div>
      </div>
    </div>
  )
}

export default LoadingSpinner

