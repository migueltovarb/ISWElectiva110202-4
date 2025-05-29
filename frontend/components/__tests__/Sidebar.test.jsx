import React from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from '../Sidebar'

// Mock para Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, className }) => {
    return <a href={href} className={className}>{children}</a>
  }
})

describe('Sidebar Component', () => {
  const menuItems = [
    "Home", "Reservas", "Check in", "Check out", 
    "Pagos", "Notificaciones", "Reportes", "Configuraciones"
  ]

  it('renderiza el título del hotel', () => {
    render(<Sidebar />)
    expect(screen.getByText('Hotel Lindo Sueño')).toBeInTheDocument()
  })

  it('renderiza todos los elementos del menú', () => {
    render(<Sidebar />)
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('aplica clase activa cuando activeItem coincide', () => {
    render(<Sidebar activeItem="Home" />)
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('bg-orange-700', 'text-white', 'font-medium')
  })

  it('aplica clase inactiva cuando activeItem no coincide', () => {
    render(<Sidebar activeItem="Home" />)
    const reservasLink = screen.getByText('Reservas')
    expect(reservasLink).toHaveClass('bg-amber-100', 'text-amber-900')
  })

  it('genera los enlaces correctos para cada elemento del menú', () => {
    render(<Sidebar />)
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/admin/home')
    expect(screen.getByText('Reservas').closest('a')).toHaveAttribute('href', '/admin/reservas')
    expect(screen.getByText('Notificaciones').closest('a')).toHaveAttribute('href', '/admin/notificaciones')
  })

  it('renderiza sin activeItem (caso por defecto)', () => {
    render(<Sidebar />)
    // Todos los elementos deben tener la clase inactiva
    menuItems.forEach(item => {
      const link = screen.getByText(item)
      expect(link).toHaveClass('bg-amber-100', 'text-amber-900')
    })
  })
}) 