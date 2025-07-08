import React, { useState, useRef } from 'react'
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Image, Link, Type, Palette, Save, Eye,
  Undo, Redo, Code, Quote
} from 'lucide-react'

const PublishPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState('')
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Uploaded image" />`
        execCommand('insertHTML', img)
      }
      reader.readAsDataURL(file)
    }
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

  const handleSave = () => {
    const postData = {
      title,
      description,
      content: editorRef.current.innerHTML,
      createdAt: new Date().toISOString(),
      id: Date.now() // Temporary ID
    }
    
    // Simular salvamento (resposta imediata)
    console.log('Post salvo:', postData)
    alert('Post salvo com sucesso! O processamento das imagens será feito em background.')
    
    // Aqui seria feita a chamada para o backend
    // fetch('/api/posts', { method: 'POST', body: JSON.stringify(postData) })
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
          >
            <Eye size={20} />
            {isPreview ? 'Editar' : 'Preview'}
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
          >
            <Save size={20} />
            Publicar
          </button>
        </div>
      </div>

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
              />
            </div>
          </div>

          {/* Toolbar do editor */}
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button onClick={() => execCommand('undo')} title="Desfazer">
                <Undo size={18} />
              </button>
              <button onClick={() => execCommand('redo')} title="Refazer">
                <Redo size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('bold')} title="Negrito">
                <Bold size={18} />
              </button>
              <button onClick={() => execCommand('italic')} title="Itálico">
                <Italic size={18} />
              </button>
              <button onClick={() => execCommand('underline')} title="Sublinhado">
                <Underline size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <select onChange={(e) => changeFontFamily(e.target.value)} className="font-select">
                <option value="">Fonte</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
              </select>

              <select onChange={(e) => changeFontSize(e.target.value)} className="size-select">
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
              />
              <input
                type="color"
                onChange={(e) => changeBackgroundColor(e.target.value)}
                title="Cor de fundo"
                className="color-picker"
              />
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('justifyLeft')} title="Alinhar à esquerda">
                <AlignLeft size={18} />
              </button>
              <button onClick={() => execCommand('justifyCenter')} title="Centralizar">
                <AlignCenter size={18} />
              </button>
              <button onClick={() => execCommand('justifyRight')} title="Alinhar à direita">
                <AlignRight size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={() => execCommand('insertUnorderedList')} title="Lista">
                <List size={18} />
              </button>
              <button onClick={() => execCommand('insertOrderedList')} title="Lista numerada">
                <ListOrdered size={18} />
              </button>
              <button onClick={() => execCommand('formatBlock', 'blockquote')} title="Citação">
                <Quote size={18} />
              </button>
              <button onClick={() => execCommand('formatBlock', 'pre')} title="Código">
                <Code size={18} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={insertImage} title="Inserir imagem">
                <Image size={18} />
              </button>
              <button onClick={insertLink} title="Inserir link">
                <Link size={18} />
              </button>
            </div>
          </div>

          {/* Editor de texto rico */}
          <div className="editor-wrapper">
            <div
              ref={editorRef}
              className="rich-editor"
              contentEditable
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
                outline: 'none'
              }}
              placeholder="Comece a escrever seu post aqui..."
            />
          </div>

          {/* Input oculto para upload de imagens */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
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

