'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaBed, FaBell, FaCog, FaPowerOff, FaSave, FaUser, FaClock } from 'react-icons/fa';

export default function Configuraciones() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState({
    check_in_time: '14:00',
    check_out_time: '12:00',
  });
  const [userConfig, setUserConfig] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchConfig();
    fetchUserInfo();
  }, [router]);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        router.push('/login');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configuraciones/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error al cargar las configuraciones');
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error en fetchConfig:', error);
      setError('Error de conexión con el servidor. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        router.push('/login');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/user-info/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserConfig(prev => ({
          ...prev,
          username: data.username,
          email: data.email,
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error al cargar la información del usuario');
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error en fetchUserInfo:', error);
      setError('Error al cargar la información del usuario. Por favor, intente más tarde.');
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserConfigChange = (e) => {
    const { name, value } = e.target;
    setUserConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configuraciones/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al guardar las configuraciones');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleUserConfigSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (userConfig.newPassword && userConfig.newPassword !== userConfig.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/update-profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userConfig.username,
          email: userConfig.email,
          current_password: userConfig.currentPassword,
          new_password: userConfig.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Limpiar campos de contraseña
        setUserConfig(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF3E0] flex items-center justify-center">
        <div className="text-black text-xl">Cargando...</div>
      </div>
    );
  }

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

            <Link href="/admin/notificaciones" className="flex items-center p-4 text-white hover:bg-[#CD853F] transition-colors">
              <FaBell className="mr-3" size={24} />
              <span className="text-lg">Notificaciones</span>
            </Link>
            
            <Link href="/admin/configuraciones" className="flex items-center p-4 bg-[#CD853F] text-white hover:bg-[#DEB887] transition-colors">
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
      <div className="flex-1 overflow-auto">
        {/* Top Banner */}
        <div className="h-64 relative">
          <Image
            src="/images/hotel-banner.jpg"
            alt="Hotel Banner"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center px-8">
            <h1 className="text-4xl text-white font-bold">Configuraciones</h1>
          </div>
        </div>

        {/* Configuration Forms */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Cambios guardados exitosamente
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Horarios Form */}
            <form onSubmit={handleConfigSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaClock className="mr-2" />
                Horarios
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Check-in
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    value={config.check_in_time}
                    onChange={handleConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Check-out
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    value={config.check_out_time}
                    onChange={handleConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#CD853F] transition-colors"
                >
                  <FaSave className="mr-2" />
                  Guardar Horarios
                </button>
              </div>
            </form>

            {/* User Profile Form */}
            <form onSubmit={handleUserConfigSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-2" />
                Perfil de Usuario
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userConfig.username}
                    onChange={handleUserConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userConfig.email}
                    onChange={handleUserConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={userConfig.currentPassword}
                    onChange={handleUserConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={userConfig.newPassword}
                    onChange={handleUserConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userConfig.confirmPassword}
                    onChange={handleUserConfigChange}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#CD853F] transition-colors"
                >
                  <FaSave className="mr-2" />
                  Actualizar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 