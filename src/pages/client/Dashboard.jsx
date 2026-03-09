import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function ClientDashboard() {
  const { user, signOut } = useAuth()
  const [tickets, setTickets] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredTickets = tickets
    .filter(t => {
      const matchesTab = activeTab === 'all' || t.status === activeTab
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory
      return matchesTab && matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date_created) - new Date(a.date_created)
      if (sortBy === 'oldest') return new Date(a.date_created) - new Date(b.date_created)
      if (sortBy === 'budget_high') return Number(b.budget || 0) - Number(a.budget || 0)
      if (sortBy === 'budget_low') return Number(a.budget || 0) - Number(b.budget || 0)
      return 0
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, notifRes] = await Promise.all([
          axios.get(`http://${import.meta.env.VITE_API_URL}/api/tickets/client/${user.uid}`),
          axios.get(`http://${import.meta.env.VITE_API_URL}/api/notifications/${user.uid}`)
        ])
        setTickets(ticketsRes.data)
        setNotifications(notifRes.data.filter(n => !n.is_read))
      } catch (err) {
        console.error('Failed to load dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.uid])

  const statusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'closed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Tickets
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Welcome back, {user?.username}
            </p>
          </div>
          <button
            onClick={() => navigate('/client/tickets/new')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            + New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: tickets.length, color: 'text-gray-900 dark:text-white' },
            { label: 'Open', value: tickets.filter(t => t.status === 'open').length, color: 'text-blue-600' },
            { label: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, color: 'text-yellow-600' },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: 'text-green-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'open', 'in_progress', 'resolved', 'closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize
                ${activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3 flex-wrap items-center">

            {/* Search */}
            <input
              type="text"
              placeholder="Search your tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">📂 All Categories</option>
              <option value="bug fix">🐛 Bug Fix</option>
              <option value="new feature">✨ New Feature</option>
              <option value="consulting">💡 Consulting</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="data security">🔒 Data Security</option>
              <option value="other">📦 Other</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">🕒 Newest First</option>
              <option value="oldest">🕒 Oldest First</option>
              <option value="budget_high">💰 Highest Budget</option>
              <option value="budget_low">💰 Lowest Budget</option>
            </select>

            {/* Clear filters */}
            {(search || filterCategory !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setSearch('')
                  setFilterCategory('all')
                  setSortBy('newest')
                }}
                className="rounded-md border border-red-300 text-red-500 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900 transition"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>
        </div>

        {/* Tickets list */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-20">Loading tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No tickets match your search
            </p>
            <button
              onClick={() => {
                setSearch('')
                setFilterCategory('all')
                setSortBy('newest')
                setActiveTab('all')
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.tid}
                onClick={() => navigate(`/client/tickets/${ticket.tid}`)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ml-4 whitespace-nowrap ${statusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {ticket.description.length > 120
                    ? ticket.description.substring(0, 120) + '...'
                    : ticket.description}
                </p>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>📂 {ticket.category || 'General'}</span>
                  <span>💰 R{ticket.budget || '0.00'}</span>
                  <span>🕒 {new Date(ticket.date_created).toLocaleDateString()}</span>
                  <span>
                    {ticket.developer_name
                      ? `👨‍💻 ${ticket.developer_name}`
                      : '⏳ Awaiting developer'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

  )
}

export default ClientDashboard