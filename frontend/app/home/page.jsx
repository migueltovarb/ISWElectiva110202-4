'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Decodificar el token para obtener la información del usuario
      const decoded = jwtDecode(token);
      console.log('Token decodificado:', decoded); // Para ver la estructura del token
      
      // El token de Django REST framework JWT típicamente tiene una estructura con user_id y username
      if (decoded.user_id) {
        // Hacer una petición al backend para obtener los detalles del usuario
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/user-info/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          setUserName(data.username || data.full_name || 'Usuario');
        })
        .catch(error => {
          console.error('Error al obtener información del usuario:', error);
          setUserName(decoded.username || 'Usuario');
        });
      } else {
        setUserName(decoded.username || 'Usuario');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }, []);

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
    <div className="min-h-screen bg-[#FFF3E0]">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#8B4513] p-4 flex flex-col">
        {/* Menu Items */}
        <div className="flex-1 space-y-4">
          <Link href="/home" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaHome size={24} />
            <span className="text-lg font-semibold">Home</span>
          </Link>
          
          <Link href="/check-in" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaMapMarkerAlt size={24} />
            <span className="text-lg font-semibold">Check-In</span>
          </Link>
          
          <Link href="/check-out" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaSignOutAlt size={24} />
            <span className="text-lg font-semibold">Check-Out</span>
          </Link>
          
          <Link href="/pagos" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaMoneyBill size={24} />
            <span className="text-lg font-semibold">Pagos</span>
          </Link>
          
          <Link href="/notificaciones" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaBell size={24} />
            <span className="text-lg font-semibold">Notificaciones</span>
          </Link>
          
          <Link href="/configuraciones" className="flex items-center space-x-3 p-3 bg-[#CD853F] text-white rounded-lg hover:bg-[#DEB887] transition-colors">
            <FaCog size={24} />
            <span className="text-lg font-semibold">Configuraciones</span>
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
            src="/images/hotel-banner.jpg"
            alt="Hotel exterior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8">
            <h1 className="text-4xl font-bold text-white">
              {greeting}, {userName}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservation Info */}
          <div className="bg-[#FFDAB9] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-4">Tu reserva</h2>
            <div className="space-y-3 text-[#8B4513]">
              <p><span className="font-semibold">Nombre del hotel:</span> {reservationInfo.hotelName}</p>
              <p><span className="font-semibold">Fecha de hospedaje:</span> {reservationInfo.checkIn} - {reservationInfo.checkOut}</p>
              <p><span className="font-semibold">Hora aproximada de llegada:</span> {reservationInfo.arrivalTime}</p>
              <p><span className="font-semibold">Días de estadía:</span> {reservationInfo.stayDuration}</p>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-4">Calendario</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full border-none"
              tileClassName="text-[#8B4513]"
            />
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
