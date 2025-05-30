'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaBed, FaBell, FaCog, FaPowerOff, FaTimes } from 'react-icons/fa';

export default function Availability() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchRooms();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo las habitaciones disponibles
        const availableRooms = data.filter(room => room.estado === true);
        setRooms(availableRooms);
      } else {
        setError('Error al cargar las habitaciones');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    // Agregar clase al body para prevenir scroll
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    // Restaurar scroll
    document.body.style.overflow = 'unset';
  };

  const handleStatusChange = async () => {
    if (!selectedRoom) return;

    try {
      const token = localStorage.getItem('token');
      // Crear FormData con todos los campos de la habitación
      const formData = new FormData();
      formData.append('tipo_habitacion', selectedRoom.tipo_habitacion);
      formData.append('numero_habitacion', selectedRoom.numero_habitacion);
      formData.append('precio', selectedRoom.precio);
      formData.append('estado', !selectedRoom.estado);
      formData.append('descripcion', selectedRoom.descripcion || '');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/${selectedRoom.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        await fetchRooms();
        handleCloseModal();
      } else {
        setError('Error al actualizar el estado de la habitación');
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
    <div className={`flex h-screen bg-gray-100 ${showModal ? 'overflow-hidden' : ''}`}>
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

            <Link href="/admin/habitaciones" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaBed className="mr-3" size={24} />
              <span className="text-lg">Habitaciones</span>
            </Link>
            
            <Link href="/admin/availability" className="flex items-center p-4 bg-[#CD853F] text-white hover:bg-[#DEB887] transition-colors">
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
            src="/images/hotel.jpg"
            alt="Hotel Banner"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center px-8">
            <h1 className="text-4xl text-white font-bold">Habitaciones Disponibles</h1>
          </div>
        </div>

        {/* Room Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Imagen de la habitación */}
                <div className="w-full h-40 relative bg-gray-100">
                  {room.imagen ? (
                    <Image
                      src={
                        room.imagen?.startsWith('http')
                          ? room.imagen
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/imagenes/habitaciones/${room.imagen}`
                      }
                      alt={`Habitación ${room.numero_habitacion}`}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2">Habitación {room.numero_habitacion}</h3>
                  <p className="text-gray-600 mb-2">Tipo: {room.tipo_habitacion}</p>
                  <p className="text-gray-600 mb-2">Precio: ${room.precio}</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Disponible
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal with Backdrop Blur */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-black">Detalles de la Habitación</h2>
              {/* Imagen en el modal */}
              {selectedRoom.imagen && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={
                      selectedRoom.imagen?.startsWith('http')
                        ? selectedRoom.imagen
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/imagenes/habitaciones/${selectedRoom.imagen}`
                    }
                    alt={`Habitación ${selectedRoom.numero_habitacion}`}
                    width={180}
                    height={120}
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="space-y-4">
                <p className="text-black"><span className="font-semibold">Número:</span> {selectedRoom.numero_habitacion}</p>
                <p className="text-black"><span className="font-semibold">Tipo:</span> {selectedRoom.tipo_habitacion}</p>
                <p className="text-black"><span className="font-semibold">Precio:</span> ${selectedRoom.precio}</p>
                <p className="text-black"><span className="font-semibold">Estado:</span> {selectedRoom.estado ? 'Disponible' : 'Ocupada'}</p>
                <p className="text-black"><span className="font-semibold">Descripción:</span> {selectedRoom.descripcion || 'Sin descripción'}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#CD853F] transition-colors"
                >
                  Marcar como {selectedRoom.estado ? 'Ocupada' : 'Disponible'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 