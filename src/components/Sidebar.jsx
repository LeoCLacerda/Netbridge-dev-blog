import React from 'react'
import { Mail, BookOpen, User, Home } from 'lucide-react'

const Sidebar = ({ currentPage, onNavigate, isTransitioning }) => {
  const menuItems = [
    {
      id: 'welcome',
      label: 'Home',
      icon: Home,
      customIcon: '/images/icons/home-icon.png'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      customIcon: '/images/icons/contact-icon.png'
    },
    {
      id: 'blog',
      label: '.NET Blog',
      icon: BookOpen,
      customIcon: '/images/icons/blog-icon.png'
    },
    {
      id: 'about',
      label: 'About',
      icon: User,
      customIcon: '/images/icons/about-icon.png'
    }
  ]

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li 
                key={item.id} 
                className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
              >
                <button
                  className="menu-button"
                  onClick={() => onNavigate(item.id)}
                  disabled={isTransitioning}
                >
                  <div className="menu-icon-container">
                    {/* Ícone customizado */}
                    <img 
                      src={item.customIcon} 
                      alt={item.label}
                      className="menu-icon-custom"
                      onError={(e) => {
                        // Fallback para ícone Lucide se a imagem falhar
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'block'
                      }}
                    />
                    {/* Ícone Lucide como fallback */}
                    <IconComponent className="menu-icon-fallback" style={{display: 'none'}} />
                  </div>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

