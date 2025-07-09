// Utilitários para processamento de imagens

/**
 * Comprime uma imagem mantendo a qualidade
 * @param {File} file - Arquivo de imagem
 * @param {number} maxSizeMB - Tamanho máximo em MB (padrão: 5MB)
 * @param {number} quality - Qualidade da compressão (0-1, padrão: 0.8)
 * @returns {Promise<{file: Blob, base64: string, originalSize: number, compressedSize: number}>}
 */
export const compressImage = (file, maxSizeMB = 5, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo deve ser uma imagem'))
      return
    }

    // Verificar tamanho máximo
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      reject(new Error(`Imagem deve ter no máximo ${maxSizeMB}MB`))
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calcular dimensões mantendo proporção
      let { width, height } = calculateDimensions(img.width, img.height, 1920) // Max width 1920px

      canvas.width = width
      canvas.height = height

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height)

      // Converter para blob com compressão
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Erro ao comprimir imagem'))
            return
          }

          // Converter para base64
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              file: blob,
              base64: reader.result,
              originalSize: file.size,
              compressedSize: blob.size,
              width: width,
              height: height,
              name: file.name,
              type: blob.type
            })
          }
          reader.onerror = () => reject(new Error('Erro ao converter para base64'))
          reader.readAsDataURL(blob)
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calcula dimensões mantendo proporção
 * @param {number} originalWidth 
 * @param {number} originalHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns {{width: number, height: number}}
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth = 1920, maxHeight = 1080) => {
  let width = originalWidth
  let height = originalHeight

  // Se a imagem for maior que o máximo, redimensionar
  if (width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }

  return { width: Math.round(width), height: Math.round(height) }
}

/**
 * Valida arquivo de imagem
 * @param {File} file 
 * @param {number} maxSizeMB 
 * @returns {{valid: boolean, error?: string}}
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  // Verificar se é arquivo
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' }
  }

  // Verificar tipo
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Arquivo deve ser uma imagem' }
  }

  // Verificar formatos suportados
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use JPEG, PNG, GIF ou WebP' }
  }

  // Verificar tamanho
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Imagem deve ter no máximo ${maxSizeMB}MB` }
  }

  return { valid: true }
}

/**
 * Formata tamanho de arquivo
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Gera ID único para imagem
 * @returns {string}
 */
export const generateImageId = () => {
  return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Extrai imagens do HTML
 * @param {string} html 
 * @returns {Array<{id: string, src: string, alt: string}>}
 */
export const extractImagesFromHTML = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const images = doc.querySelectorAll('img')
  
  return Array.from(images).map(img => ({
    id: img.dataset.imageId || generateImageId(),
    src: img.src,
    alt: img.alt || '',
    width: img.style.width || '100%',
    float: img.style.float || 'none'
  }))
}

/**
 * Substitui URLs de imagens no HTML
 * @param {string} html 
 * @param {Object} urlMap - Mapa de URL antiga -> URL nova
 * @returns {string}
 */
export const replaceImageUrls = (html, urlMap) => {
  let updatedHtml = html
  
  Object.entries(urlMap).forEach(([oldUrl, newUrl]) => {
    const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    updatedHtml = updatedHtml.replace(regex, newUrl)
  })
  
  return updatedHtml
}

/**
 * Cria preview de imagem
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Erro ao criar preview'))
    reader.readAsDataURL(file)
  })
}

