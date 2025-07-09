import React, { useState, useRef } from 'react'
import { 
  RotateCcw, RotateCw, Move, Trash2, 
  AlignLeft, AlignCenter, AlignRight,
  Maximize2, Minimize2
} from 'lucide-react'

const ImageController = ({ 
  src, 
  alt, 
  onUpdate, 
  onDelete, 
  initialWidth = 100,
  initialFloat = 'none',
  initialAlign = 'center'
}) => {
  const [width, setWidth] = useState(initialWidth)
  const [float, setFloat] = useState(initialFloat)
  const [align, setAlign] = useState(initialAlign)
  const [isSelected, setIsSelected] = useState(false)
  const imageRef = useRef(null)

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth)
    updateImage({ width: newWidth, float, align })
  }

  const handleFloatChange = (newFloat) => {
    setFloat(newFloat)
    updateImage({ width, float: newFloat, align })
  }

  const handleAlignChange = (newAlign) => {
    setAlign(newAlign)
    updateImage({ width, float, align: newAlign })
  }

  const updateImage = (props) => {
    if (onUpdate) {
      onUpdate({
        src,
        alt,
        ...props
      })
    }
  }

  const getImageStyle = () => {
    const baseStyle = {
      width: `${width}%`,
      height: 'auto',
      borderRadius: '8px',
      margin: '10px 0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: isSelected ? '2px solid #4facfe' : '2px solid transparent',
      boxShadow: isSelected ? '0 0 10px rgba(79, 172, 254, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.3)'
    }

    if (float === 'left') {
      return {
        ...baseStyle,
        float: 'left',
        marginRight: '15px',
        marginLeft: '0'
      }
    } else if (float === 'right') {
      return {
        ...baseStyle,
        float: 'right',
        marginLeft: '15px',
        marginRight: '0'
      }
    } else {
      return {
        ...baseStyle,
        display: 'block',
        margin: '15px auto',
        textAlign: align
      }
    }
  }

  const handleImageClick = (e) => {
    e.preventDefault()
    setIsSelected(!isSelected)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div className="image-controller-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={getImageStyle()}
        onClick={handleImageClick}
        onLoad={() => {
          // Garantir que a imagem seja renderizada corretamente
          if (imageRef.current) {
            imageRef.current.style.maxWidth = '100%'
          }
        }}
      />
      
      {isSelected && (
        <div className="image-controls" style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          gap: '4px',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Controles de largura */}
          <button
            onClick={() => handleWidthChange(Math.max(20, width - 10))}
            style={controlButtonStyle}
            title="Diminuir"
          >
            <Minimize2 size={14} />
          </button>
          
          <span style={{ color: '#fff', fontSize: '12px', padding: '0 4px', alignSelf: 'center' }}>
            {width}%
          </span>
          
          <button
            onClick={() => handleWidthChange(Math.min(100, width + 10))}
            style={controlButtonStyle}
            title="Aumentar"
          >
            <Maximize2 size={14} />
          </button>

          {/* Separador */}
          <div style={{ width: '1px', background: '#333', margin: '0 4px' }} />

          {/* Controles de float */}
          <button
            onClick={() => handleFloatChange('left')}
            style={{
              ...controlButtonStyle,
              background: float === 'left' ? '#4facfe' : 'transparent'
            }}
            title="Float Left"
          >
            <AlignLeft size={14} />
          </button>
          
          <button
            onClick={() => handleFloatChange('none')}
            style={{
              ...controlButtonStyle,
              background: float === 'none' ? '#4facfe' : 'transparent'
            }}
            title="Center"
          >
            <AlignCenter size={14} />
          </button>
          
          <button
            onClick={() => handleFloatChange('right')}
            style={{
              ...controlButtonStyle,
              background: float === 'right' ? '#4facfe' : 'transparent'
            }}
            title="Float Right"
          >
            <AlignRight size={14} />
          </button>

          {/* Separador */}
          <div style={{ width: '1px', background: '#333', margin: '0 4px' }} />

          {/* Deletar */}
          <button
            onClick={handleDelete}
            style={{
              ...controlButtonStyle,
              background: '#ff4757'
            }}
            title="Deletar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Slider de largura quando selecionado */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '8px',
          padding: '8px 12px',
          zIndex: 1000
        }}>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value))}
            style={{
              width: '120px',
              accentColor: '#4facfe'
            }}
          />
        </div>
      )}
    </div>
  )
}

const controlButtonStyle = {
  background: 'transparent',
  border: '1px solid #333',
  borderRadius: '4px',
  color: '#fff',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease'
}

export default ImageController

