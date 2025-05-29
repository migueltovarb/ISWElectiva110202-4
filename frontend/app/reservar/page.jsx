'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaBed, FaWifi, FaTv, FaSnowflake, FaShower, FaCalendarAlt, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNotification } from '../../components/NotificationContext';
import Image from 'next/image';

export default function Reservar() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRooms, setUpdatingRooms] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);
  const [reservaActiva, setReservaActiva] = useState(false);
  const [checkingReserva, setCheckingReserva] = useState(true);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          router.push('/login');
          return;
        }

        // Función para obtener habitaciones disponibles con fechas
        await fetchAvailableRooms(token);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar las habitaciones');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Nueva función para obtener habitaciones disponibles
  const fetchAvailableRooms = async (token = null) => {
    try {
      setUpdatingRooms(true);
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        router.push('/login');
        return;
      }

      // Construir URL con parámetros de fecha
      const fechaInicio = dateRange[0].toISOString().split('T')[0];
      const fechaFin = dateRange[1].toISOString().split('T')[0];
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/habitaciones/disponibles/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las habitaciones');
      }

      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las habitaciones disponibles');
    } finally {
      setUpdatingRooms(false);
    }
  };

  // Efecto para actualizar habitaciones cuando cambian las fechas
  useEffect(() => {
    if (dateRange[0] && dateRange[1] && !loading) {
      fetchAvailableRooms();
    }
  }, [dateRange]);

  useEffect(() => {
    const checkReservaActiva = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCheckingReserva(false);
          return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          setCheckingReserva(false);
          return;
        }
        const reservas = await response.json();
        const pagadas = reservas.filter(r => r.estado === 'pagada');
        const checkinAceptado = reservas.filter(r => r.estado === 'checkin_aceptado');
        // Bloquear solo si NO hay pagadas y SÍ hay al menos una con checkin_aceptado
        setReservaActiva(pagadas.length === 0 && checkinAceptado.length > 0);
      } catch (e) {
        setReservaActiva(false);
      } finally {
        setCheckingReserva(false);
      }
    };
    checkReservaActiva();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const handleReservar = async (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    setSelectedRoom(room);
    setShowModal(true);
  };

  const confirmReservar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Crear la reserva en la base de datos
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitacion_id: selectedRoom.id,
          fecha_inicio: dateRange[0].toISOString().split('T')[0],
          fecha_fin: dateRange[1].toISOString().split('T')[0],
          estado: 'pendiente'
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMsg = 'Error al crear la reserva';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMsg = JSON.stringify(errorData) || errorMsg;
        } else {
          errorMsg = 'Error en el servidor o endpoint no encontrado';
        }
        throw new Error(errorMsg);
      }

      const reservaData = await response.json();
      
      // Solo guardamos en localStorage si la reserva se creó exitosamente
      localStorage.setItem('ultima_reserva', JSON.stringify({
        id: reservaData.id,
        habitacion: selectedRoom.numero_habitacion,
        tipo: selectedRoom.tipo_habitacion,
        fecha_inicio: dateRange[0].toISOString().split('T')[0],
        fecha_fin: dateRange[1].toISOString().split('T')[0],
        noches: calculateNights(),
        precio_noche: selectedRoom.precio,
        total: calculateTotal(),
        estado: 'pendiente'
      }));
      
      // Actualizar la lista de habitaciones
      const updatedRooms = rooms.filter(room => room.id !== selectedRoom.id);
      setRooms(updatedRooms);
      
      // Actualizar la lista completa desde el servidor
      await fetchAvailableRooms();
      
      setShowModal(false);
      
      // Redirigir a la página de pagos
      addNotification('Reserva creada, procede al pago', 'success');
      router.push('/pagos');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al crear la reserva. Por favor, intente nuevamente.');
    }
  };

  const calculateNights = () => {
    if (!dateRange[0] || !dateRange[1]) return 0;
    const diffTime = Math.abs(dateRange[1] - dateRange[0]);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    return (selectedRoom.precio * calculateNights()).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E0] to-[#FFE4C4]">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#8B4513] to-[#A0522D] p-6 flex flex-col shadow-xl">
        {/* Menu Items */}
        <div className="flex-1 space-y-4">
          <Link href="/home" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaHome size={24} />
            <span className="text-lg font-semibold">Home</span>
          </Link>
          
          <Link href="/reservar" className="flex items-center space-x-3 p-4 bg-[#CD853F]/40 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/60 transition-all duration-300 transform hover:scale-105">
            <FaBed size={24} />
            <span className="text-lg font-semibold">Reservar</span>
          </Link>
          
          <Link href="/check-in" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaMapMarkerAlt size={24} />
            <span className="text-lg font-semibold">Check-In</span>
          </Link>
          
          <Link href="/check-out" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaSignOutAlt size={24} />
            <span className="text-lg font-semibold">Check-Out</span>
          </Link>
          
          <Link href="/pagos" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaMoneyBill size={24} />
            <span className="text-lg font-semibold">Pagos</span>
          </Link>
          
          <Link href="/notificaciones" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaBell size={24} />
            <span className="text-lg font-semibold">Notificaciones</span>
          </Link>
          
          <Link href="/configuraciones" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaCog size={24} />
            <span className="text-lg font-semibold">Configuraciones</span>
          </Link>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-4 mt-4 bg-[#A0522D]/80 text-white rounded-xl hover:bg-[#8B4513] transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <FaPowerOff size={24} />
          <span className="text-lg font-semibold">Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <h1 className="text-4xl font-bold text-[#8B4513] mb-8">Habitaciones Disponibles</h1>

        {checkingReserva ? (
          <div className="text-center py-8 text-[#8B4513]">Verificando reservas activas...</div>
        ) : reservaActiva ? (
          <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 mt-12">
            <FaLock size={64} className="text-[#8B4513] mb-6" />
            <h2 className="text-2xl font-bold text-[#8B4513] mb-4">No puedes reservar hasta finalizar tu(s) estancia(s)</h2>
            <p className="text-[#A0522D] text-lg">Debes hacer checkout de todas tus reservas activas antes de poder reservar otra habitación.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto"></div>
            <p className="mt-4 text-[#8B4513]">Cargando habitaciones...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div>
            {updatingRooms && (
              <div className="text-center py-4 mb-6">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8B4513]"></div>
                  <span className="text-[#8B4513]">Actualizando habitaciones disponibles...</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                  {/* Imagen de la habitación */}
                  <div className="w-full h-48 relative mb-4 rounded-xl overflow-hidden">
                    {room.imagen ? (
                      <Image
                        src={
                          room.imagen?.startsWith('http')
                            ? room.imagen
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/imagenes/habitaciones/${room.imagen}`
                        }
                        alt={`Habitación ${room.numero_habitacion}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F5E1C0] flex items-center justify-center">
                        <FaBed size={48} className="text-[#8B4513]" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-[#8B4513]">Habitación {room.numero_habitacion}</h2>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Disponible
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[#8B4513]">
                      <span className="font-semibold">Tipo:</span> {room.tipo_habitacion}
                    </p>
                    <p className="text-[#8B4513]">
                      <span className="font-semibold">Precio por noche:</span> ${room.precio}
                    </p>
                    
                    {room.descripcion && (
                      <p className="text-[#8B4513]">
                        <span className="font-semibold">Descripción:</span> {room.descripcion}
                      </p>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={() => handleReservar(room.id)}
                        className="w-full bg-[#8B4513] text-white py-3 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                      >
                        <FaBed size={20} />
                        <span>Reservar Ahora</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Right Icons */}
      <div className="fixed top-6 right-6 flex space-x-4">
        <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110">
          <FaBell size={24} className="text-[#8B4513]" />
        </button>
        <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110">
          <FaCog size={24} className="text-[#8B4513]" />
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Confirmar Reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información de la habitación */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Detalles de la Habitación</h3>
                {/* Imagen de la habitación */}
                <div className="w-full h-48 relative mb-4 rounded-xl overflow-hidden">
                  {selectedRoom.imagen ? (
                    <Image
                      src={
                        selectedRoom.imagen?.startsWith('http')
                          ? selectedRoom.imagen
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/imagenes/habitaciones/${selectedRoom.imagen}`
                      }
                      alt={`Habitación ${selectedRoom.numero_habitacion}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F5E1C0] flex items-center justify-center">
                      <FaBed size={48} className="text-[#8B4513]" />
                    </div>
                  )}
                </div>
                <p className="text-[#8B4513]">
                  <span className="font-semibold">Habitación:</span> {selectedRoom.numero_habitacion}
                </p>
                <p className="text-[#8B4513]">
                  <span className="font-semibold">Tipo:</span> {selectedRoom.tipo_habitacion}
                </p>
                <p className="text-[#8B4513]">
                  <span className="font-semibold">Precio por noche:</span> ${selectedRoom.precio}
                </p>
                {selectedRoom.descripcion && (
                  <p className="text-[#8B4513]">
                    <span className="font-semibold">Descripción:</span> {selectedRoom.descripcion}
                  </p>
                )}
              </div>

              {/* Calendario y resumen */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Selecciona tus fechas</h3>
                <div className="calendar-container">
                  <Calendar
                    onChange={setDateRange}
                    value={dateRange}
                    selectRange={true}
                    minDate={new Date()}
                    className="w-full border-none rounded-xl shadow-inner"
                    tileClassName="text-[#8B4513] hover:bg-[#CD853F]/20 transition-colors duration-200"
                  />
                </div>
                <div className="mt-4 p-4 bg-[#FFF3E0] rounded-xl">
                  <p className="text-[#8B4513]">
                    <span className="font-semibold">Noches seleccionadas:</span> {calculateNights()}
                  </p>
                  <p className="text-[#8B4513]">
                    <span className="font-semibold">Total estimado:</span> ${calculateTotal()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-[#8B4513] hover:text-[#A0522D] transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReservar}
                className="px-6 py-3 bg-[#8B4513] text-white rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-2"
              >
                <FaCalendarAlt size={20} />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 