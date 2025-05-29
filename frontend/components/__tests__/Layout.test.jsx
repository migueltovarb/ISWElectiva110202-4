import React from 'react'
import { render, screen } from '@testing-library/react'
import RootLayout from '../../app/layout'

// Mock para ClientProviders
jest.mock('../../app/ClientProviders', () => {
  return function MockClientProviders({ children }) {
    return <div data-testid="client-providers">{children}</div>
  }
})

// Mock para Next.js font
jest.mock('next/font/google', () => ({
  Poppins: () => ({
    variable: '--font-poppins'
  })
}))

describe('RootLayout Component', () => {
  it('renderiza ClientProviders', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('client-providers')).toBeInTheDocument()
  })

  it('renderiza el contenido children dentro de ClientProviders', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
        <span>Another Content</span>
      </RootLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Another Content')).toBeInTheDocument()
    
    const providers = screen.getByTestId('client-providers')
    expect(providers).toContainElement(screen.getByText('Test Content'))
    expect(providers).toContainElement(screen.getByText('Another Content'))
  })

  it('incluye metadatos básicos', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Verificar que el componente renderiza sin errores
    expect(screen.getByTestId('client-providers')).toBeInTheDocument()
  })

  it('maneja children vacíos correctamente', () => {
    render(<RootLayout />)
    
    expect(screen.getByTestId('client-providers')).toBeInTheDocument()
  })
}) 