'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaBed, FaUsers, FaCheckCircle, FaTimesCircle, FaTools, FaBell, FaCog, FaPowerOff } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function AdminHome() {
  const [value, onChange] = useState(new Date());
  const router = useRouter();
  const adminName = "Admin"; // Esto vendría de tu sistema de autenticación

  const handleLogout = () => {
    router.push('/login');
  };

  // Datos de ejemplo - En una implementación real, estos vendrían de una API
  const stats = {
    totalRooms: 50,
    occupiedRooms: 35,
    checkInsToday: 8,
    checkOutsToday: 6,
    availableRooms: 15,
    maintenanceRooms: 0
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#8B4513]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Link href="/admin/home" className="flex items-center p-4 bg-[#CD853F] text-white hover:bg-[#DEB887] transition-colors">
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
            
            <Link href="/admin/availability" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaCheckCircle className="mr-3" size={24} />
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between px-8">
            <h1 className="text-4xl text-white font-bold">Bienvenido, Administrador</h1>
            <div className="flex space-x-4">
              <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaBell size={24} className="text-gray-800" />
              </button>
              <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaCog size={24} className="text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">Estado del Hotel</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaBed size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">Habitaciones Totales</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.totalRooms}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaUsers size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">Habitaciones Ocupadas</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.occupiedRooms}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCheckCircle size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">Check-ins Hoy</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.checkInsToday}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaTimesCircle size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">Check-outs Hoy</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.checkOutsToday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">Disponibilidad</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaBed size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">Habitaciones Disponibles</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.availableRooms}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFDAB9] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaTools size={24} className="text-[#8B4513]" />
                    <div>
                      <p className="text-sm text-gray-600">En Mantenimiento</p>
                      <p className="text-2xl font-bold text-[#8B4513]">{stats.maintenanceRooms}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">Calendario de Reservas</h2>
            <Calendar
              onChange={onChange}
              value={value}
              className="w-full border-none shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 