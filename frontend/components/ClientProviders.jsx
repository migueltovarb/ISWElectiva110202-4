"use client";
import { NotificationProvider } from "./NotificationContext";
import ToastNotification from "./ToastNotification";

export default function ClientProviders({ children }) {
  return (
    <NotificationProvider>
      <ToastNotification />
      {children}
    </NotificationProvider>
  );
} 