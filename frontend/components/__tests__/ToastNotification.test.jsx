import React from 'react'
import { render, screen } from '@testing-library/react'
import ToastNotification from '../ToastNotification'

// Mock para el contexto de notificaciones
jest.mock('../NotificationContext', () => ({
  useNotification: jest.fn()
}))

// Mock para react-icons
jest.mock('react-icons/fa', () => ({
  FaCheckCircle: () => <span data-testid="success-icon">✓</span>,
  FaInfoCircle: () => <span data-testid="info-icon">i</span>,
  FaExclamationCircle: () => <span data-testid="warning-icon">!</span>
}))

const { useNotification } = require('../NotificationContext')

describe('ToastNotification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('no renderiza nada cuando no hay toasts', () => {
    useNotification.mockReturnValue({ toasts: [] })
    const { container } = render(<ToastNotification />)
    expect(container.firstChild.children).toHaveLength(0)
  })

  it('renderiza un toast de éxito correctamente', () => {
    useNotification.mockReturnValue({
      toasts: [
        { id: 1, type: 'success', message: 'Operación exitosa' }
      ]
    })
    
    render(<ToastNotification />)
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument()
    expect(screen.getByTestId('success-icon')).toBeInTheDocument()
  })

  it('renderiza un toast de error correctamente', () => {
    useNotification.mockReturnValue({
      toasts: [
        { id: 2, type: 'error', message: 'Error en la operación' }
      ]
    })
    
    render(<ToastNotification />)
    expect(screen.getByText('Error en la operación')).toBeInTheDocument()
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  })

  it('renderiza múltiples toasts', () => {
    useNotification.mockReturnValue({
      toasts: [
        { id: 1, type: 'success', message: 'Éxito 1' },
        { id: 2, type: 'info', message: 'Info 1' },
        { id: 3, type: 'warning', message: 'Advertencia 1' }
      ]
    })
    
    render(<ToastNotification />)
    expect(screen.getByText('Éxito 1')).toBeInTheDocument()
    expect(screen.getByText('Info 1')).toBeInTheDocument()
    expect(screen.getByText('Advertencia 1')).toBeInTheDocument()
  })

  it('aplica las clases CSS correctas para cada tipo', () => {
    useNotification.mockReturnValue({
      toasts: [
        { id: 1, type: 'success', message: 'Éxito' },
        { id: 2, type: 'error', message: 'Error' }
      ]
    })
    
    render(<ToastNotification />)
    const successToast = screen.getByText('Éxito').parentElement
    const errorToast = screen.getByText('Error').parentElement
    
    expect(successToast).toHaveClass('bg-green-600', 'text-white')
    expect(errorToast).toHaveClass('bg-red-600', 'text-white')
  })

  it('usa tipo por defecto (info) para tipos desconocidos', () => {
    useNotification.mockReturnValue({
      toasts: [
        { id: 1, type: 'unknown', message: 'Mensaje desconocido' }
      ]
    })
    
    render(<ToastNotification />)
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()
  })
}) 