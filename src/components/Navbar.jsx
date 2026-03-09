import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'

function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const { darkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/${user.uid}`)
        setUnreadCount(response.data.filter(n => !n.is_read).length)
      } catch (err) {
        console.error('Failed to fetch notifications', err)
      }
    }
    fetchUnread()
  }, [user, location.pathname])  // refetch on every page change

  const getDashboardPath = () => {
    if (user?.role === 'developer') return '/developer/dashboard'
    if (user?.role === 'client') return '/client/dashboard'
    return '/landing'
  }

  const isActive = (path) => location.pathname === path
    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-6">
        <h1
          onClick={() => navigate(getDashboardPath())}
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          concept254
        </h1>

        {/* Main nav links */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/landing')}
            className={`text-sm transition ${isActive('/landing')}`}
          >
            📝 Blog
          </button>

          {/* Client links */}
          {user?.role === 'client' && (
            <>
              <button
                onClick={() => navigate('/client/dashboard')}
                className={`text-sm transition ${isActive('/client/dashboard')}`}
              >
                💼 My Tickets
              </button>
              <button
                onClick={() => navigate('/client/tickets/new')}
                className={`text-sm transition ${isActive('/client/tickets/new')}`}
              >
                + New Ticket
              </button>
              <button
                onClick={() => navigate('/developers')}
                className={`text-sm transition ${isActive('/developers')}`}
              >
                👨‍💻 Developers
              </button>
            </>
          )}

          {/* Developer links */}
          {user?.role === 'developer' && (
            <>
              <button
                onClick={() => navigate('/developer/dashboard')}
                className={`text-sm transition ${isActive('/developer/dashboard')}`}
              >
                👨‍💻 Dashboard
              </button>
            </>
          )}

          {/* Admin links */}
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`text-sm transition ${isActive('/admin/dashboard')}`}
              >
                ⚙️ Admin
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className={`text-sm transition ${isActive('/admin/users')}`}
              >
                👥 Users
              </button>
              <button
                onClick={() => navigate('/admin/tickets')}
                className={`text-sm transition ${isActive('/admin/tickets')}`}
              >
                🎫 Tickets
              </button>
              <button
                onClick={() => navigate('/landing')}
                className={`text-sm transition ${isActive('/landing')}`}
              >
                📝 Blog
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {/* Create post — for all roles */}
        <button
          onClick={() => navigate('/createpost')}
          className="hidden md:block text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-500 transition"
        >
          + Post
        </button>

        {/* Notifications bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className={`text-sm transition ${isActive('/profile')}`}
        >
          👤 {user?.username}
        </button>

        {/* Role badge */}
        <span className={`hidden md:block text-xs px-2 py-1 rounded-full font-medium
          ${user?.role === 'developer'
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
            : user?.role === 'client'
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-600'
          }`}
        >
          {user?.role}
        </span>

        {/* Sign out */}
        <button
          onClick={() => { signOut(); navigate('/signin') }}
          className="text-sm text-red-500 hover:text-red-400 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar