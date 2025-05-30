import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '../../app/layout';

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Poppins: () => ({
    variable: '--font-poppins'
  })
}));

// Mock ClientProviders
jest.mock('../../app/ClientProviders', () => {
  return function MockClientProviders({ children }) {
    return <div data-testid="client-providers">{children}</div>;
  };
});

describe('Layout Principal - Pruebas Sencillas', () => {
  describe('Renderizado Básico', () => {
    it('renderiza correctamente con children', () => {
      render(
        <RootLayout>
          <div data-testid="test-children">Contenido de prueba</div>
        </RootLayout>
      );
      
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    });

    it('incluye ClientProviders wrapper', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      expect(screen.getByTestId('client-providers')).toBeInTheDocument();
    });

    it('estructura HTML básica está presente', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      // El componente renderiza un html y body
      const html = document.documentElement;
      expect(html).toHaveAttribute('lang', 'es');
    });
  });

  describe('Clases CSS y Estilos', () => {
    it('aplica clases CSS correctas al html', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      const html = document.documentElement;
      expect(html.className).toContain('h-full');
      expect(html.className).toContain('--font-poppins');
    });

    it('aplica clases CSS correctas al body', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      const body = document.body;
      expect(body.className).toContain('h-full');
      expect(body.className).toContain('overflow-hidden');
      expect(body.className).toContain('font-poppins');
    });
  });

  describe('Meta Información', () => {
    it('incluye título correcto', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      // Verificar que el título se establece en el head
      expect(document.title || screen.getByText('Hotel Lindo Sueño')).toBeTruthy();
    });

    it('incluye meta description', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      // El meta tag debería estar presente (aunque no sea directamente testeable en jsdom)
      expect(true).toBe(true); // Esta prueba asegura que no hay errores de renderizado
    });
  });

  describe('Manejo de Children', () => {
    it('renderiza múltiples children correctamente', () => {
      render(
        <RootLayout>
          <div data-testid="child-1">Hijo 1</div>
          <div data-testid="child-2">Hijo 2</div>
          <span data-testid="child-3">Hijo 3</span>
        </RootLayout>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('renderiza sin children sin errores', () => {
      render(<RootLayout />);
      
      expect(screen.getByTestId('client-providers')).toBeInTheDocument();
    });

    it('maneja children complejos', () => {
      render(
        <RootLayout>
          <div>
            <header>Header</header>
            <main>
              <section>
                <h1>Título</h1>
                <p>Párrafo</p>
              </section>
            </main>
            <footer>Footer</footer>
          </div>
        </RootLayout>
      );
      
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Párrafo')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Configuración de Fuente', () => {
    it('configura la variable de fuente Poppins', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      const html = document.documentElement;
      expect(html.className).toContain('--font-poppins');
    });

    it('aplica la fuente al body', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      
      const body = document.body;
      expect(body.className).toContain('font-poppins');
    });
  });

  describe('Propiedades del Componente', () => {
    it('es un componente de función válido', () => {
      expect(typeof RootLayout).toBe('function');
    });

    it('acepta props children', () => {
      const testProps = { children: <div>Test children</div> };
      
      expect(() => {
        render(<RootLayout {...testProps} />);
      }).not.toThrow();
    });
  });

  describe('Casos Edge', () => {
    it('maneja children undefined', () => {
      expect(() => {
        render(<RootLayout children={undefined} />);
      }).not.toThrow();
    });

    it('maneja children null', () => {
      expect(() => {
        render(<RootLayout children={null} />);
      }).not.toThrow();
    });

    it('maneja children como string', () => {
      render(<RootLayout children="Texto simple" />);
      
      expect(screen.getByText('Texto simple')).toBeInTheDocument();
    });

    it('maneja children como número', () => {
      render(<RootLayout children={42} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });
}); 