import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminTickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://${import.meta.env.VITE_API_URL}/api/admin/tickets')
        setTickets(response.data)
      } catch (err) {
        console.error('Failed to load tickets', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const handleDeleteTicket = async (tid, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await axios.delete(`http://${import.meta.env.VITE_API_URL}/api/admin/tickets/${tid}`)
      setTickets(tickets.filter(t => t.tid !== tid))
    } catch (err) {
      console.error('Failed to delete ticket', err)
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

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🎫 Manage Tickets
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {tickets.length} total tickets
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets table */}
      {loading ? (
        <p className="text-center text-gray-500 py-20">Loading tickets...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Client</th>
                <th className="px-6 py-3 text-left font-medium">Developer</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Budget</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.tid} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {ticket.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {ticket.client_name || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {ticket.developer_name || '⏳ Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">
                    {ticket.category || 'General'}
                  </td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400 font-medium">
                    R{ticket.budget || '0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(ticket.date_created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteTicket(ticket.tid, ticket.title)}
                      className="text-red-500 hover:text-red-400 text-xs transition"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default AdminTickets