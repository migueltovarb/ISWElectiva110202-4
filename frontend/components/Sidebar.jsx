import React from 'react';
import Link from 'next/link';

const Sidebar = ({ activeItem }) => {
  const menuItems = [
    { name: "Home", path: "/admin/home" },
    { name: "Reservas", path: "/admin/reservas" },
    { name: "Check in", path: "/admin/checkin" },
    { name: "Check out", path: "/admin/checkout" },
    { name: "Pagos", path: "/admin/pagos" },
    { name: "Notificaciones", path: "/admin/notificaciones" },
    { name: "Reportes", path: "/admin/reportes" },
    { name: "Configuraciones", path: "/admin/configuraciones" }
  ];

  return (
    <div className="w-64 bg-amber-100 min-h-screen flex flex-col">
      <div className="bg-orange-500 text-white py-4 text-center font-bold text-xl">
        Hotel Lindo Sueño
      </div>
      
      {menuItems.map((item) => (
        <Link 
          href={item.path} 
          key={item.name}
          className={`py-4 px-6 text-center transition-colors ${
            activeItem === item.name 
            ? 'bg-orange-700 text-white font-medium' 
            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          {item.name}
        </Link>
      ))}
      
      <div className="flex-grow bg-amber-100"></div>
    </div>
  );
};

export default Sidebar;