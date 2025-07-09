import React, { useState, useRef } from 'react'
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Image, Link, Type, Palette, Save, Eye,
  Undo, Redo, Code, Quote, Upload, AlertCircle, CheckCircle
} from 'lucide-react'
import { 
  compressImage, 
  validateImageFile, 
  formatFileSize, 
  generateImageId,
  extractImagesFromHTML 
} from '../../utils/imageUtils'

const PublishPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [uploadingImages, setUploadingImages] = useState(new Set())
  const [uploadProgress, setUploadProgress] = useState({})
  const [imageMap, setImageMap] = useState(new Map()) // Mapeia IDs temporários para dados da imagem
  const [isPublishing, setIsPublishing] = useState(false)
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)

  // Funções do editor de texto rico
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current.focus()
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    setSelectedText(selection.toString())
  }

  const insertImage = () => {
    fileInputRef.current.click()
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    
    for (const file of files) {
      // Validar arquivo
      const validation = validateImageFile(file, 5)
      if (!validation.valid) {
        alert(`Erro: ${validation.error}`)
        continue
      }

      const imageId = generateImageId()
      setUploadingImages(prev => new Set([...prev, imageId]))
      setUploadProgress(prev => ({ ...prev, [imageId]: 0 }))

      try {
        // Comprimir imagem
        setUploadProgress(prev => ({ ...prev, [imageId]: 25 }))
        const compressed = await compressImage(file, 5, 0.8)
        
        setUploadProgress(prev => ({ ...prev, [imageId]: 50 }))
        
        // Criar URL temporária para preview
        const tempUrl = compressed.base64
        
        // Salvar dados da imagem
        setImageMap(prev => new Map(prev.set(imageId, {
          id: imageId,
          originalFile: file,
          compressedFile: compressed.file,
          base64: compressed.base64,
          tempUrl: tempUrl,
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          width: compressed.width,
          height: compressed.height,
          name: compressed.name,
          uploaded: false
        })))

        setUploadProgress(prev => ({ ...prev, [imageId]: 75 }))

        // Inserir imagem no editor com controles
        const imgHtml = `
          <div class="image-wrapper" data-image-id="${imageId}" style="position: relative; display: inline-block; margin: 10px 0;">
            <img 
              src="${tempUrl}" 
              alt="${file.name}"
              data-image-id="${imageId}"
              style="max-width: 100%; height: auto; border-radius: 8px; cursor: pointer;"
              onclick="selectImage('${imageId}')"
            />
          </div>
        `
        
        execCommand('insertHTML', imgHtml)
        setUploadProgress(prev => ({ ...prev, [imageId]: 100 }))
        
        // Remover da lista de upload após 1 segundo
        setTimeout(() => {
          setUploadingImages(prev => {
            const newSet = new Set(prev)
            newSet.delete(imageId)
            return newSet
          })
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[imageId]
            return newProgress
          })
        }, 1000)

      } catch (error) {
        console.error('Erro ao processar imagem:', error)
        alert(`Erro ao processar imagem: ${error.message}`)
        setUploadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(imageId)
          return newSet
        })
      }
    }

    // Limpar input
    event.target.value = ''
  }

  const insertLink = () => {
    const url = prompt('Digite a URL do link:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const changeFontSize = (size) => {
    execCommand('fontSize', size)
  }

  const changeFontFamily = (font) => {
    execCommand('fontName', font)
  }

  const changeTextColor = (color) => {
    execCommand('foreColor', color)
  }

  const changeBackgroundColor = (color) => {
    execCommand('backColor', color)
  }

  const uploadImagesToBackend = async (images) => {
    const uploadPromises = images.map(async (imageData) => {
      try {
        const formData = new FormData()
        formData.append('image', imageData.compressedFile)
        formData.append('imageId', imageData.id)
        formData.append('originalName', imageData.name)

        const response = await fetch('/api/UploadImageFunction', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return {
          imageId: imageData.id,
          tempUrl: imageData.tempUrl,
          finalUrl: result.url,
          success: true
        }
      } catch (error) {
        console.error(`Erro ao fazer upload da imagem ${imageData.id}:`, error)
        return {
          imageId: imageData.id,
          tempUrl: imageData.tempUrl,
          finalUrl: imageData.tempUrl, // Manter URL temporária em caso de erro
          success: false,
          error: error.message
        }
      }
    })

    return Promise.all(uploadPromises)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor, digite um título para o post.')
      return
    }

    if (!description.trim()) {
      alert('Por favor, digite uma descrição para o post.')
      return
    }

    if (!editorRef.current.innerHTML.trim() || editorRef.current.innerHTML === '<br>') {
      alert('Por favor, escreva o conteúdo do post.')
      return
    }

    setIsPublishing(true)

    try {
      // Extrair imagens do HTML
      const currentHtml = editorRef.current.innerHTML
      const imagesToUpload = Array.from(imageMap.values()).filter(img => !img.uploaded)

      let finalHtml = currentHtml
      let uploadResults = []

      // Se há imagens para fazer upload
      if (imagesToUpload.length > 0) {
        console.log(`Fazendo upload de ${imagesToUpload.length} imagens...`)
        uploadResults = await uploadImagesToBackend(imagesToUpload)
        
        // Substituir URLs temporárias pelas finais
        uploadResults.forEach(result => {
          if (result.success) {
            finalHtml = finalHtml.replace(
              new RegExp(result.tempUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              result.finalUrl
            )
          }
        })
      }

      // Preparar dados do post
      const postData = {
        title: title.trim(),
        description: description.trim(),
        content: finalHtml,
        createdAt: new Date().toISOString(),
        id: Date.now(),
        images: uploadResults
      }

      // Enviar post para o backend (não bloqueia o frontend)
      fetch('/api/PostsFunction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      }).then(response => {
        if (response.ok) {
          console.log('Post salvo com sucesso no backend')
        } else {
          console.error('Erro ao salvar post no backend')
        }
      }).catch(error => {
        console.error('Erro na comunicação com o backend:', error)
      })

      // Resposta imediata para o usuário
      alert('Post publicado com sucesso! As imagens estão sendo processadas em background.')
      
      // Limpar formulário
      setTitle('')
      setDescription('')
      setContent('')
      editorRef.current.innerHTML = ''
      setImageMap(new Map())

    } catch (error) {
      console.error('Erro ao publicar post:', error)
      alert('Erro ao publicar post. Tente novamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  return (
    <div className="publish-page">
      <div className="publish-header">
        <h1 className="page-title">Publicar Novo Post</h1>
        <div className="publish-actions">
          <button 
            className="preview-btn"
            onClick={togglePreview}
            disabled={isPublishing}
          >
            <Eye size={20} />
            {isPreview ? 'Editar' : 'Preview'}
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={isPublishing || uploadingImages.size > 0}
          >
            {isPublishing ? (
              <>
                <Upload size={20} className="spinning" />
                Publicando...
              </>
            ) : (
              <>
                <Save size={20} />
                Publicar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status de upload */}
      {uploadingImages.size > 0 && (
        <div className="upload-status">
          <h3>Processando imagens...</h3>
          {Array.from(uploadingImages).map(imageId => (
            <div key={imageId} className="upload-item">
              <span>Imagem {imageId.slice(-8)}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress[imageId] || 0}%` }}
                />
              </div>
              <span>{uploadProgress[imageId] || 0}%</span>
            </div>
          ))}
        </div>
      )}

      {!isPreview ? (
        <div className="editor-container">
          {/* Campos básicos */}
          <div className="basic-fields">
            <div className="field-group">
              <label htmlFor="title">Título do Post</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do seu post..."
                className="title-input"
                disabled={isPublishing}
              />
            </div>

            <div className="field-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do post..."
                className="description-input"
                rows="3"
                disabled={isPublishing}
              />
            </div>
          </div>

          {/* Toolbar do editor */}
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button onClick={() => execCommand('undo')} title="Desfazer" disabled={isPublishing}>
                <Undo size={18} />
              </button>
              <button onClick={() => execCommand('redo')} title="Refazer" disabled={isPublishing}>
                <Redo size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('bold')} title="Negrito" disabled={isPublishing}>
                <Bold size={18} />
              </button>
              <button onClick={() => execCommand('italic')} title="Itálico" disabled={isPublishing}>
                <Italic size={18} />
              </button>
              <button onClick={() => execCommand('underline')} title="Sublinhado" disabled={isPublishing}>
                <Underline size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <select 
                onChange={(e) => changeFontFamily(e.target.value)} 
                className="font-select"
                disabled={isPublishing}
              >
                <option value="">Fonte</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
              </select>

              <select 
                onChange={(e) => changeFontSize(e.target.value)} 
                className="size-select"
                disabled={isPublishing}
              >
                <option value="">Tamanho</option>
                <option value="1">Pequeno</option>
                <option value="3">Normal</option>
                <option value="5">Grande</option>
                <option value="7">Muito Grande</option>
              </select>
            </div>

            <div className="toolbar-group">
              <input
                type="color"
                onChange={(e) => changeTextColor(e.target.value)}
                title="Cor do texto"
                className="color-picker"
                disabled={isPublishing}
              />
              <input
                type="color"
                onChange={(e) => changeBackgroundColor(e.target.value)}
                title="Cor de fundo"
                className="color-picker"
                disabled={isPublishing}
              />
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('justifyLeft')} title="Alinhar à esquerda" disabled={isPublishing}>
                <AlignLeft size={18} />
              </button>
              <button onClick={() => execCommand('justifyCenter')} title="Centralizar" disabled={isPublishing}>
                <AlignCenter size={18} />
              </button>
              <button onClick={() => execCommand('justifyRight')} title="Alinhar à direita" disabled={isPublishing}>
                <AlignRight size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('insertUnorderedList')} title="Lista" disabled={isPublishing}>
                <List size={18} />
              </button>
              <button onClick={() => execCommand('insertOrderedList')} title="Lista numerada" disabled={isPublishing}>
                <ListOrdered size={18} />
              </button>
              <button onClick={() => execCommand('formatBlock', 'blockquote')} title="Citação" disabled={isPublishing}>
                <Quote size={18} />
              </button>
              <button onClick={() => execCommand('formatBlock', 'pre')} title="Código" disabled={isPublishing}>
                <Code size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={insertImage} title="Inserir imagem" disabled={isPublishing}>
                <Image size={18} />
              </button>
              <button onClick={insertLink} title="Inserir link" disabled={isPublishing}>
                <Link size={18} />
              </button>
            </div>
          </div>

          {/* Editor de texto rico */}
          <div className="editor-wrapper">
            <div
              ref={editorRef}
              className="rich-editor"
              contentEditable={!isPublishing}
              onInput={(e) => setContent(e.target.innerHTML)}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              suppressContentEditableWarning={true}
              style={{
                minHeight: '400px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                lineHeight: '1.6',
                outline: 'none',
                opacity: isPublishing ? 0.6 : 1
              }}
              placeholder="Comece a escrever seu post aqui..."
            />
          </div>

          {/* Input oculto para upload de imagens */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={isPublishing}
          />
        </div>
      ) : (
        /* Preview do post */
        <div className="preview-container">
          <div className="preview-post">
            <h1 className="preview-title">{title || 'Título do Post'}</h1>
            <p className="preview-description">{description || 'Descrição do post'}</p>
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: content || 'Conteúdo do post aparecerá aqui...' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishPage

