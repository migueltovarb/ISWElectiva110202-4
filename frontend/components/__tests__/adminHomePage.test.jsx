import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import AdminHome from '../../app/admin/home/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('Admin Home Page', () => {
  const mockRouter = {
    push: jest.fn()
  };
  let getItemSpy, setItemSpy, removeItemSpy;

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mock-token');
    setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});
    removeItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  it('renderiza el título principal y el banner', () => {
    render(<AdminHome />);
    expect(screen.getByText('Bienvenido, Administrador')).toBeInTheDocument();
    expect(screen.getByAltText('Hotel Banner')).toBeInTheDocument();
  });

  it('muestra las estadísticas correctamente', () => {
    render(<AdminHome />);
    
    // Verificar título de la sección
    expect(screen.getByText('Estado del Hotel')).toBeInTheDocument();
    
    // Verificar estadísticas
    const stats = screen.getAllByText(/^[0-9]+$/);
    expect(stats).toHaveLength(5); // totalRooms, occupiedRooms, checkInsToday, checkOutsToday, availableRooms
  });

  it('muestra la información de disponibilidad correctamente', () => {
    render(<AdminHome />);
    
    // Verificar título de la sección usando getAllByText y verificando que existe al menos uno
    const disponibilidadElements = screen.getAllByText('Disponibilidad');
    expect(disponibilidadElements.length).toBeGreaterThan(0);
    
    // Verificar estadísticas de disponibilidad
    const stats = screen.getAllByText(/^[0-9]+$/);
    expect(stats).toHaveLength(5);
  });

  it('renderiza el calendario de reservas', () => {
    render(<AdminHome />);
    
    // Verificar título de la sección
    expect(screen.getByText('Calendario de Reservas')).toBeInTheDocument();
    
    // Verificar que el calendario está presente
    const calendar = screen.getByRole('button', { name: /may 2025/i });
    expect(calendar).toBeInTheDocument();
  });

  it('renderiza todos los enlaces de navegación', () => {
    render(<AdminHome />);
    
    const navLinks = [
      'Home',
      'Check-in',
      'Check-out',
      'Habitaciones',
      'Disponibilidad',
      'Notificaciones',
      'Configuraciones'
    ];

    navLinks.forEach(link => {
      const elements = screen.getAllByText(link);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('navega a la página de login al hacer logout', () => {
    render(<AdminHome />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('renderiza los botones de acción en la barra superior', () => {
    render(<AdminHome />);
    
    const actionButtons = screen.getAllByRole('button', { class: /p-3 bg-white rounded-full/ });
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('muestra los iconos correctos para cada estadística', () => {
    render(<AdminHome />);
    
    // Verificar que los iconos están presentes
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('mantiene el estado del calendario', () => {
    render(<AdminHome />);
    
    // Verificar que el calendario muestra el mes y año actual
    const calendar = screen.getByRole('button', { name: /may 2025/i });
    expect(calendar).toBeInTheDocument();
  });
}); 