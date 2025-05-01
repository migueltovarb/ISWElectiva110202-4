'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaHotel, FaChartBar, FaBell, FaCog, FaPowerOff, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function Admin() {
  const router = useRouter();
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

  const handleLogout = () => {
    router.push('/login');
  };

  const handleAddRoom = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_habitacion: 'Nueva Habitación',
          numero_habitacion: 'Nuevo',
          precio: 0,
          estado: true
        }),
      });

      if (response.ok) {
        fetchRooms();
        alert('Habitación agregada exitosamente');
      } else {
        setError('Error al agregar la habitación');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleEditRoom = async (roomId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/${roomId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_habitacion: 'Habitación Actualizada',
          numero_habitacion: 'Actualizado',
          precio: 0,
          estado: true
        }),
      });

      if (response.ok) {
        fetchRooms();
        alert('Habitación actualizada exitosamente');
      } else {
        setError('Error al actualizar la habitación');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/${roomId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchRooms();
          alert('Habitación eliminada exitosamente');
        } else {
          setError('Error al eliminar la habitación');
        }
      } catch (error) {
        setError('Error de conexión con el servidor');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF3E0] flex items-center justify-center">
        <div className="text-[#8B4513] text-xl">Cargando...</div>
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
    <div className="min-h-screen bg-[#FFF3E0]">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#8B4513] p-4 flex flex-col">
        {/* Menu Items */}
        <div className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaHome size={24} />
            <span className="text-lg font-semibold">Dashboard</span>
          </Link>
          
          <Link href="/admin" className="flex items-center space-x-3 p-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
            <FaHotel size={24} />
            <span className="text-lg font-semibold">Habitaciones</span>
          </Link>
          
          <Link href="/admin/availability" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaChartBar size={24} />
            <span className="text-lg font-semibold">Disponibilidad</span>
          </Link>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 mt-4 bg-[#A0522D] text-white rounded-lg hover:bg-[#8B4513] transition-colors w-full"
        >
          <FaPowerOff size={24} />
          <span className="text-lg font-semibold">Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Banner */}
        <div className="relative h-64 w-full">
          <Image
            src="/images/hotel-admin-banner.jpg"
            alt="Hotel Admin"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8">
            <h1 className="text-4xl font-bold text-white">
              Gestión de Habitaciones
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Add Room Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleAddRoom}
                className="bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#A0522D] transition-colors flex items-center space-x-2"
              >
                <FaPlus size={20} />
                <span>Agregar Habitación</span>
              </button>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#8B4513]">
                          Habitación {room.numero_habitacion}
                        </h3>
                        <p className="text-[#A0522D]">{room.tipo_habitacion}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        room.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {room.estado ? 'Disponible' : 'Ocupada'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#A0522D]">Precio por noche:</span>
                        <span className="text-[#8B4513] font-semibold">${room.precio}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRoom(room.id)}
                        className="flex-1 bg-[#CD853F] text-white py-2 rounded-md hover:bg-[#DEB887] transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaEdit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaTrash size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Icons */}
      <div className="fixed top-4 right-4 flex space-x-4">
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
          <FaBell size={24} className="text-[#8B4513]" />
        </button>
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
          <FaCog size={24} className="text-[#8B4513]" />
        </button>
      </div>
    </div>
  );
} 