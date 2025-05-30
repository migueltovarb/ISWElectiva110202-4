'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaUser, FaLock, FaBellSlash, FaBed } from 'react-icons/fa';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";

export default function Configuraciones() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const userName = "Miguel"; // Esto vendría de tu sistema de autenticación

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const handleSaveSettings = () => {
    // Aquí implementarías la lógica para guardar la configuración
    alert('Configuraciones guardadas exitosamente');
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
          
          <Link href="/configuraciones" className="flex items-center space-x-3 p-4 bg-[#CD853F]/40 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/60 transition-all duration-300 transform hover:scale-105">
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
        <h1 className="text-4xl font-bold text-[#8B4513] mb-8">Configuraciones</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Perfil</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FaUser size={24} className="text-[#8B4513]" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#8B4513]">Nombre de Usuario</label>
                  <input
                    type="text"
                    value={userName}
                    className="mt-1 block w-full rounded-md border-[#DEB887] shadow-sm focus:border-[#8B4513] focus:ring focus:ring-[#CD853F] focus:ring-opacity-50"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FaLock size={24} className="text-[#8B4513]" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#8B4513]">Cambiar Contraseña</label>
                  <button className="mt-2 bg-[#8B4513] text-white px-4 py-2 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Notificaciones</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FFF3E0] rounded-xl">
                <div className="flex items-center space-x-4">
                  <FaBell size={24} className="text-[#8B4513]" />
                  <span className="text-[#8B4513] font-medium">Notificaciones Push</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DEB887] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B4513]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FFF3E0] rounded-xl">
                <div className="flex items-center space-x-4">
                  <FaBellSlash size={24} className="text-[#8B4513]" />
                  <span className="text-[#8B4513] font-medium">Modo No Molestar</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DEB887] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B4513]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-[#8B4513] text-white px-6 py-3 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Guardar Cambios
          </button>
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