'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaMapMarkerAlt, FaSignOutAlt, FaMoneyBill, FaBell, FaCog, FaPowerOff, FaCreditCard, FaHistory, FaPlus, FaBed, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";
import { useNotification } from '../../components/NotificationContext';

export default function Pagos() {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('pending');
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardType, setCardType] = useState('credito');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentError, setPaymentError] = useState('');

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

        // Obtener la última reserva del localStorage
        const reservaGuardada = localStorage.getItem('ultima_reserva');
        if (reservaGuardada) {
          setUltimaReserva(JSON.parse(reservaGuardada));
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar los datos');
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

  const validatePayment = () => {
    if (!['debito', 'credito'].includes(cardType)) return 'Selecciona un tipo de tarjeta válido';
    if (!/^\d{16}$/.test(cardNumber)) return 'El número de tarjeta debe tener 16 dígitos';
    if (!/^\d{2}\/\d{2}$/.test(expDate)) return 'La fecha debe ser MM/AA';
    if (!/^\d{3}$/.test(cvc)) return 'El CVC debe tener 3 dígitos';
    return '';
  };

  const handlePago = async () => {
    const error = validatePayment();
    if (error) {
      setPaymentError(error);
      return;
    }
    setPaymentError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      // Actualizar el estado de la reserva a 'pagada' en el backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/${ultimaReserva.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pagada' }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la reserva a pagada');
      }
      // Simulación de pago exitoso
      localStorage.removeItem('ultima_reserva');
      setShowPaymentModal(false);
      addNotification('Reserva pagada', 'success');
      router.push('/home');
    } catch (err) {
      setPaymentError(err.message || 'Error al procesar el pago.');
    }
  };

  const handleCancelarReserva = async () => {
    if (!confirm('¿Está seguro que desea cancelar esta reserva?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Actualizar el estado de la reserva a 'cancelada'
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reservas/${ultimaReserva.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'cancelada'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la reserva');
      }

      // Limpiar el localStorage y redirigir
      localStorage.removeItem('ultima_reserva');
      addNotification('Reserva cancelada', 'info');
      router.push('/home');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al cancelar la reserva. Por favor, intente nuevamente.');
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

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto"></div>
            <p className="mt-4 text-[#8B4513]">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : ultimaReserva ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Reserva Confirmada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#8B4513]">
                  <FaBed size={20} />
                  <span className="font-semibold">Habitación:</span>
                  <span>{ultimaReserva.habitacion}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#8B4513]">
                  <FaBed size={20} />
                  <span className="font-semibold">Tipo:</span>
                  <span>{ultimaReserva.tipo}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#8B4513]">
                  <FaCalendarAlt size={20} />
                  <span className="font-semibold">Fechas:</span>
                  <span>{ultimaReserva.fecha_inicio} - {ultimaReserva.fecha_fin}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#8B4513]">
                  <FaCalendarAlt size={20} />
                  <span className="font-semibold">Noches:</span>
                  <span>{ultimaReserva.noches}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#FFF3E0] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Resumen de Pago</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#8B4513]">Precio por noche:</span>
                      <span className="text-[#8B4513]">${ultimaReserva.precio_noche}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B4513]">Noches:</span>
                      <span className="text-[#8B4513]">{ultimaReserva.noches}</span>
                    </div>
                    <div className="border-t border-[#CD853F] my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-[#8B4513]">Total:</span>
                      <span className="text-xl font-bold text-[#8B4513]">${ultimaReserva.total}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCancelarReserva}
                    className="w-1/2 bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FaTimes size={24} />
                    <span className="text-lg font-semibold">Cancelar Reserva</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-1/2 bg-[#8B4513] text-white py-4 rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FaCreditCard size={24} />
                    <span className="text-lg font-semibold">Proceder al Pago</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Modal de pago */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                  <h2 className="text-2xl font-bold text-black mb-6">Pago con Tarjeta</h2>
                  <form onSubmit={e => { e.preventDefault(); handlePago(); }} className="space-y-4">
                    <div>
                      <label className="block text-black font-semibold mb-1">Tipo de tarjeta</label>
                      <select value={cardType} onChange={e => setCardType(e.target.value)} className="w-full p-2 border rounded text-black">
                        <option value="credito">Crédito</option>
                        <option value="debito">Débito</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-black font-semibold mb-1">Número de tarjeta</label>
                      <input type="text" maxLength={16} value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} className="w-full p-2 border rounded text-black placeholder:text-gray-700" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-black font-semibold mb-1">Exp. (MM/AA)</label>
                        <input type="text" maxLength={5} value={expDate} onChange={e => setExpDate(e.target.value.replace(/[^\d\/]/g, ''))} className="w-full p-2 border rounded text-black placeholder:text-gray-700" placeholder="MM/AA" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-black font-semibold mb-1">CVC</label>
                        <input type="text" maxLength={3} value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, ''))} className="w-full p-2 border rounded text-black placeholder:text-gray-700" placeholder="123" />
                      </div>
                    </div>
                    {paymentError && <div className="text-red-600 text-sm mt-2">{paymentError}</div>}
                    <div className="flex justify-end space-x-4 mt-6">
                      <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-[#8B4513] hover:text-[#A0522D] transition-colors font-semibold">Cancelar</button>
                      <button type="submit" className="px-4 py-2 bg-[#8B4513] text-white rounded-xl hover:bg-[#A0522D] transition-all duration-300 transform hover:scale-105 font-semibold">Pagar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">No hay pagos pendientes</h2>
            <p className="text-[#8B4513]">No tienes ninguna reserva pendiente de pago.</p>
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