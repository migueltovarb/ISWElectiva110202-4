import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { NotificationProvider, useNotification } from '../NotificationContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Componente de prueba para usar el hook
function TestComponent() {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    clearNotifications, 
    toasts, 
    markAllAsRead, 
    unreadCount 
  } = useNotification()

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <div data-testid="notifications-count">{notifications.length}</div>
      <div data-testid="toasts-count">{toasts.length}</div>
      
      <button onClick={() => addNotification('Test message', 'success')} data-testid="add-notification">
        Add Notification
      </button>
      <button onClick={() => addNotification('Error message', 'error')} data-testid="add-error">
        Add Error
      </button>
      <button onClick={markAllAsRead} data-testid="mark-all-read">
        Mark All Read
      </button>
      <button onClick={clearNotifications} data-testid="clear-all">
        Clear All
      </button>
      {notifications.length > 0 && (
        <button 
          onClick={() => removeNotification(notifications[0].id)} 
          data-testid="remove-first"
        >
          Remove First
        </button>
      )}
      
      {notifications.map(notif => (
        <div key={notif.id} data-testid={`notification-${notif.id}`}>
          {notif.message} - {notif.read ? 'read' : 'unread'}
        </div>
      ))}
    </div>
  )
}

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('inicializa con estado vacío cuando no hay localStorage', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0')
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByTestId('toasts-count')).toHaveTextContent('0')
  })

  it('carga notificaciones desde localStorage', () => {
    const storedNotifications = [
      { id: 1, message: 'Stored notification', type: 'info', read: false, date: '2023-01-01' }
    ]
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedNotifications))

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1')
    expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
  })

  it('agrega una notificación correctamente', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click()
    })

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1')
    expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    expect(screen.getByTestId('toasts-count')).toHaveTextContent('1')
    expect(screen.getByText('Test message - unread')).toBeInTheDocument()
  })

  it('elimina toasts después de 3 segundos', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click()
    })

    expect(screen.getByTestId('toasts-count')).toHaveTextContent('1')

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByTestId('toasts-count')).toHaveTextContent('0')
  })

  it('marca todas las notificaciones como leídas', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    // Agregar dos notificaciones
    act(() => {
      screen.getByTestId('add-notification').click()
      screen.getByTestId('add-error').click()
    })

    expect(screen.getByTestId('unread-count')).toHaveTextContent('2')

    act(() => {
      screen.getByTestId('mark-all-read').click()
    })

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByText('Test message - read')).toBeInTheDocument()
    expect(screen.getByText('Error message - read')).toBeInTheDocument()
  })

  it('elimina una notificación específica', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click()
    })

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1')

    act(() => {
      screen.getByTestId('remove-first').click()
    })

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0')
  })

  it('limpia todas las notificaciones', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click()
      screen.getByTestId('add-error').click()
    })

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('2')

    act(() => {
      screen.getByTestId('clear-all').click()
    })

    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0')
  })

  it('guarda en localStorage cuando cambian las notificaciones', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click()
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'hotel_notifications',
      expect.stringContaining('Test message')
    )
  })

  it('maneja diferentes tipos de notificaciones', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-notification').click() // success
      screen.getByTestId('add-error').click() // error
    })

    expect(screen.getByText('Test message - unread')).toBeInTheDocument()
    expect(screen.getByText('Error message - unread')).toBeInTheDocument()
  })
}) 