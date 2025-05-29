// app/rooms/__tests__/page.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import Rooms from '../../app/rooms/page';

jest.mock('../../components/NavItem', () => ({ label }) => <div>{label}</div>)
jest.mock('../../components/RoomCard', () => ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
))

describe('Rooms Page', () => {
  it('renderiza el título principal del hotel', () => {
    render(<Rooms />)
    expect(screen.getByText('Hotel Lindo Sueño')).toBeInTheDocument()
  })

  it('renderiza todos los elementos de navegación', () => {
    const navItems = ['Home', 'Reservas', 'Check in', 'Check out', 'Pagos', 'Notificaciones', 'Reportes', 'Configuraciones']
    render(<Rooms />)
    navItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('renderiza 6 RoomCard con sus títulos', () => {
    render(<Rooms />)
    const roomTitles = [
      'Habitación doble:',
      'Habitación doble:',
      'Habitación sencilla',
      'Habitación sencilla',
      'Habitación triple:',
      'Habitación triple:',
    ]
    roomTitles.forEach(title => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    })
  })
})
