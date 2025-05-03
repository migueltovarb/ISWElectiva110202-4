'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaCreditCard, FaHistory, FaPlus, FaBed } from 'react-icons/fa';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";

export default function Pagos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  // Datos de ejemplo para pagos pendientes
  const pendingPayments = [
    {
      id: 1,
      description: 'Reserva Habitación 101',
      amount: 150.00,
      dueDate: '2024-03-20',
      status: 'Pendiente'
    },
    {
      id: 2,
      description: 'Servicio de Room Service',
      amount: 45.50,
      dueDate: '2024-03-21',
      status: 'Pendiente'
    }
  ];

  // Datos de ejemplo para historial de pagos
  const paymentHistory = [
    {
      id: 1,
      description: 'Reserva Habitación 203',
      amount: 200.00,
      date: '2024-03-15',
      status: 'Completado'
    },
    {
      id: 2,
      description: 'Servicio de Lavandería',
      amount: 30.00,
      date: '2024-03-14',
      status: 'Completado'
    }
  ];

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
          
          <Link href="/pagos" className="flex items-center space-x-3 p-4 bg-[#CD853F]/40 backdrop-blur-sm text-white rounded-xl hover:bg-[#CD853F]/60 transition-all duration-300 transform hover:scale-105">
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
        <h1 className="text-4xl font-bold text-[#8B4513] mb-8">Pagos</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'pending'
                ? 'bg-[#8B4513] text-white shadow-lg'
                : 'bg-white/90 backdrop-blur-sm text-[#8B4513] hover:bg-white'
            }`}
          >
            <FaCreditCard className="inline-block mr-2" />
            Pagos Pendientes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'history'
                ? 'bg-[#8B4513] text-white shadow-lg'
                : 'bg-white/90 backdrop-blur-sm text-[#8B4513] hover:bg-white'
            }`}
          >
            <FaHistory className="inline-block mr-2" />
            Historial de Pagos
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          {activeTab === 'pending' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#8B4513]">Pagos Pendientes</h2>
                <button className="bg-[#8B4513] text-white px-4 py-2 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 flex items-center">
                  <FaPlus className="mr-2" />
                  Agregar Pago
                </button>
              </div>
              <div className="grid gap-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="bg-[#FFF3E0] p-6 rounded-xl hover:bg-[#FFE4C4] transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-[#8B4513]">{payment.description}</h3>
                        <p className="text-[#A0522D]">Fecha de vencimiento: {payment.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#8B4513]">${payment.amount.toFixed(2)}</p>
                        <span className="inline-block px-3 py-1 bg-[#8B4513]/20 text-[#8B4513] rounded-full text-sm">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="bg-[#8B4513] text-white px-4 py-2 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105">
                        Realizar Pago
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Historial de Pagos</h2>
              <div className="grid gap-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="bg-[#FFF3E0] p-6 rounded-xl hover:bg-[#FFE4C4] transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-[#8B4513]">{payment.description}</h3>
                        <p className="text-[#A0522D]">Fecha: {payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#8B4513]">${payment.amount.toFixed(2)}</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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