import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://${import.meta.env.VITE_API_URL}/api/admin/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  )

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⚙️ Admin Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Platform overview for concept254
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/users')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            🎫 Manage Tickets
          </button>
        </div>
      </div>

      {/* Platform stats */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Platform Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'text-indigo-600' },
          { label: 'Clients', value: stats.clients, icon: '💼', color: 'text-green-600' },
          { label: 'Developers', value: stats.developers, icon: '👨‍💻', color: 'text-blue-600' },
          { label: 'Total Revenue', value: `R${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'text-yellow-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Ticket stats */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Ticket Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Tickets', value: stats.totalTickets, icon: '🎫', color: 'text-gray-900 dark:text-white' },
          { label: 'Open', value: stats.openTickets, icon: '🔵', color: 'text-blue-600' },
          { label: 'In Progress', value: stats.inProgressTickets, icon: '🟡', color: 'text-yellow-600' },
          { label: 'Closed', value: stats.closedTickets, icon: '🟢', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Blog stats */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Blog Overview
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total Posts', value: stats.totalPosts, icon: '📝', color: 'text-indigo-600' },
          { label: 'Total Comments', value: stats.totalComments, icon: '💬', color: 'text-indigo-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 text-center">
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default AdminDashboard