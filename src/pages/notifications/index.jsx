import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/notifications/${user.uid}`)
        setNotifications(response.data)
      } catch (err) {
        console.error('Failed to load notifications', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [user.uid])

  const handleMarkAsRead = async (nid) => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_URL}/api/notifications/${nid}/read`)
      setNotifications(notifications.map(n =>
        n.nid === nid ? { ...n, is_read: true } : n
      ))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read)
      await Promise.all(unread.map(n =>
        axios.put(`http://${import.meta.env.VITE_API_URL}/api/notifications/${n.nid}/read`)
      ))
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await handleMarkAsRead(notification.nid)
    }

    // Navigate to the relevant ticket based on user role
    if (notification.ticket_id) {
      if (user.role === 'client') {
        navigate(`/client/tickets/${notification.ticket_id}`)
      } else if (user.role === 'developer') {
        navigate(`/developer/tickets/${notification.ticket_id}`)
      }
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const dashboardPath = user?.role === 'developer'
    ? '/developer/dashboard'
    : '/client/dashboard'

  return (
      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              🔔 Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔕</p>
            <p className="text-gray-500 dark:text-gray-400">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.nid}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition flex justify-between items-start gap-4
                  ${!notification.is_read
                    ? 'border-l-4 border-indigo-600'
                    : 'border-l-4 border-transparent'
                  }`}
              >
                <div className="flex gap-4 items-start">

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                    ${!notification.is_read
                      ? 'bg-indigo-100 dark:bg-indigo-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {notification.message.includes('picked up') ? '👨‍💻' :
                     notification.message.includes('resolved') ? '✅' :
                     notification.message.includes('closed') ? '🎉' :
                     notification.message.includes('message') ? '💬' :
                     notification.message.includes('New ticket') ? '🎫' : '🔔'}
                  </div>

                  {/* Message */}
                  <div>
                    <p className={`text-sm ${!notification.is_read
                      ? 'font-semibold text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(notification.date_created).toLocaleDateString()} at{' '}
                      {new Date(notification.date_created).toLocaleTimeString()}
                    </p>
                    {notification.ticket_id && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                        View ticket →
                      </p>
                    )}
                  </div>
                </div>

                {/* Unread dot */}
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
  )
}

export default Notifications