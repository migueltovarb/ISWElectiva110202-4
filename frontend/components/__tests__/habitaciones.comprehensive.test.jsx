import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Habitaciones from '../../app/admin/habitaciones/page';
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
global.confirm = jest.fn();

describe('Habitaciones - Comprehensive Testing', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
    confirm.mockClear();
    mockRouter.push.mockClear();
  });

  const mockRooms = [
    {
      id: 1,
      numero_habitacion: '101',
      tipo_habitacion: 'sencilla',
      precio: 100,
      estado: true,
      descripcion: 'Habitación sencilla con vista al jardín',
      imagen: 'http://example.com/room1.jpg'
    },
    {
      id: 2,
      numero_habitacion: '102',
      tipo_habitacion: 'doble',
      precio: 150,
      estado: false,
      descripcion: null,
      imagen: '/media/rooms/room2.jpg'
    },
    {
      id: 3,
      numero_habitacion: '103',
      tipo_habitacion: 'triple',
      precio: 200,
      estado: true,
      descripcion: '',
      imagen: null
    }
  ];

  describe('Initial Loading States', () => {
    it('muestra estado de carga inicialmente', () => {
      fetch.mockImplementationOnce(() => new Promise(() => {}));
      
      render(<Habitaciones />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('carga habitaciones exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('101')).toBeInTheDocument();
        expect(screen.getByText('102')).toBeInTheDocument();
        expect(screen.getByText('103')).toBeInTheDocument();
      });
    });

    it('maneja error de respuesta HTTP no exitosa', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Error al cargar las habitaciones')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('Room Display Logic', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('muestra imagen cuando existe y es URL completa', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        const img = screen.getByAltText('Habitación 101');
        expect(img).toHaveAttribute('src', 'http://example.com/room1.jpg');
      });
    });

    it('muestra imagen relativa correctamente', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        const img = screen.getByAltText('Habitación 102');
        expect(img).toHaveAttribute('src', 'http://localhost:8000/media/rooms/room2.jpg');
      });
    });

    it('muestra placeholder cuando no hay imagen', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Sin imagen')).toBeInTheDocument();
      });
    });

    it('muestra estado disponible correctamente', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Disponible')).toBeInTheDocument();
      });
    });

    it('muestra estado ocupada correctamente', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Ocupada')).toBeInTheDocument();
      });
    });

    it('muestra descripción cuando existe', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Habitación sencilla con vista al jardín')).toBeInTheDocument();
      });
    });

    it('muestra placeholder para descripción vacía', async () => {
      render(<Habitaciones />);

      await waitFor(() => {
        expect(screen.getByText('Sin descripción')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Creation Mode', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('abre modal de creación con valores por defecto', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      expect(screen.getByText('Nueva Habitación')).toBeInTheDocument();
      expect(screen.getByDisplayValue('sencilla')).toBeInTheDocument();
      expect(screen.getByDisplayValue('true')).toBeInTheDocument();
    });

    it('actualiza campos del formulario correctamente', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const numeroInput = screen.getByLabelText('Número de Habitación');
      fireEvent.change(numeroInput, { target: { value: '999' } });
      expect(numeroInput.value).toBe('999');

      const tipoSelect = screen.getByLabelText('Tipo');
      fireEvent.change(tipoSelect, { target: { value: 'doble' } });
      expect(tipoSelect.value).toBe('doble');

      const precioInput = screen.getByLabelText('Precio');
      fireEvent.change(precioInput, { target: { value: '250' } });
      expect(precioInput.value).toBe('250');

      const estadoSelect = screen.getByLabelText('Estado');
      fireEvent.change(estadoSelect, { target: { value: 'false' } });
      expect(estadoSelect.value).toBe('false');

      const descripcionTextarea = screen.getByLabelText('Descripción');
      fireEvent.change(descripcionTextarea, { target: { value: 'Nueva descripción' } });
      expect(descripcionTextarea.value).toBe('Nueva descripción');
    });

    it('maneja selección de imagen correctamente', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText('Imagen');
      
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Imagen seleccionada: test.jpg')).toBeInTheDocument();
      });
    });

    it('crea habitación exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 4 })
      });

      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/habitaciones/',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
          })
        );
      });
    });

    it('maneja error al crear habitación', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Error específico' })
      });

      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/Error al crear la habitación: Error específico/)).toBeInTheDocument();
      });
    });

    it('maneja error de conexión al crear', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Edit Mode', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('abre modal de edición con datos precompletados', async () => {
      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);

      expect(screen.getByText('Editar Habitación')).toBeInTheDocument();
      expect(screen.getByDisplayValue('101')).toBeInTheDocument();
      expect(screen.getByDisplayValue('sencilla')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    it('muestra imagen actual en modo edición cuando existe imagen HTTP', async () => {
      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByAltText('Imagen actual de la habitación 101')).toBeInTheDocument();
      });
    });

    it('muestra imagen actual en modo edición con ruta relativa', async () => {
      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[1]);

      await waitFor(() => {
        expect(screen.getByAltText('Imagen actual de la habitación 102')).toBeInTheDocument();
      });
    });

    it('no muestra imagen cuando no existe en modo edición', async () => {
      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[2]);

      expect(screen.queryByText('Imagen actual')).not.toBeInTheDocument();
    });

    it('muestra mensaje de cambio de foto cuando hay imagen actual', async () => {
      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Si deseas cambiar la foto, selecciona una nueva.')).toBeInTheDocument();
      });
    });

    it('actualiza habitación exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 })
      });

      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/habitaciones/1/',
          expect.objectContaining({
            method: 'PUT',
            body: expect.any(FormData)
          })
        );
      });
    });

    it('maneja error al actualizar habitación', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Error de actualización' })
      });

      render(<Habitaciones />);

      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/Error al actualizar la habitación: Error de actualización/)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Functionality', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('confirma y elimina habitación exitosamente', async () => {
      confirm.mockReturnValue(true);
      
      fetch.mockResolvedValueOnce({
        ok: true
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms.filter(r => r.id !== 1)
      });

      render(<Habitaciones />);

      const deleteButtons = await screen.findAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/habitaciones/1/',
          expect.objectContaining({
            method: 'DELETE'
          })
        );
      });
    });

    it('cancela eliminación cuando usuario no confirma', async () => {
      confirm.mockReturnValue(false);

      render(<Habitaciones />);

      const deleteButtons = await screen.findAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);

      expect(fetch).toHaveBeenCalledTimes(1); // Solo la carga inicial
    });

    it('maneja error al eliminar habitación', async () => {
      confirm.mockReturnValue(true);
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      render(<Habitaciones />);

      const deleteButtons = await screen.findAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Error al eliminar la habitación')).toBeInTheDocument();
      });
    });

    it('maneja error de conexión al eliminar', async () => {
      confirm.mockReturnValue(true);
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Habitaciones />);

      const deleteButtons = await screen.findAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Error de conexión con el servidor')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Control', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('cierra modal al hacer clic en cancelar', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      expect(screen.getByText('Nueva Habitación')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Nueva Habitación')).not.toBeInTheDocument();
    });

    it('muestra botón correcto según modo del modal', async () => {
      render(<Habitaciones />);

      // Modo crear
      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);
      expect(screen.getByText('Crear')).toBeInTheDocument();

      // Cerrar modal
      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      // Modo editar
      const editButtons = await screen.findAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);
      expect(screen.getByText('Guardar')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('navega al login al hacer logout', async () => {
      render(<Habitaciones />);

      const logoutButton = await screen.findByText('Cerrar Sesión');
      fireEvent.click(logoutButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('Image Handling Edge Cases', () => {
    beforeEach(async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms
      });
    });

    it('maneja caso cuando e.target.files es null', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const fileInput = screen.getByLabelText('Imagen');
      
      // Simular evento sin archivos
      fireEvent.change(fileInput, { target: { files: null } });

      // No debería mostrar el texto de imagen seleccionada
      expect(screen.queryByText(/Imagen seleccionada:/)).not.toBeInTheDocument();
    });

    it('maneja caso cuando e.target.files está vacío', async () => {
      render(<Habitaciones />);

      const newRoomButton = await screen.findByText('Nueva Habitación');
      fireEvent.click(newRoomButton);

      const fileInput = screen.getByLabelText('Imagen');
      
      // Simular evento con array vacío
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false,
      });

      fireEvent.change(fileInput);

      // No debería mostrar el texto de imagen seleccionada
      expect(screen.queryByText(/Imagen seleccionada:/)).not.toBeInTheDocument();
    });
  });
}); 