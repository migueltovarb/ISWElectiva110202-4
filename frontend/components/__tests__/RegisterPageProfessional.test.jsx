import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '../../app/register/page'

// ==================== PROFESSIONAL MOCKING SETUP ====================
jest.mock('next/image', () => {
  return ({ src, alt, width, height, fill, className, ...props }) => {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className={className}
        data-testid="mocked-image"
        {...props}
      />
    );
  };
});

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000'
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Global mocks
global.fetch = jest.fn();
global.alert = jest.fn();

// Mock window.location.href
delete window.location;
window.location = { href: '' };

describe('🏆 REGISTER PAGE - PROFESSIONAL TEST SUITE', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Reset location mock
    window.location.href = '';
    
    // Default fetch mock
    global.fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"message": "Success"}'),
      json: () => Promise.resolve({ message: 'Usuario registrado correctamente' })
    });
  });

  afterEach(() => {
    cleanup();
  });

  // ==================== RENDERING TESTS ====================
  describe('🎨 Component Rendering', () => {
    it('renders all UI elements correctly', () => {
      render(<RegisterPage />);

      // Check main title
      expect(screen.getByText('HOTEL LINDO SUEÑO')).toBeInTheDocument();
      expect(screen.getByText('Registro de usuario')).toBeInTheDocument();

      // Check all form inputs
      expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();

      // Check submit button
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();

      // Check login link
      expect(screen.getByText('¿Ya tienes una cuenta? Inicia sesión')).toBeInTheDocument();
    });

    it('renders images with correct attributes', () => {
      render(<RegisterPage />);
      
      const images = screen.getAllByTestId('mocked-image');
      expect(images).toHaveLength(2); // Logo + background
      
      // Check main logo
      expect(images[0]).toHaveAttribute('src', '/images/logo.png');
      expect(images[0]).toHaveAttribute('alt', 'Hotel Lindo Sueño Logo');
    });

    it('has correct form structure and accessibility', () => {
      render(<RegisterPage />);
      
      // Find form using querySelector instead of role
      const { container } = render(<RegisterPage />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      // Check all inputs have required attribute
      const requiredInputs = screen.getAllByRole('textbox');
      requiredInputs.forEach(input => {
        expect(input).toBeRequired();
      });
    });
  });

  // ==================== FORM INTERACTION TESTS ====================
  describe('📝 Form Interactions', () => {
    it('updates form data when user types in inputs', async () => {
      render(<RegisterPage />);

      const fullNameInput = screen.getByPlaceholderText('Nombre completo');
      const emailInput = screen.getByPlaceholderText('Correo electrónico');
      const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');

      // Type in all fields
      await user.type(fullNameInput, 'Juan Pérez');
      await user.type(emailInput, 'juan@email.com');
      await user.type(usernameInput, 'juanperez');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');

      // Verify values
      expect(fullNameInput).toHaveValue('Juan Pérez');
      expect(emailInput).toHaveValue('juan@email.com');
      expect(usernameInput).toHaveValue('juanperez');
      expect(passwordInput).toHaveValue('Password123!');
      expect(confirmPasswordInput).toHaveValue('Password123!');
    });

    it('handles individual field changes correctly', async () => {
      render(<RegisterPage />);

      const fullNameInput = screen.getByPlaceholderText('Nombre completo');
      
      await user.type(fullNameInput, 'Test');
      expect(fullNameInput).toHaveValue('Test');
      
      await user.clear(fullNameInput);
      await user.type(fullNameInput, 'New Name');
      expect(fullNameInput).toHaveValue('New Name');
    });

    it('supports basic user interactions', async () => {
      render(<RegisterPage />);

      const emailInput = screen.getByPlaceholderText('Correo electrónico');
      const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
      
      await user.type(emailInput, 'test@example.com');
      expect(emailInput).toHaveValue('test@example.com');
      
      await user.click(usernameInput);
      expect(usernameInput).toHaveFocus();
    });
  });

  // ==================== VALIDATION TESTS ====================
  describe('✅ Form Validation', () => {
    it('shows alert when passwords do not match', async () => {
      render(<RegisterPage />);

      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Test User');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'test@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'testuser');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'password123');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'differentpassword');

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('validates email format with browser validation', () => {
      render(<RegisterPage />);
      
      const emailInput = screen.getByPlaceholderText('Correo electrónico');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('requires all fields to be filled', () => {
      render(<RegisterPage />);
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toBeRequired();
      });
    });
  });

  // ==================== API INTEGRATION TESTS ====================
  describe('🌐 API Integration', () => {
    it('successfully registers user with valid data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"message": "Success"}'),
        json: () => Promise.resolve({ message: 'Usuario registrado correctamente' })
      });

      render(<RegisterPage />);

      // Fill out form with valid data
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Juan Pérez');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'juan@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'juanperez');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/registro/register/',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              full_name: 'Juan Pérez',
              email: 'juan@email.com',
              username: 'juanperez',
              password: 'Password123!',
              confirm_password: 'Password123!'
            })
          })
        );
      });

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Usuario registrado correctamente');
        expect(window.location.href).toBe('/login');
      });
    });

    it('handles API error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve('{"error": "User already exists"}'),
        json: () => Promise.resolve({ error: 'User already exists' })
      });

      render(<RegisterPage />);

      // Fill form and submit
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Juan Pérez');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'juan@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'juanperez');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al registrar usuario: 400');
      });
    });

    it('handles network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<RegisterPage />);

      // Fill form and submit
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Juan Pérez');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'juan@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'juanperez');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error de conexión con el servidor');
      });
    });

    it('handles malformed JSON response gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Invalid JSON'),
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      render(<RegisterPage />);

      // Fill form and submit
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Juan Pérez');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'juan@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'juanperez');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al registrar usuario: 500');
      });
    });
  });

  // ==================== FORM RESET TESTS ====================
  describe('🔄 Form Reset Behavior', () => {
    it('clears form after successful registration', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"message": "Success"}'),
        json: () => Promise.resolve({ message: 'Usuario registrado correctamente' })
      });

      render(<RegisterPage />);

      const fullNameInput = screen.getByPlaceholderText('Nombre completo');
      const emailInput = screen.getByPlaceholderText('Correo electrónico');
      const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');

      // Fill form
      await user.type(fullNameInput, 'Juan Pérez');
      await user.type(emailInput, 'juan@email.com');
      await user.type(usernameInput, 'juanperez');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');

      // Submit
      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      // Wait for form to be cleared
      await waitFor(() => {
        expect(fullNameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(usernameInput).toHaveValue('');
        expect(passwordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
      });
    });
  });

  // ==================== ACCESSIBILITY TESTS ====================
  describe('♿ Accessibility', () => {
    it('has proper form labels and structure', () => {
      const { container } = render(<RegisterPage />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      // Check button is accessible
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('supports keyboard navigation', async () => {
      render(<RegisterPage />);
      
      const fullNameInput = screen.getByPlaceholderText('Nombre completo');
      
      // Tab to first input
      await user.tab();
      expect(fullNameInput).toHaveFocus();
      
      // Tab through all inputs
      await user.tab();
      expect(screen.getByPlaceholderText('Correo electrónico')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByPlaceholderText('Nombre de usuario')).toHaveFocus();
    });

    it('has proper input types for better UX', () => {
      render(<RegisterPage />);
      
      expect(screen.getByPlaceholderText('Correo electrónico')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Contraseña')).toHaveAttribute('type', 'password');
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toHaveAttribute('type', 'password');
    });
  });

  // ==================== EDGE CASES TESTS ====================
  describe('🔍 Edge Cases', () => {
    it('handles empty form submission', async () => {
      render(<RegisterPage />);
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      await user.click(submitButton);
      
      // Browser validation should prevent submission
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('handles normal input values correctly', async () => {
      render(<RegisterPage />);

      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Maria Garcia');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'maria@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'mariag');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('Maria Garcia')
          })
        );
      });
    });

    it('handles moderate length input values', async () => {
      render(<RegisterPage />);

      const mediumText = 'John'.repeat(5); // 20 characters
      const fullNameInput = screen.getByPlaceholderText('Nombre completo');
      
      await user.type(fullNameInput, mediumText);
      expect(fullNameInput).toHaveValue(mediumText);
    }, 10000);
  });

  // ==================== INTEGRATION FLOW TESTS ====================
  describe('🔄 Complete User Flows', () => {
    it('completes basic registration flow', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"message": "Success"}'),
        json: () => Promise.resolve({ message: 'Usuario registrado correctamente' })
      });

      render(<RegisterPage />);

      // Step 1: Fill form with simple data
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Test User');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'test@hotel.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'testuser');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Test123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Test123!');

      // Step 2: Submit
      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      // Step 3: Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/registro/register/',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: 'Test User',
              email: 'test@hotel.com',
              username: 'testuser',
              password: 'Test123!',
              confirm_password: 'Test123!'
            })
          })
        );
      });

      // Step 4: Verify success handling
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Usuario registrado correctamente');
        expect(window.location.href).toBe('/login');
      });

      // Step 5: Verify form reset
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nombre completo')).toHaveValue('');
        expect(screen.getByPlaceholderText('Correo electrónico')).toHaveValue('');
        expect(screen.getByPlaceholderText('Nombre de usuario')).toHaveValue('');
        expect(screen.getByPlaceholderText('Contraseña')).toHaveValue('');
        expect(screen.getByPlaceholderText('Confirmar contraseña')).toHaveValue('');
      });
    });

    it('handles registration failure and recovery', async () => {
      // First attempt fails
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        text: () => Promise.resolve('{"error": "Username already exists"}'),
        json: () => Promise.resolve({ error: 'Username already exists' })
      });

      render(<RegisterPage />);

      // Fill form
      await user.type(screen.getByPlaceholderText('Nombre completo'), 'Test User');
      await user.type(screen.getByPlaceholderText('Correo electrónico'), 'test@email.com');
      await user.type(screen.getByPlaceholderText('Nombre de usuario'), 'existing_user');
      await user.type(screen.getByPlaceholderText('Contraseña'), 'Password123!');
      await user.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password123!');

      // Submit and verify error
      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al registrar usuario: 409');
      });

      // User can modify and retry
      const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
      await user.clear(usernameInput);
      await user.type(usernameInput, 'new_unique_user');

      // Mock successful second attempt
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"message": "Success"}'),
        json: () => Promise.resolve({ message: 'Usuario registrado correctamente' })
      });

      await user.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Usuario registrado correctamente');
      });
    });
  });
}); 