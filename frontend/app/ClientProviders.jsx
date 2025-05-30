"use client";
import { NotificationProvider } from "../components/NotificationContext";
import ToastNotification from "../components/ToastNotification";

export default function ClientProviders({ children }) {
  return (
    <NotificationProvider>
      <ToastNotification />
      {children}
    </NotificationProvider>
  );
} 