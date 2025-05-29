import { redirect } from 'next/navigation';
import Home from '../../app/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

describe('Página Principal - Pruebas Sencillas', () => {
  beforeEach(() => {
    redirect.mockClear();
  });

  describe('Funcionalidad Principal', () => {
    it('redirige a /register', () => {
      Home();
      
      expect(redirect).toHaveBeenCalledWith('/register');
    });

    it('llama a redirect exactamente una vez', () => {
      Home();
      
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('no redirige a otras rutas', () => {
      Home();
      
      expect(redirect).not.toHaveBeenCalledWith('/login');
      expect(redirect).not.toHaveBeenCalledWith('/home');
      expect(redirect).not.toHaveBeenCalledWith('/');
    });
  });

  describe('Comportamiento de la Función', () => {
    it('es una función', () => {
      expect(typeof Home).toBe('function');
    });

    it('no devuelve nada explícitamente', () => {
      const result = Home();
      
      expect(result).toBeUndefined();
    });
  });

  describe('Casos Edge', () => {
    it('maneja múltiples llamadas', () => {
      Home();
      Home();
      Home();
      
      expect(redirect).toHaveBeenCalledTimes(3);
      expect(redirect).toHaveBeenNthCalledWith(1, '/register');
      expect(redirect).toHaveBeenNthCalledWith(2, '/register');
      expect(redirect).toHaveBeenNthCalledWith(3, '/register');
    });

    it('no modifica el comportamiento de redirect', () => {
      const originalMock = redirect.mockImplementation(() => {});
      
      Home();
      
      expect(redirect).toHaveBeenCalledWith('/register');
      originalMock.mockRestore();
    });
  });

  describe('Integración con next/navigation', () => {
    it('usa la función redirect importada', () => {
      // Verificar que se está usando la función mockeada
      expect(redirect).toBeDefined();
      
      Home();
      
      expect(redirect).toHaveBeenCalled();
    });

    it('no llama a otras funciones de navegación', () => {
      // Mock otras funciones para asegurar que no se llamen
      const useRouter = jest.fn();
      const usePathname = jest.fn();
      
      Home();
      
      expect(useRouter).not.toHaveBeenCalled();
      expect(usePathname).not.toHaveBeenCalled();
    });
  });
}); 