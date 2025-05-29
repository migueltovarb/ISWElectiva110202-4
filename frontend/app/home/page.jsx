'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaBed, FaLock, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";
import { useNotification } from '../../components/NotificationContext';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [reservasFinalizadas, setReservasFinalizadas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [cancelError, setCancelError] = useState('');
  const [showCalendars, setShowCalendars] = useState({});
  const [isClient, setIsClient] = useState(false);
  const { addNotification, unreadCount } = useNotification();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Decodificar el token para obtener la información del usuario
        const decoded = jwtDecode(token);
        console.log('Token decodificado:', decoded);
        
        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('Token expirado');
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          router.push('/login');
          return;
        }

        // Hacer una petición al backend para obtener los detalles del usuario
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/user-info/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener información del usuario');
        }

        const data = await response.json();
        setUserName(data.username || data.full_name || 'Usuario');
      } catch (error) {
        console.error('Error de autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Actualizar el saludo según la hora
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Buenos días');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Buenas tardes');
      } else {
        setGreeting('Buenas noches');
      }
    };

    // Actualizar el saludo inmediatamente
    updateGreeting();

    // Actualizar el saludo cada minuto
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) return;
        const data = await response.json();
        // Log para depuración: muestra id y estado de cada reserva
        console.log('Reservas del usuario:', data.map(r => ({id: r.id, estado: r.estado})));
        // Reservas activas: pagada o checkin_aceptado
        const activas = data.filter(r => r.estado === 'pagada' || r.estado === 'checkin_aceptado');
        setReservas(activas);
        // Reservas finalizadas: solo checkout (no cancelada)
        const finalizadas = data.filter(r => r.estado === 'checkout');
        setReservasFinalizadas(finalizadas);
      } catch (e) {
        setReservas([]);
        setReservasFinalizadas([]);
      } finally {
        setLoadingReservas(false);
      }
    };
    fetchReservas();
  }, [router]);

  const handleCancelarReservas = async () => {
    setCancelError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Solo cancelar reservas activas (pagada o checkin_aceptado)
      for (const reserva of reservas) {
        if (reserva.estado === 'pagada' || reserva.estado === 'checkin_aceptado') {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/${reserva.id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'cancelada' }),
          });
        }
      }
      setReservas([]);
      addNotification('Reservas canceladas exitosamente', 'info');
    } catch (e) {
      setCancelError('Error al cancelar las reservas. Intenta de nuevo.');
    }
  };

  const reservationInfo = {
    hotelName: "Hotel Lindo Sueño",
    checkIn: "30/05/2025",
    checkOut: "10/06/2025",
    arrivalTime: "14:00 - 15:00",
    stayDuration: "11 días y 10 noches"
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E0] to-[#FFE4C4]">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#8B4513] to-[#A0522D] p-6 flex flex-col shadow-xl">
        {/* Menu Items */}
        <div className="flex-1 space-y-4">
          <Link href="/home" className="flex items-center space-x-3 p-4 bg-[#CD853F]/40 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/60 transition-all duration-300 transform hover:scale-105">
            <FaHome size={24} />
            <span className="text-lg font-semibold">Home</span>
          </Link>
          
          <Link href="/reservar" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
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
      <div className="ml-64">
        {/* Top Banner Mejorado */}
        <div className="relative h-80 w-full overflow-hidden rounded-b-3xl shadow-lg">
          <Image
            src="/images/hotel.jpg"
            alt="Hotel Lindo Sueño"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-[#8B4513]/60 flex flex-col justify-center px-12">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
              {greeting}, {userName}
            </h1>
            <h2 className="text-2xl text-[#FFD700] font-semibold drop-shadow">
              Hotel Lindo Sueño
            </h2>
            <p className="text-lg text-white/80 mt-2">Tu descanso, nuestro compromiso</p>
            <button
              className="mt-6 px-8 py-3 bg-[#A0522D] text-white font-bold rounded-xl shadow-lg hover:bg-[#8B4513] transition"
              onClick={() => router.push('/reservar')}
            >
              Reservar ahora
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid grid-cols-1 gap-8">
          {/* Reservation Info Mejorada */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#8B4513] mb-6">Tus reservas activas</h2>
            {loadingReservas ? (
              <div className="text-[#8B4513]">Cargando reservas...</div>
            ) : reservas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <FaLock size={48} className="text-[#8B4513] mb-4" />
                <span className="text-lg text-[#8B4513]">No tienes reservas activas.</span>
              </div>
            ) : (
              <>
                <ul className="space-y-6 mb-4">
                  {reservas.map((reserva) => (
                    <li key={reserva.id} className="border border-[#CD853F] rounded-xl p-6 bg-[#FFF8F0] shadow flex flex-col md:flex-row md:items-center md:space-x-8">
                      {/* Imagen de la habitación */}
                      <div className="flex-shrink-0 mb-4 md:mb-0 flex items-center justify-center">
                        {reserva.habitacion.imagen ? (
                          <Image
                            src={
                              reserva.habitacion.imagen?.startsWith('http')
                                ? reserva.habitacion.imagen
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/imagenes/habitaciones/${reserva.habitacion.imagen}`
                            }
                            alt={`Habitación ${reserva.habitacion.numero_habitacion}`}
                            width={100}
                            height={80}
                            className="rounded-xl shadow-md object-cover w-[100px] h-[80px]"
                          />
                        ) : (
                          <div className="w-[100px] h-[80px] bg-[#F5E1C0] flex items-center justify-center rounded-xl shadow-md text-[#8B4513]">
                            <FaBed size={36} />
                          </div>
                        )}
                      </div>
                      {/* Datos de la reserva y estado */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[#4B2E13]">
                        <div>
                          <span className="font-semibold">Habitación: </span>
                          <span className="text-lg font-bold">{reserva.habitacion.numero_habitacion}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Tipo: </span>
                          <span className="text-lg">{reserva.habitacion.tipo_habitacion}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Fechas: </span>
                          <span className="text-lg">{reserva.fecha_inicio} - {reserva.fecha_fin}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">Estado: </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2 align-middle min-w-[90px] text-center bg-white shadow border border-[#CD853F] z-10 ${reserva.estado === 'checkin_aceptado' ? 'text-blue-800' : 'text-green-800'}`}>{reserva.estado.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleCancelarReservas}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold"
                >
                  <FaTimes />
                  <span>Cancelar todas las reservas</span>
                </button>
                {cancelError && <div className="text-red-600 mt-2">{cancelError}</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Right Icons */}
      <div className="fixed top-6 right-6 flex space-x-4 z-50">
        <button
          className="relative p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
          onClick={() => router.push('/notificaciones')}
          aria-label="Notificaciones"
        >
          <FaBell size={24} className="text-[#8B4513]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[22px] flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button
          className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
          onClick={() => router.push('/configuraciones')}
          aria-label="Configuraciones"
        >
          <FaCog size={24} className="text-[#8B4513]" />
        </button>
      </div>
    </div>
  );
}
