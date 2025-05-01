'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaUser, FaLock, FaBellSlash } from 'react-icons/fa';

export default function Configuraciones() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const userName = "Miguel"; // Esto vendría de tu sistema de autenticación

  const handleLogout = () => {
    router.push('/login');
  };

  const handleSaveSettings = () => {
    // Aquí implementarías la lógica para guardar la configuración
    alert('Configuraciones guardadas exitosamente');
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
          
          <Link href="/configuraciones" className="flex items-center space-x-3 p-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
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
            alt="Hotel Settings"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8">
            <h1 className="text-4xl font-bold text-white">
              Configuraciones
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Settings */}
            <div className="bg-[#FFDAB9] p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Perfil de Usuario</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                  <FaUser size={24} className="text-[#8B4513]" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#8B4513]">Nombre de Usuario</label>
                    <input 
                      type="text" 
                      value={userName}
                      className="mt-1 w-full p-2 border border-[#DEB887] rounded-md"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                  <FaLock size={24} className="text-[#8B4513]" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#8B4513]">Cambiar Contraseña</label>
                    <button className="mt-1 bg-[#8B4513] text-white px-4 py-2 rounded-md hover:bg-[#A0522D] transition-colors">
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[#FFDAB9] p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Notificaciones</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FaBell size={24} className="text-[#8B4513]" />
                    <span className="text-[#8B4513]">Notificaciones Push</span>
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

                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FaBellSlash size={24} className="text-[#8B4513]" />
                    <span className="text-[#8B4513]">Modo No Molestar</span>
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

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSaveSettings}
                className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#A0522D] transition-colors"
              >
                Guardar Cambios
              </button>
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