'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaBed, FaBell, FaCog, FaPowerOff, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function Habitaciones() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        setError('Error al cargar las habitaciones');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    tipo_habitacion: 'sencilla',
    numero_habitacion: '',
    precio: '',
    estado: true,
    descripcion: ''
  });

  const handleLogout = () => {
    router.push('/login');
  };

  const handleCreateRoom = () => {
    setModalMode('create');
    setFormData({
      tipo_habitacion: 'sencilla',
      numero_habitacion: '',
      precio: '',
      estado: true,
      descripcion: ''
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setFormData({
      tipo_habitacion: room.tipo_habitacion,
      numero_habitacion: room.numero_habitacion,
      precio: room.precio,
      estado: room.estado,
      descripcion: room.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (confirm('¿Está seguro de que desea eliminar esta habitación?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/${roomId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchRooms();
        } else {
          setError('Error al eliminar la habitación');
        }
      } catch (error) {
        setError('Error de conexión con el servidor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = modalMode === 'create' 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/${selectedRoom.id}/`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      // Crear FormData y agregar los campos
      const formDataToSend = new FormData();
      formDataToSend.append('tipo_habitacion', formData.tipo_habitacion);
      formDataToSend.append('numero_habitacion', parseInt(formData.numero_habitacion));
      formDataToSend.append('precio', parseFloat(formData.precio));
      formDataToSend.append('estado', formData.estado);
      formDataToSend.append('descripcion', formData.descripcion || '');
      
      const response = await fetch(url, {
        method,
        body: formDataToSend, // Enviar FormData directamente
      });

      if (response.ok) {
        fetchRooms();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        setError(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} la habitación: ${errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF3E0] flex items-center justify-center">
        <div className="text-black text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF3E0] flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#8B4513]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Link href="/admin/home" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaHome className="mr-3" size={24} />
              <span className="text-lg">Home</span>
            </Link>
            
            <Link href="/admin/check-in" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaSignInAlt className="mr-3" size={24} />
              <span className="text-lg">Check-in</span>
            </Link>
            
            <Link href="/admin/check-out" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaSignOutAlt className="mr-3" size={24} />
              <span className="text-lg">Check-out</span>
            </Link>

            <Link href="/admin/habitaciones" className="flex items-center p-4 bg-[#CD853F] text-white hover:bg-[#DEB887] transition-colors">
              <FaBed className="mr-3" size={24} />
              <span className="text-lg">Habitaciones</span>
            </Link>
            
            <Link href="/admin/availability" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaBed className="mr-3" size={24} />
              <span className="text-lg">Disponibilidad</span>
            </Link>

            <Link href="/admin/notificaciones" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaBell className="mr-3" size={24} />
              <span className="text-lg">Notificaciones</span>
            </Link>
            
            <Link href="/admin/configuraciones" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaCog className="mr-3" size={24} />
              <span className="text-lg">Configuraciones</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center p-4 text-white hover:bg-[#A0522D] transition-colors"
          >
            <FaPowerOff className="mr-3" size={24} />
            <span className="text-lg">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Banner */}
        <div className="h-64 relative">
          <Image
            src="/images/hotel-banner.jpg"
            alt="Hotel Banner"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between px-8">
            <h1 className="text-4xl text-white font-bold">Gestión de Habitaciones</h1>
            <div className="flex space-x-4">
              <button 
                onClick={handleCreateRoom}
                className="flex items-center space-x-2 bg-[#CD853F] text-white px-4 py-2 rounded-lg hover:bg-[#DEB887] transition-colors"
              >
                <FaPlus size={20} />
                <span>Nueva Habitación</span>
              </button>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-[#8B4513] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Número</th>
                  <th className="py-3 px-4 text-left">Tipo</th>
                  <th className="py-3 px-4 text-left">Precio</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Descripción</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{room.numero_habitacion}</td>
                    <td className="py-3 px-4 text-black capitalize">{room.tipo_habitacion}</td>
                    <td className="py-3 px-4 text-black">${room.precio}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        room.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {room.estado ? 'Disponible' : 'Ocupada'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-black max-w-md truncate">
                      {room.descripcion || 'Sin descripción'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {modalMode === 'create' ? 'Nueva Habitación' : 'Editar Habitación'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Número de Habitación</label>
                <input
                  type="number"
                  value={formData.numero_habitacion}
                  onChange={(e) => setFormData({ ...formData, numero_habitacion: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Tipo</label>
                <select
                  value={formData.tipo_habitacion}
                  onChange={(e) => setFormData({ ...formData, tipo_habitacion: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="sencilla">Sencilla</option>
                  <option value="doble">Doble</option>
                  <option value="triple">Triple</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Precio</label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value === 'true' })}
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Ocupada</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#CD853F]"
                >
                  {modalMode === 'create' ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 