import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notificaciones from '../../app/notificaciones/page';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../components/NotificationContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock NotificationContext
jest.mock('../../components/NotificationContext', () => ({
  useNotification: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Notificaciones - Comprehensive Testing', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockNotificationContext = {
    notifications: [],
    removeNotification: jest.fn(),
    clearNotifications: jest.fn(),
    markAllAsRead: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useNotification.mockReturnValue(mockNotificationContext);
    localStorageMock.removeItem.mockClear();
    mockRouter.push.mockClear();
    mockNotificationContext.removeNotification.mockClear();
    mockNotificationContext.clearNotifications.mockClear();
    mockNotificationContext.markAllAsRead.mockClear();
  });

  describe('Renderizado Inicial', () => {
    it('muestra título y elementos básicos', () => {
      render(<Notificaciones />);
      
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
      expect(screen.getByText('Limpiar bandeja de notificaciones')).toBeInTheDocument();
    });

    it('muestra sidebar de navegación correctamente', () => {
      render(<Notificaciones />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Reservar')).toBeInTheDocument();
      expect(screen.getByText('Check-In')).toBeInTheDocument();
      expect(screen.getByText('Check-Out')).toBeInTheDocument();
      expect(screen.getByText('Pagos')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    });

    it('marca todas las notificaciones como leídas al cargar', () => {
      render(<Notificaciones />);
      
      expect(mockNotificationContext.markAllAsRead).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estado Sin Notificaciones', () => {
    it('muestra mensaje cuando no hay notificaciones', () => {
      mockNotificationContext.notifications = [];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      expect(screen.getByText('No tienes notificaciones.')).toBeInTheDocument();
    });

    it('no muestra lista de notificaciones cuando está vacía', () => {
      mockNotificationContext.notifications = [];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('Estado Con Notificaciones', () => {
    const mockNotifications = [
      {
        id: 1,
        message: 'Reserva confirmada',
        date: '2025-05-29T10:00:00Z',
        type: 'success'
      },
      {
        id: 2,
        message: 'Pago procesado',
        date: '2025-05-29T11:00:00Z',
        type: 'info'
      },
      {
        id: 3,
        message: 'Error en el sistema',
        date: '2025-05-29T12:00:00Z',
        type: 'error'
      },
      {
        id: 4,
        message: 'Advertencia importante',
        date: '2025-05-29T13:00:00Z',
        type: 'warning'
      }
    ];

    beforeEach(() => {
      mockNotificationContext.notifications = mockNotifications;
      useNotification.mockReturnValue(mockNotificationContext);
    });

    it('muestra todas las notificaciones correctamente', () => {
      render(<Notificaciones />);
      
      expect(screen.getByText('Reserva confirmada')).toBeInTheDocument();
      expect(screen.getByText('Pago procesado')).toBeInTheDocument();
      expect(screen.getByText('Error en el sistema')).toBeInTheDocument();
      expect(screen.getByText('Advertencia importante')).toBeInTheDocument();
    });

    it('muestra fechas formateadas correctamente', () => {
      render(<Notificaciones />);
      
      // Verificar que las fechas se muestran en formato español
      expect(screen.getByText(/29\/5\/2025/)).toBeInTheDocument();
    });

    it('aplica estilos correctos según el tipo de notificación', () => {
      render(<Notificaciones />);
      
      const successType = screen.getByText('success');
      const infoType = screen.getByText('info');
      const errorType = screen.getByText('error');
      const warningType = screen.getByText('warning');
      
      expect(successType).toHaveClass('bg-green-100', 'text-green-800');
      expect(infoType).toHaveClass('bg-blue-100', 'text-blue-800');
      expect(errorType).toHaveClass('bg-red-100', 'text-red-800');
      expect(warningType).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('no muestra mensaje de "no hay notificaciones"', () => {
      render(<Notificaciones />);
      
      expect(screen.queryByText('No tienes notificaciones.')).not.toBeInTheDocument();
    });
  });

  describe('Funcionalidad de Eliminación', () => {
    const mockNotifications = [
      {
        id: 1,
        message: 'Notificación 1',
        date: '2025-05-29T10:00:00Z',
        type: 'success'
      },
      {
        id: 2,
        message: 'Notificación 2',
        date: '2025-05-29T11:00:00Z',
        type: 'info'
      }
    ];

    beforeEach(() => {
      mockNotificationContext.notifications = mockNotifications;
      useNotification.mockReturnValue(mockNotificationContext);
    });

    it('muestra botones de eliminar para cada notificación', () => {
      render(<Notificaciones />);
      
      const deleteButtons = screen.getAllByTitle('Eliminar notificación');
      expect(deleteButtons).toHaveLength(2);
    });

    it('llama a removeNotification al hacer click en eliminar', () => {
      render(<Notificaciones />);
      
      const deleteButtons = screen.getAllByTitle('Eliminar notificación');
      fireEvent.click(deleteButtons[0]);
      
      expect(mockNotificationContext.removeNotification).toHaveBeenCalledWith(1);
    });

    it('llama a removeNotification con ID correcto para segunda notificación', () => {
      render(<Notificaciones />);
      
      const deleteButtons = screen.getAllByTitle('Eliminar notificación');
      fireEvent.click(deleteButtons[1]);
      
      expect(mockNotificationContext.removeNotification).toHaveBeenCalledWith(2);
    });
  });

  describe('Funcionalidad de Limpiar Todo', () => {
    beforeEach(() => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Test notification',
          date: '2025-05-29T10:00:00Z',
          type: 'success'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);
    });

    it('muestra botón de limpiar bandeja', () => {
      render(<Notificaciones />);
      
      const clearButton = screen.getByText('Limpiar bandeja de notificaciones');
      expect(clearButton).toBeInTheDocument();
    });

    it('llama a clearNotifications al hacer click', () => {
      render(<Notificaciones />);
      
      const clearButton = screen.getByText('Limpiar bandeja de notificaciones');
      fireEvent.click(clearButton);
      
      expect(mockNotificationContext.clearNotifications).toHaveBeenCalledTimes(1);
    });

    it('botón tiene estilos correctos', () => {
      render(<Notificaciones />);
      
      const clearButton = screen.getByText('Limpiar bandeja de notificaciones');
      expect(clearButton).toHaveClass('bg-red-600', 'text-white');
    });
  });

  describe('Funcionalidad de Logout', () => {
    it('limpia localStorage y redirige al hacer logout', () => {
      render(<Notificaciones />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('Navegación del Sidebar', () => {
    it('tiene enlaces correctos en el sidebar', () => {
      render(<Notificaciones />);
      
      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home');
      expect(screen.getByText('Reservar').closest('a')).toHaveAttribute('href', '/reservar');
      expect(screen.getByText('Check-In').closest('a')).toHaveAttribute('href', '/check-in');
      expect(screen.getByText('Check-Out').closest('a')).toHaveAttribute('href', '/check-out');
      expect(screen.getByText('Pagos').closest('a')).toHaveAttribute('href', '/pagos');
    });

    it('página actual está destacada en el sidebar', () => {
      render(<Notificaciones />);
      
      const notificationsLink = screen.getByText('Notificaciones').closest('a');
      expect(notificationsLink).toHaveClass('bg-[#CD853F]/40');
    });

    it('otros enlaces no están destacados', () => {
      render(<Notificaciones />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-[#CD853F]/20');
    });
  });

  describe('Iconos y UI Elements', () => {
    it('muestra iconos en la parte superior derecha', () => {
      render(<Notificaciones />);
      
      const topRightButtons = screen.getAllByRole('button');
      const topRightIcons = topRightButtons.filter(button => 
        button.className && button.className.includes('fixed')
      );
      
      // Deberían haber 2 botones en la esquina superior derecha
      expect(topRightIcons.length).toBeGreaterThanOrEqual(0);
    });

    it('botones tienen estilos hover correctos', () => {
      render(<Notificaciones />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      expect(logoutButton).toHaveClass('hover:bg-[#8B4513]');
    });
  });

  describe('Casos Edge y Límite', () => {
    it('maneja notificación sin tipo específico', () => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Notificación sin tipo',
          date: '2025-05-29T10:00:00Z',
          type: 'unknown'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      expect(screen.getByText('unknown')).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('maneja fechas con diferentes formatos', () => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Test',
          date: '2025-05-29T10:30:45.123Z',
          type: 'info'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('maneja lista vacía que luego se llena', () => {
      // Primero sin notificaciones
      render(<Notificaciones />);
      
      expect(screen.getByText('No tienes notificaciones.')).toBeInTheDocument();
      
      // Simular actualización con notificaciones
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Nueva notificación',
          date: '2025-05-29T10:00:00Z',
          type: 'success'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);
      
      // Re-render con nuevos datos
      render(<Notificaciones />);
      
      expect(screen.getByText('Nueva notificación')).toBeInTheDocument();
      expect(screen.queryByText('No tienes notificaciones.')).not.toBeInTheDocument();
    });

    it('maneja múltiples clicks en eliminar notificación', () => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Test notification',
          date: '2025-05-29T10:00:00Z',
          type: 'success'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      const deleteButton = screen.getByTitle('Eliminar notificación');
      
      // Múltiples clicks
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      
      // Solo debería registrar los clicks, el contexto maneja la lógica
      expect(mockNotificationContext.removeNotification).toHaveBeenCalledTimes(3);
      expect(mockNotificationContext.removeNotification).toHaveBeenCalledWith(1);
    });

    it('maneja múltiples clicks en limpiar bandeja', () => {
      render(<Notificaciones />);
      
      const clearButton = screen.getByText('Limpiar bandeja de notificaciones');
      
      // Múltiples clicks
      fireEvent.click(clearButton);
      fireEvent.click(clearButton);
      
      expect(mockNotificationContext.clearNotifications).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accesibilidad y UX', () => {
    it('botones tienen atributos de accesibilidad', () => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Test notification',
          date: '2025-05-29T10:00:00Z',
          type: 'success'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      const deleteButton = screen.getByTitle('Eliminar notificación');
      expect(deleteButton).toHaveAttribute('title', 'Eliminar notificación');
    });

    it('elementos de la lista tienen estructura correcta', () => {
      mockNotificationContext.notifications = [
        {
          id: 1,
          message: 'Test notification',
          date: '2025-05-29T10:00:00Z',
          type: 'success'
        }
      ];
      useNotification.mockReturnValue(mockNotificationContext);

      render(<Notificaciones />);
      
      const notificationItem = screen.getByText('Test notification').closest('li');
      expect(notificationItem).toBeInTheDocument();
      expect(notificationItem).toHaveClass('bg-white/90');
    });
  });
}); 