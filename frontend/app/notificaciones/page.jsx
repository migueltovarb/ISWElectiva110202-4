'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaCheck, FaTrash } from 'react-icons/fa';

export default function Notificaciones() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Reserva Confirmada',
      message: 'Tu reserva para la habitación 101 ha sido confirmada.',
      date: '2024-03-15',
      read: false
    },
    {
      id: 2,
      title: 'Recordatorio de Check-in',
      message: 'Tu check-in está programado para mañana a las 14:00.',
      date: '2024-03-14',
      read: false
    },
    {
      id: 3,
      title: 'Promoción Especial',
      message: 'Aprovecha un 20% de descuento en tu próxima reserva.',
      date: '2024-03-13',
      read: true
    }
  ]);

  const handleLogout = () => {
    router.push('/login');
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
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
          
          <Link href="/notificaciones" className="flex items-center space-x-3 p-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
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
            alt="Hotel Notifications"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8">
            <h1 className="text-4xl font-bold text-white">
              Notificaciones
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#FFDAB9] rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Centro de Notificaciones</h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`bg-white p-4 rounded-lg transition-all ${
                        notification.read ? 'opacity-75' : 'shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-[#A0522D]' : 'text-[#8B4513]'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-[#A0522D] mt-1">{notification.message}</p>
                          <p className="text-sm text-[#DEB887] mt-2">{notification.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-[#8B4513] hover:text-[#A0522D] transition-colors"
                              title="Marcar como leída"
                            >
                              <FaCheck size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-[#8B4513] hover:text-[#A0522D] transition-colors"
                            title="Eliminar notificación"
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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