import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import PagosPage from '../../app/pagos/page'
import { useNotification } from '../../components/NotificationContext'

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}))

jest.mock('../../components/NotificationContext', () => ({
  useNotification: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ children, href, className, ...props }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
})

jest.mock('react-icons/fa', () => ({
  FaHome: () => <div data-testid="icon-home">🏠</div>,
  FaMapMarkerAlt: () => <div data-testid="icon-marker">📍</div>,
  FaSignOutAlt: () => <div data-testid="icon-signout">🚪</div>,
  FaMoneyBill: () => <div data-testid="icon-money">💰</div>,
  FaBell: () => <div data-testid="icon-bell">🔔</div>,
  FaCog: () => <div data-testid="icon-cog">⚙️</div>,
  FaPowerOff: () => <div data-testid="icon-power">🔌</div>,
  FaCreditCard: () => <div data-testid="icon-credit">💳</div>,
  FaHistory: () => <div data-testid="icon-history">📜</div>,
  FaPlus: () => <div data-testid="icon-plus">➕</div>,
  FaBed: () => <div data-testid="icon-bed">🛏️</div>,
  FaCalendarAlt: () => <div data-testid="icon-calendar">📅</div>,
  FaTimes: () => <div data-testid="icon-times">❌</div>,
}))

global.fetch = jest.fn()
global.alert = jest.fn()
global.confirm = jest.fn()

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000'
  }
})

afterAll(() => {
  process.env = originalEnv
})

describe('🚀 PAGOS PAGE - PROFESSIONAL TESTING', () => {
  let user
  let mockRouter
  let mockAddNotification

  beforeEach(() => {
    user = userEvent.setup()
    
    mockRouter = {
      push: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter)

    mockAddNotification = jest.fn()
    useNotification.mockReturnValue({
      addNotification: mockAddNotification,
    })

    jest.clearAllMocks()
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()
    localStorageMock.removeItem.mockReset()
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    jwtDecode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
      userId: 123,
      username: 'testuser'
    })
  })

  afterEach(() => {
    cleanup()
  })

  describe('🔐 Authentication Tests', () => {
    it('redirects to login when no token is present', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      render(<PagosPage />)
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
      })
    })

    it('redirects to login when token is expired', async () => {
      localStorageMock.getItem.mockReturnValue('expired-token')
      jwtDecode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600,
      })

      render(<PagosPage />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token')
      })
    })

    it('handles logout correctly', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token')
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
      })

      const logoutButton = screen.getByText('Cerrar Sesión')
      await user.click(logoutButton)

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token')
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('🎨 UI Rendering Tests', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        return null
      })
    })

    it('renders payment page title', async () => {
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getAllByText('Pagos')[0]).toBeInTheDocument()
      })
    })

    it('renders no reservations state correctly', async () => {
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getByText('No hay pagos pendientes')).toBeInTheDocument()
        expect(screen.getByText('No tienes ninguna reserva pendiente de pago.')).toBeInTheDocument()
      })
    })
  })

  describe('🏨 Basic Reservation Tests', () => {
    const mockReserva = {
      id: 123,
      habitacion: '101',
      tipo: 'Deluxe',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-01-20',
      noches: 5,
      precio_noche: '150',
      total: '750'
    }

    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'ultima_reserva') return JSON.stringify(mockReserva)
        return null
      })
    })

    it('displays reservation when data exists', async () => {
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getByText('Reserva Confirmada')).toBeInTheDocument()
        expect(screen.getByText('101')).toBeInTheDocument()
        expect(screen.getByText('Deluxe')).toBeInTheDocument()
      })
    })

    it('shows payment buttons', async () => {
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getByText('Cancelar Reserva')).toBeInTheDocument()
        expect(screen.getByText('Proceder al Pago')).toBeInTheDocument()
      })
    })
  })

  describe('💳 Payment Modal Tests', () => {
    const mockReserva = {
      id: 123,
      habitacion: '101',
      tipo: 'Deluxe',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-01-20',
      noches: 5,
      precio_noche: '150',
      total: '750'
    }

    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'ultima_reserva') return JSON.stringify(mockReserva)
        return null
      })
    })

    it('opens payment modal when clicking pay button', async () => {
      render(<PagosPage />)

      await waitFor(() => {
        expect(screen.getByText('Proceder al Pago')).toBeInTheDocument()
      })

      const payButton = screen.getByText('Proceder al Pago')
      await user.click(payButton)

      expect(screen.getByText('Pago con Tarjeta')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument()
    })
  })

  describe('❌ Cancellation Tests', () => {
    const mockReserva = {
      id: 123,
      habitacion: '101',
      tipo: 'Deluxe',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-01-20',
      noches: 5,
      precio_noche: '150',
      total: '750'
    }

    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'ultima_reserva') return JSON.stringify(mockReserva)
        return null
      })
    })

    it('shows confirmation before cancellation', async () => {
      global.confirm.mockReturnValue(false)

      render(<PagosPage />)

      await waitFor(() => {
        const cancelButton = screen.getByText('Cancelar Reserva')
        fireEvent.click(cancelButton)
      })

      expect(global.confirm).toHaveBeenCalledWith('¿Está seguro que desea cancelar esta reserva?')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('cancels reservation when confirmed', async () => {
      global.confirm.mockReturnValue(true)
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      render(<PagosPage />)

      await waitFor(() => {
        const cancelButton = screen.getByText('Cancelar Reserva')
        fireEvent.click(cancelButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/reservas/123/',
          expect.objectContaining({
            method: 'PATCH',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'cancelada' }),
          })
        )
      })
    })
  })

  describe('💰 Payment Processing Tests', () => {
    const mockReserva = {
      id: 123,
      habitacion: '101',
      tipo: 'Deluxe',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-01-20',
      noches: 5,
      precio_noche: '150',
      total: '750'
    }

    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'ultima_reserva') return JSON.stringify(mockReserva)
        return null
      })
    })

    it('processes payment successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      render(<PagosPage />)

      await waitFor(() => {
        const payButton = screen.getByText('Proceder al Pago')
        fireEvent.click(payButton)
      })

      await user.type(screen.getByPlaceholderText('1234 5678 9012 3456'), '1234567890123456')
      await user.type(screen.getByPlaceholderText('MM/AA'), '12/24')
      await user.type(screen.getByPlaceholderText('123'), '123')

      const submitButton = screen.getByRole('button', { name: 'Pagar' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/reservas/123/',
          expect.objectContaining({
            method: 'PATCH',
            headers: {
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'pagada' }),
          })
        )
      })
    })
  })
}) 