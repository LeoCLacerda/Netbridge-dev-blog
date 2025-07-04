import React from 'react'
import { Mail, BookOpen, User } from 'lucide-react'

const Sidebar = ({ currentPage, onNavigate, isTransitioning }) => {
  const menuItems = [
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail
    },
    {
      id: 'blog',
      label: '.NET Blog',
      icon: BookOpen
    },
    {
      id: 'about',
      label: 'About',
      icon: User
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
                  <IconComponent className="menu-icon" />
                  {item.label}
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

