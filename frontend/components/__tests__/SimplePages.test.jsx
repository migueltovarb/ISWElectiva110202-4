import React from 'react'
import { render } from '@testing-library/react'

// Mocks globales para todas las páginas
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  redirect: jest.fn()
}))

jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, style, ...props }) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/link', () => {
  return ({ children, href, className }) => {
    return <a href={href} className={className}>{children}</a>
  }
})

jest.mock('react-calendar', () => {
  return function MockCalendar(props) {
    return <div data-testid="calendar">Calendar Component</div>
  }
})

jest.mock('../../components/NotificationContext', () => ({
  useNotification: () => ({
    addNotification: jest.fn(),
    unreadCount: 0,
    notifications: [],
    toasts: []
  })
}))

// Mock para todas las librerías de iconos
jest.mock('react-icons/fa', () => ({
  FaHome: () => <span data-testid="icon-home">🏠</span>,
  FaSignInAlt: () => <span data-testid="icon-signin">📥</span>,
  FaSignOutAlt: () => <span data-testid="icon-signout">📤</span>,
  FaBed: () => <span data-testid="icon-bed">🛏️</span>,
  FaUsers: () => <span data-testid="icon-users">👥</span>,
  FaCheckCircle: () => <span data-testid="icon-check">✓</span>,
  FaTimesCircle: () => <span data-testid="icon-times">✗</span>,
  FaTools: () => <span data-testid="icon-tools">🔧</span>,
  FaBell: () => <span data-testid="icon-bell">🔔</span>,
  FaCog: () => <span data-testid="icon-cog">⚙️</span>,
  FaPowerOff: () => <span data-testid="icon-power">⏻</span>,
  FaCalendarAlt: () => <span data-testid="icon-calendar">📅</span>,
  FaDollarSign: () => <span data-testid="icon-dollar">💲</span>,
  FaCreditCard: () => <span data-testid="icon-credit">💳</span>,
  FaMoneyBillWave: () => <span data-testid="icon-money">💵</span>,
  FaReceipt: () => <span data-testid="icon-receipt">🧾</span>,
  FaUser: () => <span data-testid="icon-user">👤</span>,
  FaLock: () => <span data-testid="icon-lock">🔒</span>,
  FaBellSlash: () => <span data-testid="icon-bell-slash">🔕</span>,
  FaMapMarkerAlt: () => <span data-testid="icon-map">📍</span>,
  FaMoneyBill: () => <span data-testid="icon-money-bill">💵</span>,
}))

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="lucide-calendar">📅</span>,
  Clock: () => <span data-testid="lucide-clock">🕐</span>,
  User: () => <span data-testid="lucide-user">👤</span>,
  Users: () => <span data-testid="lucide-users">👥</span>,
}))

// Mock fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
)

describe('Simple Pages Rendering Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    if (global.fetch) {
      global.fetch.mockClear()
    }
  })

  describe('Login Page', () => {
    it('renders without crashing', () => {
      const Login = require('../../app/login/page').default
      const { container } = render(<Login />)
      expect(container).toBeTruthy()
    })
  })

  describe('Register Page', () => {
    it('renders without crashing', () => {
      const Register = require('../../app/register/page').default
      const { container } = render(<Register />)
      expect(container).toBeTruthy()
    })
  })

  describe('Admin Availability Page', () => {
    it('renders without crashing', () => {
      const AdminAvailability = require('../../app/admin/availability/page').default
      const { container } = render(<AdminAvailability />)
      expect(container).toBeTruthy()
    })
  })

  describe('Admin Configuraciones Page', () => {
    it('renders without crashing', () => {
      const AdminConfiguraciones = require('../../app/admin/configuraciones/page').default
      const { container } = render(<AdminConfiguraciones />)
      expect(container).toBeTruthy()
    })
  })
}) 