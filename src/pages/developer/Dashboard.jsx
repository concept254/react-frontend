import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function DeveloperDashboard() {
  const { user, signOut } = useAuth()
  const [openTickets, setOpenTickets] = useState([])
  const [myTickets, setMyTickets] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('browse')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const filteredOpenTickets = openTickets

  .filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.client_name?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesCategory
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
        const [openRes, myRes, notifRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/tickets`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/developer/${user.uid}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/notifications/${user.uid}`)
        ])
        setOpenTickets(openRes.data)
        setMyTickets(myRes.data)
        setNotifications(notifRes.data.filter(n => !n.is_read))
      } catch (err) {
        console.error('Failed to load dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.uid])

  const handlePickUpTicket = async (tid) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${tid}/assign`, {
        developer_id: user.uid
      })
      // Move ticket from open to my tickets
      const picked = openTickets.find(t => t.tid === tid)
      setOpenTickets(openTickets.filter(t => t.tid !== tid))
      setMyTickets([{ ...picked, status: 'in_progress', developer_name: user.username }, ...myTickets])
      navigate(`/developer/tickets/${tid}`)
    } catch (err) {
      console.error('Failed to pick up ticket', err)
    }
  }

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Developer Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back, {user?.username}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open Tickets', value: openTickets.length, color: 'text-blue-600' },
            { label: 'My Active', value: myTickets.filter(t => t.status === 'in_progress').length, color: 'text-yellow-600' },
            { label: 'Resolved', value: myTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, color: 'text-green-600' },
            { label: 'Total Earned', value: `R${myTickets.filter(t => t.status === 'closed').reduce((sum, t) => sum + Number(t.budget || 0), 0).toFixed(2)}`, color: 'text-indigo-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeTab === 'browse'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
          >
            🔍 Browse Open Tickets ({openTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeTab === 'my'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
          >
            📋 My Tickets ({myTickets.length})
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-20">Loading...</p>
        ) : (
          <>
            {/* Browse open tickets */}
            {activeTab === 'browse' && (
              <div>
              {/* Search and filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 space-y-3">

                {/* Single row — search + filters */}
                <div className="flex gap-3 flex-wrap items-center">

                  {/* Search input — flex-1 so it takes remaining space */}
                  <input
                    type="text"
                    placeholder="Search tickets..."
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
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {filteredOpenTickets.length} of {openTickets.length} open tickets
                </p>
              </div>
                
                {/* Tickets list */}
                {filteredOpenTickets.length === 0 ? (
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
                      }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOpenTickets.map((ticket) => (
                      <div
                        key={ticket.tid}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                              R{ticket.budget || '0.00'}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                          {ticket.description.length > 150
                            ? ticket.description.substring(0, 150) + '...'
                            : ticket.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span>📂 {ticket.category || 'General'}</span>
                            <span>👤 {ticket.client_name}</span>
                            <span>🕒 {new Date(ticket.date_created).toLocaleDateString()}</span>
                          </div>
                          <button
                            onClick={() => handlePickUpTicket(ticket.tid)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                          >
                            Pick Up Ticket
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My tickets */}
            {activeTab === 'my' && (
              <div className="space-y-4">
                {myTickets.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-20">
                    You haven't picked up any tickets yet.
                  </p>
                ) : (
                  myTickets.map((ticket) => (
                    <div
                      key={ticket.tid}
                      onClick={() => navigate(`/developer/tickets/${ticket.tid}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {ticket.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                            R{ticket.budget || '0.00'}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        {ticket.description.length > 150
                          ? ticket.description.substring(0, 150) + '...'
                          : ticket.description}
                      </p>

                      <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <span>📂 {ticket.category || 'General'}</span>
                        <span>👤 Client: {ticket.client_name}</span>
                        <span>🕒 {new Date(ticket.date_created).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

  )
}

export default DeveloperDashboard