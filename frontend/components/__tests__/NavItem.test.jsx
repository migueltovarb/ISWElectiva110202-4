// components/__tests__/NavItem.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import NavItem from '../NavItem'

describe('NavItem Component', () => {
  it('debe renderizar correctamente con la propiedad label', () => {
    render(<NavItem label="Home" active={false} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('debe tener la clase correcta cuando está activo', () => {
    render(<NavItem label="Home" active={true} />)
    const item = screen.getByText('Home').parentElement
    expect(item).toHaveClass('bg-amber-700', 'text-white', 'font-bold')
  })

  it('debe tener la clase correcta cuando no está activo', () => {
    render(<NavItem label="Home" active={false} />)
    const item = screen.getByText('Home').parentElement
    expect(item).toHaveClass('bg-amber-100', 'text-amber-950')
  })

  it('aplica el estilo de hover cuando no está activo', () => {
    const { container } = render(<NavItem label="Home" active={false} />)
    const item = container.firstChild
    item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(item).toHaveStyle('background-color: rgb(254, 215, 170)')
  })
})
