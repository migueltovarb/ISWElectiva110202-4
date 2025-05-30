import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../app/login/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock next/image  
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
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

describe('Login - Comprehensive Testing', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
    localStorageMock.setItem.mockClear();
    mockRouter.push.mockClear();
  });

  describe('Renderizado Inicial', () => {
    it('muestra el formulario de login correctamente', () => {
      render(<Login />);
      
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre de Usuario')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
      expect(screen.getByText('¿No tienes una cuenta?')).toBeInTheDocument();
      expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
    });

    it('no muestra mensajes de error inicialmente', () => {
      render(<Login />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
    });

    it('campos de formulario están vacíos inicialmente', () => {
      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  describe('Interacción con Formulario', () => {
    it('actualiza el campo username correctamente', () => {
      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      
      expect(usernameInput.value).toBe('testuser');
    });

    it('actualiza el campo password correctamente', () => {
      render(<Login />);
      
      const passwordInput = screen.getByLabelText('Contraseña');
      fireEvent.change(passwordInput, { target: { value: 'testpass123' } });
      
      expect(passwordInput.value).toBe('testpass123');
    });

    it('actualiza ambos campos simultáneamente', () => {
      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      
      expect(usernameInput.value).toBe('admin');
      expect(passwordInput.value).toBe('admin123');
    });
  });

  describe('Login Exitoso - Usuarios Diferentes', () => {
    it('redirige superuser a /admin/home correctamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access: 'fake-access-token',
          refresh: 'fake-refresh-token', 
          is_admin: true,
          is_superuser: true
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'superuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/home');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'fake-refresh-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('is_admin', true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('is_superuser', true);
    });

    it('redirige admin regular a /admin/home correctamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access: 'fake-access-token',
          refresh: 'fake-refresh-token',
          is_admin: true,
          is_superuser: false
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/home');
      });
    });

    it('redirige usuario normal a /home correctamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access: 'fake-access-token',
          refresh: 'fake-refresh-token',
          is_admin: false,
          is_superuser: false
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'usuario' } });
      fireEvent.change(passwordInput, { target: { value: 'user123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
      });
    });
  });

  describe('Manejo de Errores HTTP', () => {
    it('muestra error específico del servidor', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          detail: 'Credenciales inválidas'
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
      });
    });

    it('muestra error genérico cuando no hay detail', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión de red', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('Estados de Loading y UI', () => {
    it('muestra estado de loading durante la petición', async () => {
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      fetch.mockReturnValueOnce(promise);

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      // Verificar estado de loading
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Resolver la promesa
      resolvePromise({
        ok: true,
        json: async () => ({
          access: 'token',
          refresh: 'refresh',
          is_admin: false,
          is_superuser: false
        })
      });

      await waitFor(() => {
        expect(screen.queryByText('Iniciando sesión...')).not.toBeInTheDocument();
      });
    });

    it('resetea estado de loading después de error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      });
    });
  });

  describe('Limpieza de Errores', () => {
    it('limpia errores previos al hacer nuevo submit', async () => {
      // Primer intento - error
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });

      // Segundo intento - éxito
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access: 'token',
          refresh: 'refresh',
          is_admin: false,
          is_superuser: false
        })
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Error de conexión con el servidor')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navegación y Enlaces', () => {
    it('tiene enlace correcto a página de registro', () => {
      render(<Login />);
      
      const registerLink = screen.getByText('Regístrate aquí');
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Validación de Formulario', () => {
    it('campos username y password son requeridos', () => {
      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      
      expect(usernameInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('campo password es de tipo password', () => {
      render(<Login />);
      
      const passwordInput = screen.getByLabelText('Contraseña');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Petición HTTP Correcta', () => {
    it('envía datos correctos al endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access: 'token',
          refresh: 'refresh',
          is_admin: false,
          is_superuser: false
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/registro/login/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: 'testuser',
              password: 'testpass'
            }),
          }
        );
      });
    });
  });

  describe('Edge Cases y Casos Límite', () => {
    it('maneja respuesta con JSON inválido', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });

    it('maneja múltiples clicks en el botón', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          access: 'token',
          refresh: 'refresh',
          is_admin: false,
          is_superuser: false
        })
      });

      render(<Login />);
      
      const usernameInput = screen.getByLabelText('Nombre de Usuario');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      
      // Múltiples clicks rápidos
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Solo debe hacer una llamada
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    });
  });
}); 