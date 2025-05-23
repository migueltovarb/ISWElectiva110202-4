import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notificaciones from '../../app/admin/notificaciones/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('Admin Notificaciones Page', () => {
  const mockRouter = { push: jest.fn() };
  let getItemSpy, setItemSpy, removeItemSpy;
  let confirmSpy;

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mock-token');
    setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});
    removeItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(() => {});
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  it('renderiza el título y el banner', () => {
    render(<Notificaciones />);
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByAltText('Hotel Banner')).toBeInTheDocument();
  });

  it('renderiza todas las notificaciones con título, mensaje y fecha', () => {
    render(<Notificaciones />);
    expect(screen.getByText('Nueva reservación')).toBeInTheDocument();
    expect(screen.getByText('Se ha realizado una nueva reservación para la habitación 101')).toBeInTheDocument();
    expect(screen.getByText('2024-01-29 10:30')).toBeInTheDocument();
    expect(screen.getByText('Check-out pendiente')).toBeInTheDocument();
    expect(screen.getByText('Recordatorio: Check-out pendiente en la habitación 205')).toBeInTheDocument();
    expect(screen.getByText('2024-01-29 09:15')).toBeInTheDocument();
    expect(screen.getByText('Mantenimiento completado')).toBeInTheDocument();
    expect(screen.getByText('El mantenimiento de la habitación 304 ha sido completado')).toBeInTheDocument();
    expect(screen.getByText('2024-01-28 16:45')).toBeInTheDocument();
  });

  it('marca una notificación como leída al hacer clic', () => {
    render(<Notificaciones />);
    const noti = screen.getByText('Nueva reservación').closest('div');
    expect(noti).toHaveClass('bg-[#FFDAB9]');
    fireEvent.click(noti);
    // El fondo debe cambiar (ya no debe tener la clase de no leído)
    expect(noti).not.toHaveClass('bg-[#FFDAB9]');
  });

  it('elimina una notificación al hacer clic en el botón de eliminar', () => {
    render(<Notificaciones />);
    const deleteButtons = screen.getAllByRole('button');
    // El primer botón de eliminar corresponde a la primera notificación
    fireEvent.click(deleteButtons[0]);
    expect(screen.queryByText('Nueva reservación')).not.toBeInTheDocument();
  });

  it('renderiza todos los enlaces de navegación en el sidebar', () => {
    render(<Notificaciones />);
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

  it('navega al login al hacer clic en cerrar sesión', () => {
    render(<Notificaciones />);
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('muestra el icono de eliminar en cada notificación', () => {
    render(<Notificaciones />);
    const trashIcons = screen.getAllByTestId('icon-trash');
    expect(trashIcons.length).toBeGreaterThan(0);
  });
}); 