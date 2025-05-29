"use client";

import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNotification } from './NotificationContext';

const typeStyles = {
  success: 'bg-green-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-600 text-white',
};

const typeIcons = {
  success: <FaCheckCircle className="mr-2" />, 
  info: <FaInfoCircle className="mr-2" />, 
  warning: <FaExclamationCircle className="mr-2" />, 
  error: <FaExclamationCircle className="mr-2" />,
};

export default function ToastNotification() {
  const { toasts } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center px-5 py-3 rounded-xl shadow-lg min-w-[220px] max-w-xs font-semibold animate-fade-in-up ${typeStyles[toast.type] || typeStyles.info}`}
          style={{ animation: 'fade-in-up 0.3s' }}
        >
          {typeIcons[toast.type] || typeIcons.info}
          <span>{toast.message}</span>
        </div>
      ))}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 