// app/login/__tests__/page.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from '../../app/login/page';


describe('Login Page', () => {
  it('renderiza el título del hotel', () => {
    render(<Login />)
    expect(screen.getByText('HOTEL LINDO SUEÑO')).toBeInTheDocument()
  })

  it('renderiza los campos de entrada de usuario y contraseña', () => {
    render(<Login />)
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
  })

  it('renderiza el botón de iniciar sesión', () => {
    render(<Login />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })
})
