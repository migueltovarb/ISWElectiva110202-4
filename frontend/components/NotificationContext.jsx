"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

const NOTIFICATIONS_KEY = 'hotel_notifications';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Cargar notificaciones desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Agregar una notificación (y mostrar toast)
  const addNotification = useCallback((message, type = 'info') => {
    const notif = {
      id: Date.now() + Math.random(),
      message,
      type,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
    setToasts(prev => [notif, ...prev]);
    // Eliminar toast después de 3 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notif.id));
    }, 3000);
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Contador de no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Eliminar una notificación del historial
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications, toasts, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
} 