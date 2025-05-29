import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientProviders from '../ClientProviders'

// Mock para NotificationContext
jest.mock('../NotificationContext', () => ({
  NotificationProvider: ({ children }) => <div data-testid="notification-provider">{children}</div>
}))

// Mock para ToastNotification
jest.mock('../ToastNotification', () => {
  return function MockToastNotification() {
    return <div data-testid="toast-notification">Toast Component</div>
  }
})

describe('ClientProviders Component', () => {
  it('renderiza el NotificationProvider', () => {
    render(
      <ClientProviders>
        <div>Test Content</div>
      </ClientProviders>
    )
    expect(screen.getByTestId('notification-provider')).toBeInTheDocument()
  })

  it('renderiza el ToastNotification', () => {
    render(
      <ClientProviders>
        <div>Test Content</div>
      </ClientProviders>
    )
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument()
  })

  it('renderiza el contenido children correctamente', () => {
    render(
      <ClientProviders>
        <div>Test Content</div>
        <span>Another Element</span>
      </ClientProviders>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Another Element')).toBeInTheDocument()
  })

  it('estructura los providers en el orden correcto', () => {
    const { container } = render(
      <ClientProviders>
        <div>Content</div>
      </ClientProviders>
    )
    
    const provider = screen.getByTestId('notification-provider')
    const toast = screen.getByTestId('toast-notification')
    const content = screen.getByText('Content')
    
    // Verificar que el provider contiene tanto el toast como el content
    expect(provider).toContainElement(toast)
    expect(provider).toContainElement(content)
  })
}) 