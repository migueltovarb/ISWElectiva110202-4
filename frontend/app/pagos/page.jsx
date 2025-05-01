'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaCreditCard, FaHistory, FaBed, FaUtensils, FaWifi, FaParking } from 'react-icons/fa';

export default function Pagos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  const pendingPayments = [
    {
      id: 1,
      roomNumber: '101',
      amount: 150,
      dueDate: '2024-03-20',
      description: 'Reserva de habitación - 2 noches',
      costBreakdown: {
        roomRate: 120,
        services: [
          { name: 'Desayuno', amount: 15 },
          { name: 'WiFi', amount: 10 },
          { name: 'Estacionamiento', amount: 5 }
        ]
      }
    },
    {
      id: 2,
      roomNumber: '203',
      amount: 80,
      dueDate: '2024-03-25',
      description: 'Servicios adicionales',
      costBreakdown: {
        roomRate: 0,
        services: [
          { name: 'Servicio a la habitación', amount: 30 },
          { name: 'Lavandería', amount: 25 },
          { name: 'Minibar', amount: 25 }
        ]
      }
    }
  ];

  const paymentHistory = [
    {
      id: 3,
      roomNumber: '305',
      amount: 200,
      date: '2024-03-01',
      description: 'Reserva de habitación - 3 noches',
      status: 'Completado',
      costBreakdown: {
        roomRate: 180,
        services: [
          { name: 'Desayuno', amount: 15 },
          { name: 'WiFi', amount: 5 }
        ]
      }
    },
    {
      id: 4,
      roomNumber: '102',
      amount: 120,
      date: '2024-02-28',
      description: 'Reserva de habitación - 1 noche',
      status: 'Completado',
      costBreakdown: {
        roomRate: 100,
        services: [
          { name: 'Desayuno', amount: 15 },
          { name: 'Estacionamiento', amount: 5 }
        ]
      }
    }
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  const handlePayment = (paymentId) => {
    // Aquí implementarías la lógica de pago
    alert(`Procesando pago ID: ${paymentId}`);
  };

  const renderCostBreakdown = (breakdown) => {
    return (
      <div className="mt-4 border-t border-[#DEB887] pt-4">
        <h4 className="text-sm font-semibold text-[#8B4513] mb-2">Desglose de Costos:</h4>
        <div className="space-y-2">
          {breakdown.roomRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#A0522D]">Tarifa de habitación</span>
              <span className="text-[#8B4513]">${breakdown.roomRate}</span>
            </div>
          )}
          {breakdown.services.map((service, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-[#A0522D]">{service.name}</span>
              <span className="text-[#8B4513]">${service.amount}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold border-t border-[#DEB887] pt-2 mt-2">
            <span className="text-[#8B4513]">Total</span>
            <span className="text-[#8B4513]">${breakdown.roomRate + breakdown.services.reduce((sum, service) => sum + service.amount, 0)}</span>
          </div>
        </div>
      </div>
    );
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
          
          <Link href="/pagos" className="flex items-center space-x-3 p-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
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
            alt="Hotel Payments"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8">
            <h1 className="text-4xl font-bold text-white">
              Pagos
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-[#8B4513] text-white'
                    : 'bg-[#FFDAB9] text-[#8B4513] hover:bg-[#DEB887]'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaCreditCard size={20} />
                  <span>Pagos Pendientes</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'history'
                    ? 'bg-[#8B4513] text-white'
                    : 'bg-[#FFDAB9] text-[#8B4513] hover:bg-[#DEB887]'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaHistory size={20} />
                  <span>Historial de Pagos</span>
                </div>
              </button>
            </div>

            {/* Payment Content */}
            <div className="bg-[#FFDAB9] rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {activeTab === 'pending' ? (
                  <>
                    <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Pagos Pendientes</h2>
                    <div className="space-y-4">
                      {pendingPayments.map((payment) => (
                        <div key={payment.id} className="bg-white p-4 rounded-lg shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-[#8B4513]">
                                Habitación {payment.roomNumber}
                              </h3>
                              <p className="text-[#A0522D] mt-1">{payment.description}</p>
                              <p className="text-sm text-[#DEB887] mt-2">
                                Fecha límite: {payment.dueDate}
                              </p>
                              {renderCostBreakdown(payment.costBreakdown)}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#8B4513]">
                                ${payment.amount}
                              </p>
                              <button
                                onClick={() => handlePayment(payment.id)}
                                className="mt-2 bg-[#8B4513] text-white px-4 py-2 rounded-md hover:bg-[#A0522D] transition-colors"
                              >
                                Pagar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Historial de Pagos</h2>
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-[#8B4513]">
                                Habitación {payment.roomNumber}
                              </h3>
                              <p className="text-[#A0522D] mt-1">{payment.description}</p>
                              <p className="text-sm text-[#DEB887] mt-2">
                                Fecha: {payment.date}
                              </p>
                              {renderCostBreakdown(payment.costBreakdown)}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#8B4513]">
                                ${payment.amount}
                              </p>
                              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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