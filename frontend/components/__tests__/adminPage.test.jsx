import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Admin from '../../app/admin/page';
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

// Mock fetch
global.fetch = jest.fn();

describe('Admin Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
  });

  const mockRooms = [
    {
      id: 1,
      numero_habitacion: '101',
      tipo_habitacion: 'Suite',
      precio: 150,
      estado: true
    },
    {
      id: 2,
      numero_habitacion: '102',
      tipo_habitacion: 'Doble',
      precio: 100,
      estado: false
    }
  ];

  it('renderiza el título principal y la barra lateral', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Admin />);
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de Habitaciones')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Habitaciones')).toBeInTheDocument();
      expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
    });
  });

  it('carga y muestra las habitaciones correctamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByText('Habitación 101')).toBeInTheDocument();
      expect(screen.getByText('Habitación 102')).toBeInTheDocument();
      expect(screen.getByText('Suite')).toBeInTheDocument();
      expect(screen.getByText('Doble')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de carga mientras se obtienen las habitaciones', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<Admin />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla la carga de habitaciones', async () => {
    fetch.mockRejectedValueOnce(new Error('Error de conexión'));

    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
    });
  });

  it('permite agregar una nueva habitación', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<Admin />);

    const addButton = await screen.findByText('Agregar Habitación');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habitaciones/'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String)
        })
      );
    });
  });

  it('permite editar una habitación existente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<Admin />);

    const editButtons = await screen.findAllByText('Editar');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habitaciones/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String)
        })
      );
    });
  });

  it('permite eliminar una habitación', async () => {
    global.confirm = jest.fn(() => true);
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<Admin />);

    const deleteButtons = await screen.findAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habitaciones/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  it('navega al login al hacer clic en cerrar sesión', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms
    });

    render(<Admin />);

    const logoutButton = await screen.findByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
}); 