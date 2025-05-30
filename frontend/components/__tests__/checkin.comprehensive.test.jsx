import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckIn from '../../app/check-in/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}));

// Mock environment variable
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000';

// Mock fetch
global.fetch = jest.fn();

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

describe('CheckIn - Comprehensive Testing', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    mockRouter.push.mockClear();
  });

  const mockReservations = [
    {
      id: 1,
      habitacion: { numero_habitacion: '101', tipo_habitacion: 'sencilla' },
      usuario: { username: 'user1', email: 'user1@test.com' },
      fecha_entrada: '2024-12-01',
      fecha_salida: '2024-12-03',
      estado: 'confirmada',
      numero_huespedes: 2,
      precio_total: 200
    },
    {
      id: 2,
      habitacion: { numero_habitacion: '102', tipo_habitacion: 'doble' },
      usuario: { username: 'user2', email: 'user2@test.com' },
      fecha_entrada: '2024-12-01',
      fecha_salida: '2024-12-05',
      estado: 'confirmada',
      numero_huespedes: 3,
      precio_total: 400
    }
  ];

  describe('Authentication and Navigation', () => {
    it('redirige al login cuando no hay token', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(<CheckIn />);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('continúa cuando hay token válido', () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });

      render(<CheckIn />);

      expect(mockRouter.push).not.toHaveBeenCalledWith('/login');
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
    });

    it('muestra estado de carga inicialmente', () => {
      fetch.mockImplementationOnce(() => new Promise(() => {}));

      render(<CheckIn />);

      expect(screen.getByText('Cargando reservas...')).toBeInTheDocument();
    });
  });

  describe('Reservations Loading', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
    });

    it('carga reservas exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });

      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
      });
    });

    it('maneja error HTTP al cargar reservas', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getByText('Error al cargar las reservas')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión al cargar reservas', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });

    it('muestra mensaje cuando no hay reservas', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getByText('No hay reservas para hoy')).toBeInTheDocument();
      });
    });
  });

  describe('Reservation Display', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('muestra información completa de reservas', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.getByText('sencilla')).toBeInTheDocument();
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user1@test.com')).toBeInTheDocument();
        expect(screen.getByText('2 huéspedes')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument();
        expect(screen.getByText('01/12/2024 - 03/12/2024')).toBeInTheDocument();
      });
    });

    it('muestra estado confirmada correctamente', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.getAllByText('Confirmada')).toHaveLength(2);
      });
    });
  });

  describe('Check-in Process', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('realiza check-in exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Check-in realizado' })
      });

      // Mock para recargar reservas después del check-in
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { ...mockReservations[0], estado: 'en_curso' },
          mockReservations[1]
        ]
      });

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/reservas/1/checkin/',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    it('muestra mensaje de éxito tras check-in', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Check-in realizado' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Check-in realizado exitosamente')).toBeInTheDocument();
      });
    });

    it('maneja error HTTP en check-in con detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Reserva ya procesada' })
      });

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Reserva ya procesada')).toBeInTheDocument();
      });
    });

    it('maneja error HTTP en check-in sin detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Error al realizar el check-in')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión en check-in', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('filtra por número de habitación', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: '101' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('filtra por nombre de usuario', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: 'user2' } });
      });

      await waitFor(() => {
        expect(screen.queryByText('Habitación 101')).not.toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      });
    });

    it('filtra por email de usuario', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: 'user1@test.com' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('búsqueda case-insensitive', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: 'USER1' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('muestra todas las reservas cuando search está vacío', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: 'filter' } });
        fireEvent.change(searchInput, { target: { value: '' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      });
    });

    it('muestra mensaje cuando no hay resultados de búsqueda', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: 'no-existe' } });
      });

      await waitFor(() => {
        expect(screen.getByText('No se encontraron reservas')).toBeInTheDocument();
      });
    });
  });

  describe('Status Filter', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { ...mockReservations[0], estado: 'confirmada' },
          { ...mockReservations[1], estado: 'en_curso' }
        ]
      });
    });

    it('filtra por estado confirmada', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const statusFilter = screen.getByLabelText('Filtrar por estado');
        fireEvent.change(statusFilter, { target: { value: 'confirmada' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('filtra por estado en_curso', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const statusFilter = screen.getByLabelText('Filtrar por estado');
        fireEvent.change(statusFilter, { target: { value: 'en_curso' } });
      });

      await waitFor(() => {
        expect(screen.queryByText('Habitación 101')).not.toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      });
    });

    it('muestra todas las reservas con filtro "todas"', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const statusFilter = screen.getByLabelText('Filtrar por estado');
        fireEvent.change(statusFilter, { target: { value: 'confirmada' } });
        fireEvent.change(statusFilter, { target: { value: 'todas' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      });
    });
  });

  describe('Date Filter', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { ...mockReservations[0], fecha_entrada: '2024-12-01' },
          { ...mockReservations[1], fecha_entrada: '2024-12-02' }
        ]
      });
    });

    it('filtra por fecha específica', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const dateFilter = screen.getByLabelText('Filtrar por fecha');
        fireEvent.change(dateFilter, { target: { value: '2024-12-01' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('muestra todas las reservas cuando no hay filtro de fecha', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const dateFilter = screen.getByLabelText('Filtrar por fecha');
        fireEvent.change(dateFilter, { target: { value: '2024-12-01' } });
        fireEvent.change(dateFilter, { target: { value: '' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      });
    });
  });

  describe('Combined Filters', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { ...mockReservations[0], estado: 'confirmada', fecha_entrada: '2024-12-01' },
          { ...mockReservations[1], estado: 'en_curso', fecha_entrada: '2024-12-01' }
        ]
      });
    });

    it('combina filtros de búsqueda y estado', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: '101' } });

        const statusFilter = screen.getByLabelText('Filtrar por estado');
        fireEvent.change(statusFilter, { target: { value: 'confirmada' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Habitación 101')).toBeInTheDocument();
        expect(screen.queryByText('Habitación 102')).not.toBeInTheDocument();
      });
    });

    it('no muestra resultados cuando filtros no coinciden', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por habitación o usuario...');
        fireEvent.change(searchInput, { target: { value: '101' } });

        const statusFilter = screen.getByLabelText('Filtrar por estado');
        fireEvent.change(statusFilter, { target: { value: 'en_curso' } });
      });

      await waitFor(() => {
        expect(screen.getByText('No se encontraron reservas')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh Functionality', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('recarga reservas automáticamente cada 30 segundos', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockReservations
      });

      render(<CheckIn />);

      // Avanzar 30 segundos
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2); // Carga inicial + recarga automática
      });
    });
  });

  describe('Navigation and Logout', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('navega al login al hacer logout', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        const logoutButton = screen.getByText('Cerrar Sesión');
        fireEvent.click(logoutButton);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('Error Message Display', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('oculta mensaje de error después de tiempo', async () => {
      jest.useFakeTimers();

      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        fireEvent.click(checkinButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });

      // Avanzar el tiempo para que se oculte el mensaje
      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText('Error de conexión con el servidor')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Conditional Rendering', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });
    });

    it('no muestra mensajes cuando no hay error ni success', async () => {
      render(<CheckIn />);

      await waitFor(() => {
        expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
        expect(screen.queryByText(/exitosamente/)).not.toBeInTheDocument();
      });
    });

    it('muestra check-in button solo para reservas confirmadas', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { ...mockReservations[0], estado: 'confirmada' },
          { ...mockReservations[1], estado: 'en_curso' }
        ]
      });

      render(<CheckIn />);

      await waitFor(() => {
        const checkinButtons = screen.getAllByText('Check-in');
        expect(checkinButtons).toHaveLength(1); // Solo para la confirmada
      });
    });
  });
}); 