"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y la información del usuario
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('is_admin', data.is_admin);
        localStorage.setItem('is_superuser', data.is_superuser);

        // Redirigir según el tipo de usuario
        if (data.is_superuser) {
          router.push('/admin/home');
        } else if (data.is_admin) {
          router.push('/admin/home');
        } else {
          router.push('/home');
        }
      } else {
        setError(data.detail || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3E0] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B4513]">Iniciar Sesión</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#CD853F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-[#8B4513] hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}