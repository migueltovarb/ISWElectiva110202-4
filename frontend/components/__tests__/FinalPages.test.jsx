import React from 'react'
import { render } from '@testing-library/react'

// Mocks completos para todas las dependencias
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn()
  }),
  redirect: jest.fn()
}));

jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, fill, priority, ...props }) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

jest.mock('next/link', () => {
  return ({ children, href, className, ...props }) => {
    return <a href={href} className={className} {...props}>{children}</a>;
  };
});

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
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ username: 'test', role: 'guest' }))
}));

// Mock todas las librerías de iconos
jest.mock('react-icons/fa', () => {
  const iconNames = [
    'FaHome', 'FaBed', 'FaSignInAlt', 'FaSignOutAlt', 'FaUsers', 'FaCheckCircle', 
    'FaTimesCircle', 'FaTools', 'FaBell', 'FaCog', 'FaPowerOff', 'FaCalendarAlt',
    'FaDollarSign', 'FaCreditCard', 'FaMoneyBillWave', 'FaReceipt', 'FaUser',
    'FaLock', 'FaBellSlash', 'FaMapMarkerAlt', 'FaMoneyBill', 'FaEdit', 'FaTrash',
    'FaPlus', 'FaSearch', 'FaFilter', 'FaSave', 'FaCancel', 'FaCheck', 'FaEye',
    'FaEyeSlash', 'FaSpinner', 'FaCheckDouble', 'FaExclamationTriangle'
  ];
  
  const mockIcons = {};
  iconNames.forEach(name => {
    mockIcons[name] = () => <span data-testid={`icon-${name.toLowerCase()}`}>{name}</span>;
  });
  
  return mockIcons;
});

// Mock fetch global con múltiples respuestas
global.fetch = jest.fn((url) => {
  if (url.includes('/notificaciones')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, message: 'Test notification', type: 'info', read: false }
      ])
    });
  }
  if (url.includes('/reservas')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, habitacion: '101', fecha: '2024-01-01', estado: 'confirmada' }
      ])
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  });
});

// Mock window objects
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

describe('Final Pages Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (global.fetch) {
      global.fetch.mockClear();
    }
  });

  describe('Check-in Page', () => {
    it('renders without crashing', () => {
      const CheckIn = require('../../app/check-in/page').default;
      const { container } = render(<CheckIn />);
      expect(container).toBeTruthy();
    });
  });

  describe('Check-out Page', () => {
    it('renders without crashing', () => {
      const CheckOut = require('../../app/check-out/page').default;
      const { container } = render(<CheckOut />);
      expect(container).toBeTruthy();
    });
  });

  describe('Notificaciones Page', () => {
    it('renders without crashing', () => {
      const Notificaciones = require('../../app/notificaciones/page').default;
      const { container } = render(<Notificaciones />);
      expect(container).toBeTruthy();
    });
  });

  describe('Configuraciones Page', () => {
    it('renders without crashing', () => {
      const Configuraciones = require('../../app/configuraciones/page').default;
      const { container } = render(<Configuraciones />);
      expect(container).toBeTruthy();
    });
  });

  describe('Admin Notificaciones Page', () => {
    it('renders without crashing', () => {
      const AdminNotificaciones = require('../../app/admin/notificaciones/page').default;
      const { container } = render(<AdminNotificaciones />);
      expect(container).toBeTruthy();
    });
  });
}); 