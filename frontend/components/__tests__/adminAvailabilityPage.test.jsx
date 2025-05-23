import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Availability from '../../app/admin/availability/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('Admin Availability Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockRooms = [
    {
      id: 1,
      numero_habitacion: '101',
      tipo_habitacion: 'Suite',
      precio: 150,
      estado: true,
      descripcion: 'Habitación de lujo'
    },
    {
      id: 2,
      numero_habitacion: '102',
      tipo_habitacion: 'Doble',
      precio: 100,
      estado: true,
      descripcion: 'Habitación doble'
    }
  ];

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    localStorage.getItem.mockReturnValue('mock-token');
    fetch.mockClear();
  });

  it('redirige al login si no hay token', () => {
    localStorage.getItem.mockReturnValue(null);
    render(<Availability />);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('renderiza el título principal y el banner', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);
    
    await waitFor(() => {
      expect(screen.getByText('Habitaciones Disponibles')).toBeInTheDocument();
      expect(screen.getByAltText('Hotel Banner')).toBeInTheDocument();
    });
  });

  it('carga y muestra las habitaciones disponibles correctamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);

    await waitFor(() => {
      expect(screen.getByText('Habitación 101')).toBeInTheDocument();
      expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      expect(screen.getByText('Suite')).toBeInTheDocument();
      expect(screen.getByText('Doble')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de carga mientras se obtienen las habitaciones', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<Availability />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla la carga de habitaciones', async () => {
    fetch.mockRejectedValueOnce(new Error('Error de conexión'));

    render(<Availability />);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
    });
  });

  it('abre el modal al hacer clic en una habitación', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);

    const roomCard = await screen.findByText('Habitación 101');
    fireEvent.click(roomCard);

    await waitFor(() => {
      expect(screen.getByText('Detalles de la Habitación')).toBeInTheDocument();
    });
  });

  it('cierra el modal al hacer clic en el botón de cerrar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);

    const roomCard = await screen.findByText('Habitación 101');
    fireEvent.click(roomCard);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Detalles de la Habitación')).not.toBeInTheDocument();
    });
  });

  it('actualiza el estado de una habitación correctamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<Availability />);

    const roomCard = await screen.findByText('Habitación 101');
    fireEvent.click(roomCard);

    const changeStatusButton = screen.getByRole('button', { name: /cambiar estado/i });
    fireEvent.click(changeStatusButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habitaciones/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      );
    });
  });

  it('navega al login al hacer clic en cerrar sesión', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);

    const logoutButton = await screen.findByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('renderiza todos los enlaces de navegación en el sidebar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Availability />);

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Check-in')).toBeInTheDocument();
      expect(screen.getByText('Check-out')).toBeInTheDocument();
      expect(screen.getByText('Habitaciones')).toBeInTheDocument();
      expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
      expect(screen.getByText('Configuraciones')).toBeInTheDocument();
    });
  });
}); 