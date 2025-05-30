import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn()
  }),
  redirect: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children, href, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function Image({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Quick Wins - Pruebas Súper Sencillas', () => {
  describe('Utilidades Básicas', () => {
    it('verifica que Math.max funciona', () => {
      expect(Math.max(1, 2, 3)).toBe(3);
      expect(Math.max(-1, -2, -3)).toBe(-1);
      expect(Math.max(0)).toBe(0);
    });

    it('verifica que Math.min funciona', () => {
      expect(Math.min(1, 2, 3)).toBe(1);
      expect(Math.min(-1, -2, -3)).toBe(-3);
      expect(Math.min(0)).toBe(0);
    });

    it('verifica operaciones de string simples', () => {
      const text = 'Hotel Lindo Sueño';
      expect(text.length).toBe(17);
      expect(text.toLowerCase()).toBe('hotel lindo sueño');
      expect(text.includes('Hotel')).toBe(true);
      expect(text.split(' ')).toEqual(['Hotel', 'Lindo', 'Sueño']);
    });

    it('verifica operaciones de array simples', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.length).toBe(5);
      expect(arr[0]).toBe(1);
      expect(arr[arr.length - 1]).toBe(5);
      expect(arr.includes(3)).toBe(true);
      expect(arr.indexOf(4)).toBe(3);
    });
  });

  describe('Funciones de Validación Simple', () => {
    const validateEmail = (email) => {
      if (!email) return false;
      if (typeof email !== 'string') return false;
      if (!email.includes('@')) return false;
      if (!email.includes('.')) return false;
      if (email.length < 5) return false;
      return true;
    };

    it('valida emails correctos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@domain.co')).toBe(true);
      expect(validateEmail('admin@hotel.com')).toBe(true);
    });

    it('rechaza emails incorrectos', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('no@')).toBe(false);
      expect(validateEmail('@no.com')).toBe(false);
      expect(validateEmail('a@b')).toBe(false);
    });

    const validatePassword = (password) => {
      if (!password) return false;
      if (typeof password !== 'string') return false;
      if (password.length < 6) return false;
      return true;
    };

    it('valida contraseñas correctas', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password')).toBe(true);
      expect(validatePassword('mypass123')).toBe(true);
    });

    it('rechaza contraseñas incorrectas', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword(123456)).toBe(false);
    });
  });

  describe('Funciones de Formato Simple', () => {
    const formatCurrency = (amount) => {
      if (typeof amount !== 'number') return '$0.00';
      if (isNaN(amount)) return '$0.00';
      if (amount < 0) return '-$' + Math.abs(amount).toFixed(2);
      return '$' + amount.toFixed(2);
    };

    it('formatea cantidades correctas', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(50.5)).toBe('$50.50');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000.999)).toBe('$1001.00');
    });

    it('maneja casos edge en formateo', () => {
      expect(formatCurrency('100')).toBe('$0.00');
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
      expect(formatCurrency(-50)).toBe('-$50.00');
    });

    const formatDate = (date) => {
      if (!date) return 'Fecha no válida';
      if (!(date instanceof Date)) return 'Fecha no válida';
      if (isNaN(date.getTime())) return 'Fecha no válida';
      return date.toLocaleDateString();
    };

    it('formatea fechas correctas', () => {
      const testDate = new Date('2024-01-15');
      expect(formatDate(testDate)).toContain('2024');
      expect(formatDate(new Date())).toBeTruthy();
    });

    it('maneja fechas inválidas', () => {
      expect(formatDate(null)).toBe('Fecha no válida');
      expect(formatDate(undefined)).toBe('Fecha no válida');
      expect(formatDate('2024-01-15')).toBe('Fecha no válida');
      expect(formatDate(new Date('invalid'))).toBe('Fecha no válida');
    });
  });

  describe('Operaciones DOM Simples', () => {
    it('renderiza elementos básicos', () => {
      render(<div data-testid="simple-div">Contenido simple</div>);
      
      const element = screen.getByTestId('simple-div');
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('Contenido simple');
    });

    it('renderiza botones con eventos', () => {
      const handleClick = jest.fn();
      
      render(
        <button onClick={handleClick} data-testid="simple-button">
          Click me
        </button>
      );
      
      const button = screen.getByTestId('simple-button');
      expect(button).toBeInTheDocument();
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('renderiza inputs con valores', () => {
      render(
        <input 
          data-testid="simple-input" 
          defaultValue="test value"
          placeholder="Enter text"
        />
      );
      
      const input = screen.getByTestId('simple-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('test value');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('renderiza listas de elementos', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      
      render(
        <ul data-testid="simple-list">
          {items.map((item, index) => (
            <li key={index} data-testid={`item-${index}`}>
              {item}
            </li>
          ))}
        </ul>
      );
      
      const list = screen.getByTestId('simple-list');
      expect(list).toBeInTheDocument();
      
      items.forEach((item, index) => {
        const listItem = screen.getByTestId(`item-${index}`);
        expect(listItem).toBeInTheDocument();
        expect(listItem).toHaveTextContent(item);
      });
    });
  });

  describe('Estados y Condiciones', () => {
    const getStatus = (value) => {
      if (!value) return 'empty';
      if (value === 'error') return 'error';
      if (value === 'loading') return 'loading';
      if (value === 'success') return 'success';
      return 'unknown';
    };

    it('maneja todos los estados posibles', () => {
      expect(getStatus(null)).toBe('empty');
      expect(getStatus(undefined)).toBe('empty');
      expect(getStatus('')).toBe('empty');
      expect(getStatus('error')).toBe('error');
      expect(getStatus('loading')).toBe('loading');
      expect(getStatus('success')).toBe('success');
      expect(getStatus('anything')).toBe('unknown');
    });

    const checkPermissions = (user, action) => {
      if (!user) return false;
      if (!user.role) return false;
      if (user.role === 'admin') return true;
      if (user.role === 'user' && action === 'read') return true;
      if (user.role === 'guest' && action === 'view') return true;
      return false;
    };

    it('verifica permisos correctamente', () => {
      const admin = { role: 'admin' };
      const user = { role: 'user' };
      const guest = { role: 'guest' };
      
      expect(checkPermissions(admin, 'anything')).toBe(true);
      expect(checkPermissions(user, 'read')).toBe(true);
      expect(checkPermissions(user, 'write')).toBe(false);
      expect(checkPermissions(guest, 'view')).toBe(true);
      expect(checkPermissions(guest, 'read')).toBe(false);
      expect(checkPermissions(null, 'read')).toBe(false);
      expect(checkPermissions({}, 'read')).toBe(false);
    });
  });

  describe('Cálculos Simples', () => {
    const calculateTotal = (items) => {
      if (!Array.isArray(items)) return 0;
      return items.reduce((sum, item) => {
        if (typeof item === 'number' && !isNaN(item)) {
          return sum + item;
        }
        return sum;
      }, 0);
    };

    it('calcula totales correctamente', () => {
      expect(calculateTotal([1, 2, 3, 4, 5])).toBe(15);
      expect(calculateTotal([10, 20, 30])).toBe(60);
      expect(calculateTotal([])).toBe(0);
      expect(calculateTotal([0])).toBe(0);
      expect(calculateTotal([-1, 1])).toBe(0);
    });

    it('maneja casos edge en cálculos', () => {
      expect(calculateTotal(null)).toBe(0);
      expect(calculateTotal(undefined)).toBe(0);
      expect(calculateTotal('not array')).toBe(0);
      expect(calculateTotal([1, 'invalid', 3])).toBe(4);
      expect(calculateTotal([NaN, 5, null])).toBe(5);
    });

    const getPercentage = (part, total) => {
      if (!part || !total) return 0;
      if (typeof part !== 'number' || typeof total !== 'number') return 0;
      if (total === 0) return 0;
      return Math.round((part / total) * 100);
    };

    it('calcula porcentajes correctamente', () => {
      expect(getPercentage(50, 100)).toBe(50);
      expect(getPercentage(25, 100)).toBe(25);
      expect(getPercentage(1, 3)).toBe(33);
      expect(getPercentage(2, 3)).toBe(67);
    });

    it('maneja casos edge en porcentajes', () => {
      expect(getPercentage(0, 100)).toBe(0);
      expect(getPercentage(100, 0)).toBe(0);
      expect(getPercentage(null, 100)).toBe(0);
      expect(getPercentage(50, null)).toBe(0);
      expect(getPercentage('50', 100)).toBe(0);
      expect(getPercentage(50, '100')).toBe(0);
    });
  });
}); 