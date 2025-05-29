import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Configuraciones from '../../app/admin/configuraciones/page';
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

describe('Configuraciones - Comprehensive Testing', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();
    mockRouter.push.mockClear();
  });

  describe('Authentication and Redirects', () => {
    it('redirige al login cuando no hay token', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(<Configuraciones />);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('redirige al login cuando fetchConfig falla con 401', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token expirado' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });

    it('redirige al login cuando fetchUserInfo falla con 401', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      // Primera llamada exitosa (fetchConfig)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      // Segunda llamada falla con 401 (fetchUserInfo)
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token expirado' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Loading State', () => {
    it('muestra estado de carga inicialmente', () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      fetch.mockImplementationOnce(() => new Promise(() => {}));

      render(<Configuraciones />);

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('Successful Data Loading', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
    });

    it('carga configuraciones y datos de usuario exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '15:00', check_out_time: '11:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('15:00')).toBeInTheDocument();
        expect(screen.getByDisplayValue('11:00')).toBeInTheDocument();
        expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
        expect(screen.getByDisplayValue('admin@hotel.com')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling in Data Loading', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token');
    });

    it('maneja error de fetchConfig sin token', async () => {
      localStorageMock.getItem
        .mockReturnValueOnce('valid-token') // useEffect inicial
        .mockReturnValueOnce(null); // fetchConfig

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('No hay sesión activa. Por favor, inicie sesión nuevamente.')).toBeInTheDocument();
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });

    it('maneja error HTTP en fetchConfig', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Error del servidor' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error del servidor')).toBeInTheDocument();
      });
    });

    it('maneja error HTTP en fetchConfig sin detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error al cargar las configuraciones')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión en fetchConfig', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor. Por favor, intente más tarde.')).toBeInTheDocument();
      });
    });

    it('maneja error de fetchUserInfo sin token', async () => {
      localStorageMock.getItem
        .mockReturnValueOnce('valid-token') // useEffect inicial
        .mockReturnValueOnce('valid-token') // fetchConfig
        .mockReturnValueOnce(null); // fetchUserInfo

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('No hay sesión activa. Por favor, inicie sesión nuevamente.')).toBeInTheDocument();
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    });

    it('maneja error HTTP en fetchUserInfo', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Error en usuario' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error en usuario')).toBeInTheDocument();
      });
    });

    it('maneja error HTTP en fetchUserInfo sin detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      });

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error al cargar la información del usuario')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión en fetchUserInfo', async () => {
      // Solo mockeamos fetchUserInfo para que falle
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
        })
        .mockRejectedValueOnce(new Error('Network error'));

      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.getByText('Error al cargar la información del usuario. Por favor, intente más tarde.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Configuration Form', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });
    });

    it('actualiza campos de configuración correctamente', async () => {
      render(<Configuraciones />);

      await waitFor(() => {
        const checkInInput = screen.getByLabelText('Hora de Check-in');
        fireEvent.change(checkInInput, { target: { value: '15:00' } });
        expect(checkInInput.value).toBe('15:00');

        const checkOutInput = screen.getByLabelText('Hora de Check-out');
        fireEvent.change(checkOutInput, { target: { value: '11:00' } });
        expect(checkOutInput.value).toBe('11:00');
      });
    });

    it('guarda configuraciones exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '15:00', check_out_time: '11:00' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/configuraciones/',
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    it('muestra mensaje de éxito al guardar configuraciones', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '15:00', check_out_time: '11:00' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Cambios guardados exitosamente')).toBeInTheDocument();
      });
    });

    it('maneja error al guardar configuraciones con detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Error específico al guardar' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Error específico al guardar')).toBeInTheDocument();
      });
    });

    it('maneja error al guardar configuraciones sin detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Error al guardar las configuraciones')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión al guardar configuraciones', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('User Profile Form', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });
    });

    it('actualiza campos de usuario correctamente', async () => {
      render(<Configuraciones />);

      await waitFor(() => {
        const usernameInput = screen.getByLabelText('Nombre de Usuario');
        fireEvent.change(usernameInput, { target: { value: 'new_admin' } });
        expect(usernameInput.value).toBe('new_admin');

        const emailInput = screen.getByLabelText('Correo Electrónico');
        fireEvent.change(emailInput, { target: { value: 'new@hotel.com' } });
        expect(emailInput.value).toBe('new@hotel.com');

        const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
        fireEvent.change(currentPasswordInput, { target: { value: 'current123' } });
        expect(currentPasswordInput.value).toBe('current123');

        const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
        fireEvent.change(newPasswordInput, { target: { value: 'new123' } });
        expect(newPasswordInput.value).toBe('new123');

        const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
        fireEvent.change(confirmPasswordInput, { target: { value: 'new123' } });
        expect(confirmPasswordInput.value).toBe('new123');
      });
    });

    it('valida que las contraseñas coincidan', async () => {
      render(<Configuraciones />);

      await waitFor(() => {
        const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
        fireEvent.change(newPasswordInput, { target: { value: 'password123' } });

        const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
        fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });

    it('actualiza perfil exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Perfil actualizado' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/registro/update-profile/',
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              'Authorization': 'Bearer valid-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    it('muestra mensaje de éxito y limpia contraseñas al actualizar perfil', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Perfil actualizado' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        // Llenar campos de contraseña
        const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
        fireEvent.change(currentPasswordInput, { target: { value: 'current123' } });

        const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
        fireEvent.change(newPasswordInput, { target: { value: 'new123' } });

        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Cambios guardados exitosamente')).toBeInTheDocument();
        
        // Verificar que los campos de contraseña se limpiaron
        const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
        const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
        const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
        
        expect(currentPasswordInput.value).toBe('');
        expect(newPasswordInput.value).toBe('');
        expect(confirmPasswordInput.value).toBe('');
      });
    });

    it('maneja error al actualizar perfil con detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Contraseña actual incorrecta' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Contraseña actual incorrecta')).toBeInTheDocument();
      });
    });

    it('maneja error al actualizar perfil sin detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Error al actualizar el perfil')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión al actualizar perfil', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });

    it('permite actualizar perfil sin cambiar contraseña', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Perfil actualizado' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        // Solo cambiar username, sin contraseñas
        const usernameInput = screen.getByLabelText('Nombre de Usuario');
        fireEvent.change(usernameInput, { target: { value: 'new_username' } });

        const form = screen.getByText('Actualizar Perfil').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Cambios guardados exitosamente')).toBeInTheDocument();
      });
    });
  });

  describe('Success Message Auto-hide', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('oculta mensaje de éxito después de 3 segundos', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '15:00', check_out_time: '11:00' })
      });

      render(<Configuraciones />);

      await waitFor(() => {
        const form = screen.getByText('Guardar Horarios').closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Cambios guardados exitosamente')).toBeInTheDocument();
      });

      // Avanzar el tiempo 3 segundos
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(screen.queryByText('Cambios guardados exitosamente')).not.toBeInTheDocument();
      });
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });
    });

    it('cierra sesión y redirige al login', async () => {
      render(<Configuraciones />);

      await waitFor(() => {
        const logoutButton = screen.getByText('Cerrar Sesión');
        fireEvent.click(logoutButton);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('Conditional Rendering', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ check_in_time: '14:00', check_out_time: '12:00' })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: 'admin', email: 'admin@hotel.com' })
      });
    });

    it('no muestra mensajes cuando no hay error ni success', async () => {
      render(<Configuraciones />);

      await waitFor(() => {
        expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
        expect(screen.queryByText('Cambios guardados exitosamente')).not.toBeInTheDocument();
      });
    });
  });
}); 