import React from 'react'
import { render } from '@testing-library/react'

// Mocks completos para las páginas más complejas
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn()
  }),
  redirect: jest.fn()
}))

jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, fill, priority, ...props }) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />
  }
})

jest.mock('next/link', () => {
  return ({ children, href, className, ...props }) => {
    return <a href={href} className={className} {...props}>{children}</a>
  }
})

jest.mock('react-calendar', () => {
  return function MockCalendar(props) {
    return <div data-testid="mock-calendar">Calendar Mock</div>
  }
})

jest.mock('../../components/NotificationContext', () => ({
  useNotification: () => ({
    addNotification: jest.fn(),
    unreadCount: 0,
    notifications: [],
    toasts: [],
    markAllAsRead: jest.fn(),
    removeNotification: jest.fn(),
    clearNotifications: jest.fn()
  })
}))

// Mock para jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ username: 'test', role: 'guest' }))
}))

// Mock todas las librerías de iconos usadas en las páginas grandes
jest.mock('react-icons/fa', () => {
  const iconNames = [
    'FaHome', 'FaBed', 'FaSignInAlt', 'FaSignOutAlt', 'FaUsers', 'FaCheckCircle', 
    'FaTimesCircle', 'FaTools', 'FaBell', 'FaCog', 'FaPowerOff', 'FaCalendarAlt',
    'FaDollarSign', 'FaCreditCard', 'FaMoneyBillWave', 'FaReceipt', 'FaUser',
    'FaLock', 'FaBellSlash', 'FaMapMarkerAlt', 'FaMoneyBill', 'FaEdit', 'FaTrash',
    'FaPlus', 'FaSearch', 'FaFilter', 'FaSave', 'FaCancel', 'FaCheck'
  ];
  
  const mockIcons = {};
  iconNames.forEach(name => {
    mockIcons[name] = () => <span data-testid={`icon-${name.toLowerCase()}`}>{name}</span>;
  });
  
  return mockIcons;
});

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="lucide-calendar">📅</span>,
  Clock: () => <span data-testid="lucide-clock">🕐</span>,
  User: () => <span data-testid="lucide-user">👤</span>,
  Users: () => <span data-testid="lucide-users">👥</span>,
  ChevronLeft: () => <span data-testid="lucide-chevron-left">←</span>,
  ChevronRight: () => <span data-testid="lucide-chevron-right">→</span>,
}))

// Mock fetch global con respuestas detalladas
global.fetch = jest.fn((url) => {
  if (url.includes('/habitaciones')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, numero: '101', tipo: 'simple', estado: 'disponible', precio: 100 }
      ])
    })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
})

// Mock window.alert para evitar errores
global.alert = jest.fn()

describe('Large Pages Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    if (global.fetch) {
      global.fetch.mockClear()
    }
  })

  describe('Home Page (Guest)', () => {
    it('renders without crashing', () => {
      const Home = require('../../app/home/page').default
      const { container } = render(<Home />)
      expect(container).toBeTruthy()
    })
  })

  describe('Reservar Page', () => {
    it('renders without crashing', () => {
      const Reservar = require('../../app/reservar/page').default
      const { container } = render(<Reservar />)
      expect(container).toBeTruthy()
    })
  })

  describe('Admin Habitaciones Page', () => {
    it('renders without crashing', () => {
      const Habitaciones = require('../../app/admin/habitaciones/page').default
      const { container } = render(<Habitaciones />)
      expect(container).toBeTruthy()
    })
  })

  describe('Admin Home Page', () => {
    it('renders without crashing', () => {
      const AdminHome = require('../../app/admin/home/page').default
      const { container } = render(<AdminHome />)
      expect(container).toBeTruthy()
    })
  })

  describe('Pagos Page', () => {
    it('renders without crashing', () => {
      const Pagos = require('../../app/pagos/page').default
      const { container } = render(<Pagos />)
      expect(container).toBeTruthy()
    })
  })
}) 