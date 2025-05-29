'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaBed, FaBell, FaCog, FaPowerOff, FaTrash } from 'react-icons/fa';

export default function Notificaciones() {
  const router = useRouter();
  
  // Datos de ejemplo - En una implementación real, estos vendrían de una API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nueva reservación',
      message: 'Se ha realizado una nueva reservación para la habitación 101',
      date: '2024-01-29 10:30',
      read: false
    },
    {
      id: 2,
      title: 'Check-out pendiente',
      message: 'Recordatorio: Check-out pendiente en la habitación 205',
      date: '2024-01-29 09:15',
      read: true
    },
    {
      id: 3,
      title: 'Mantenimiento completado',
      message: 'El mantenimiento de la habitación 304 ha sido completado',
      date: '2024-01-28 16:45',
      read: true
    }
  ]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleDeleteNotification = (id) => {
    if (confirm('¿Está seguro de que desea eliminar esta notificación?')) {
      setNotifications(notifications.filter(notif => notif.id !== id));
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
            
            <Link href="/admin/availability" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaBed className="mr-3" size={24} />
              <span className="text-lg">Disponibilidad</span>
            </Link>

            <Link href="/admin/notificaciones" className="flex items-center p-4 bg-[#CD853F] text-white hover:bg-[#DEB887] transition-colors">
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
            src="/images/hotel-banner.jpg"
            alt="Hotel Banner"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between px-8">
            <h1 className="text-4xl text-white font-bold">Notificaciones</h1>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-md">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 ${
                  notification.read ? 'bg-white' : 'bg-[#FFDAB9] bg-opacity-30'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#8B4513]">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 