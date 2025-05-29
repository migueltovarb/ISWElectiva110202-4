"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const focusInput = (ref) => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const dataToSend = {
        full_name: formData.full_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirm_password
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registro/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseText = await response.text();
      console.log("Respuesta completa:", responseText);

      

      if (response.ok) {
        console.log('Usuario registrado con éxito!');
        setFormData({
          full_name: '',
          email: '',
          username: '',
          password: '',
          confirm_password: ''
        });
        alert('Usuario registrado correctamente');
        window.location.href = '/login';
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error al registrar usuario:', response.status, errorData);
        alert(`Error al registrar usuario: ${response.status}`);
      }
    } catch (error) {
      console.error('Hubo un error al comunicarse con el servidor:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center max-w-md">
          <div className="mb-4">
            <Image 
              src="/images/logo.png" 
              alt="Hotel Lindo Sueño Logo" 
              width={200} 
              height={100}
            />
          </div>
          <h1 className="text-4xl font-bold tracking-wider mb-2 text-center">HOTEL LINDO SUEÑO</h1>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="relative w-full h-full">
            <Image 
              src="/images/logo.png" 
              alt="Background Logo" 
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="bg-amber-950 p-8 rounded-lg shadow-lg w-full max-w-md z-10 relative">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Registro de usuario
          </h2>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <input
                ref={fullNameRef}
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                className="w-full px-4 py-3 rounded bg-amber-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 rounded bg-amber-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <input
                ref={usernameRef}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nombre de usuario"
                className="w-full px-4 py-3 rounded bg-amber-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <input
                ref={passwordRef}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                className="w-full px-4 py-3 rounded bg-amber-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <input
                ref={confirmPasswordRef}
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirmar contraseña"
                className="w-full px-4 py-3 rounded bg-amber-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded transition duration-300"
              >
                Registrarse
              </button>
            </div>
            <div className="text-center mt-4">
              <a href="/login" className="text-amber-200 hover:text-amber-100 text-sm">
                ¿Ya tienes una cuenta? Inicia sesión
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}