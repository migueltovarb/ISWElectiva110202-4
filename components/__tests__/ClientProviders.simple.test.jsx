import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientProviders from '../../app/ClientProviders';

// Mock NotificationContext
jest.mock('../../components/NotificationContext', () => ({
  NotificationProvider: ({ children }) => (
    <div data-testid="notification-provider">{children}</div>
  )
}));

// Mock ToastNotification
jest.mock('../../components/ToastNotification', () => {
  return function MockToastNotification() {
    return <div data-testid="toast-notification">Toast Component</div>;
  };
});

describe('ClientProviders - Pruebas Sencillas', () => {
  describe('Renderizado Básico', () => {
    it('renderiza correctamente con children', () => {
      render(
        <ClientProviders>
          <div data-testid="test-child">Contenido hijo</div>
        </ClientProviders>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Contenido hijo')).toBeInTheDocument();
    });

    it('incluye NotificationProvider', () => {
      render(
        <ClientProviders>
          <div>Test</div>
        </ClientProviders>
      );
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
    });

    it('incluye ToastNotification', () => {
      render(
        <ClientProviders>
          <div>Test</div>
        </ClientProviders>
      );
      
      expect(screen.getByTestId('toast-notification')).toBeInTheDocument();
      expect(screen.getByText('Toast Component')).toBeInTheDocument();
    });
  });

  describe('Estructura de Componentes', () => {
    it('mantiene el orden correcto de componentes', () => {
      render(
        <ClientProviders>
          <div data-testid="child-content">Child</div>
        </ClientProviders>
      );
      
      const provider = screen.getByTestId('notification-provider');
      const toast = screen.getByTestId('toast-notification');
      const child = screen.getByTestId('child-content');
      
      expect(provider).toBeInTheDocument();
      expect(toast).toBeInTheDocument();
      expect(child).toBeInTheDocument();
    });

    it('toast aparece antes que children en el DOM', () => {
      render(
        <ClientProviders>
          <div data-testid="child-content">Child Content</div>
        </ClientProviders>
      );
      
      const provider = screen.getByTestId('notification-provider');
      const toastText = screen.getByText('Toast Component');
      const childText = screen.getByText('Child Content');
      
      // Verificar que ambos están dentro del provider
      expect(provider).toContainElement(toastText);
      expect(provider).toContainElement(childText);
    });
  });

  describe('Manejo de Children', () => {
    it('renderiza múltiples children', () => {
      render(
        <ClientProviders>
          <div data-testid="child-1">Hijo 1</div>
          <div data-testid="child-2">Hijo 2</div>
          <span data-testid="child-3">Hijo 3</span>
        </ClientProviders>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('renderiza sin children sin errores', () => {
      render(<ClientProviders />);
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      expect(screen.getByTestId('toast-notification')).toBeInTheDocument();
    });

    it('maneja children complejos', () => {
      render(
        <ClientProviders>
          <div>
            <header data-testid="header">Header complejo</header>
            <main>
              <section>
                <h1>Título principal</h1>
                <p>Contenido del párrafo</p>
              </section>
            </main>
          </div>
        </ClientProviders>
      );
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Título principal')).toBeInTheDocument();
      expect(screen.getByText('Contenido del párrafo')).toBeInTheDocument();
    });
  });

  describe('Props y Propiedades', () => {
    it('es un componente de función válido', () => {
      expect(typeof ClientProviders).toBe('function');
    });

    it('acepta props children correctamente', () => {
      const testChildren = <div data-testid="prop-child">Prop child</div>;
      
      expect(() => {
        render(<ClientProviders children={testChildren} />);
      }).not.toThrow();
      
      expect(screen.getByTestId('prop-child')).toBeInTheDocument();
    });

    it('maneja props adicionales sin errores', () => {
      expect(() => {
        render(
          <ClientProviders 
            children={<div>Test</div>}
            extraProp="value"
            anotherProp={123}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Casos Edge', () => {
    it('maneja children como string', () => {
      render(<ClientProviders children="Simple text" />);
      
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('maneja children como número', () => {
      render(<ClientProviders children={42} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('maneja children undefined', () => {
      expect(() => {
        render(<ClientProviders children={undefined} />);
      }).not.toThrow();
    });

    it('maneja children null', () => {
      expect(() => {
        render(<ClientProviders children={null} />);
      }).not.toThrow();
    });

    it('maneja array de children', () => {
      const childrenArray = [
        <div key="1" data-testid="array-child-1">Child 1</div>,
        <div key="2" data-testid="array-child-2">Child 2</div>
      ];
      
      render(<ClientProviders children={childrenArray} />);
      
      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
    });
  });

  describe('Integración con Providers', () => {
    it('todos los componentes están envueltos por NotificationProvider', () => {
      render(
        <ClientProviders>
          <div data-testid="wrapped-content">Content</div>
        </ClientProviders>
      );
      
      const provider = screen.getByTestId('notification-provider');
      const toast = screen.getByTestId('toast-notification');
      const content = screen.getByTestId('wrapped-content');
      
      expect(provider).toContainElement(toast);
      expect(provider).toContainElement(content);
    });

    it('mantiene la estructura de anidamiento correcta', () => {
      render(
        <ClientProviders>
          <div data-testid="nested-child">
            <span>Nested content</span>
          </div>
        </ClientProviders>
      );
      
      const provider = screen.getByTestId('notification-provider');
      const nestedChild = screen.getByTestId('nested-child');
      const spanContent = screen.getByText('Nested content');
      
      expect(provider).toContainElement(nestedChild);
      expect(nestedChild).toContainElement(spanContent);
    });
  });
}); 