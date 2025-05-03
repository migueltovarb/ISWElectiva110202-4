'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaBed } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

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
        {/* Top Banner */}
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src="/images/hotel-banner.jpg"
            alt="Hotel exterior"
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex items-center px-12">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              {greeting}, {userName}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservation Info */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#8B4513] mb-6">Tu reserva</h2>
            <div className="space-y-4 text-[#8B4513]">
              <p className="flex items-center space-x-2">
                <span className="font-semibold min-w-[200px]">Nombre del hotel:</span>
                <span className="text-lg">{reservationInfo.hotelName}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold min-w-[200px]">Fecha de hospedaje:</span>
                <span className="text-lg">{reservationInfo.checkIn} - {reservationInfo.checkOut}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold min-w-[200px]">Hora aproximada de llegada:</span>
                <span className="text-lg">{reservationInfo.arrivalTime}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold min-w-[200px]">Días de estadía:</span>
                <span className="text-lg">{reservationInfo.stayDuration}</span>
              </p>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#8B4513] mb-6">Calendario</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-none rounded-xl overflow-hidden shadow-inner"
              tileClassName="text-[#8B4513] hover:bg-[#CD853F]/20 transition-colors duration-200"
            />
          </div>
        </div>
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
    </div>
  );
}
