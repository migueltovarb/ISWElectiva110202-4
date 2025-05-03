'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaBed, FaUser, FaIdCard, FaCar } from 'react-icons/fa';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";

export default function CheckIn() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

        // Simulación de datos de reservas
        setReservas([
          {
            id: 1,
            habitacion: "101",
            tipo: "Suite",
            fecha_llegada: "2024-03-20",
            hora_llegada: "14:00",
            estado: "Pendiente"
          },
          {
            id: 2,
            habitacion: "203",
            tipo: "Doble",
            fecha_llegada: "2024-03-25",
            hora_llegada: "15:00",
            estado: "Confirmada"
          }
        ]);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar las reservas');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const handleCheckIn = async (reservaId) => {
    try {
      // Aquí iría la lógica real de check-in
      alert('Check-in realizado exitosamente');
      // Actualizar el estado de la reserva
      setReservas(reservas.map(reserva => 
        reserva.id === reservaId 
          ? { ...reserva, estado: 'Check-in Realizado' }
          : reserva
      ));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al realizar el check-in');
    }
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
          
          <Link href="/reservar" className="flex items-center space-x-3 p-4 bg-[#CD853F]/20 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/40 transition-all duration-300 transform hover:scale-105">
            <FaBed size={24} />
            <span className="text-lg font-semibold">Reservar</span>
          </Link>
          
          <Link href="/check-in" className="flex items-center space-x-3 p-4 bg-[#CD853F]/40 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/60 transition-all duration-300 transform hover:scale-105">
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
        <h1 className="text-4xl font-bold text-[#8B4513] mb-8">Check-In</h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto"></div>
            <p className="mt-4 text-[#8B4513]">Cargando reservas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#8B4513]">Habitación {reserva.habitacion}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {reserva.estado}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#8B4513]">
                    <FaBed className="text-[#8B4513]" />
                    <span className="font-semibold">Tipo:</span>
                    <span>{reserva.tipo}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[#8B4513]">
                    <FaUser className="text-[#8B4513]" />
                    <span className="font-semibold">Fecha de llegada:</span>
                    <span>{reserva.fecha_llegada}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[#8B4513]">
                    <FaCar className="text-[#8B4513]" />
                    <span className="font-semibold">Hora de llegada:</span>
                    <span>{reserva.hora_llegada}</span>
                  </div>
                </div>

                {reserva.estado === 'Pendiente' && (
                  <button
                    onClick={() => handleCheckIn(reserva.id)}
                    className="w-full mt-6 bg-[#8B4513] text-white py-3 px-4 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105"
                  >
                    Realizar Check-In
                  </button>
                )}
              </div>
            ))}
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
    </div>
  );
} 