import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`)
        setUsers(response.data)
      } catch (err) {
        console.error('Failed to load users', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (uid, newRole) => {
    try {
      const response = await axios.put(`https://${import.meta.env.VITE_API_URL}/api/admin/users/${uid}/role`, {
        role: newRole
      })
      setUsers(users.map(u => u.uid === uid ? { ...u, role: response.data.role } : u))
    } catch (err) {
      console.error('Failed to update role', err)
    }
  }

  const handleDeleteUser = async (uid, username) => {
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) return
    try {
      await axios.delete(`https://${import.meta.env.VITE_API_URL}/api/admin/users/${uid}`)
      setUsers(users.filter(u => u.uid !== uid))
    } catch (err) {
      console.error('Failed to delete user', err)
    }
  }

  const roleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'developer': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
      case 'client': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            👥 Manage Users
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {users.length} total users
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Users table */}
      {loading ? (
        <p className="text-center text-gray-500 py-20">Loading users...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left font-medium">User</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Verified</th>
                <th className="px-6 py-3 text-left font-medium">Joined</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {u.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${roleColor(u.role)}`}
                    >
                      <option value="client">client</option>
                      <option value="developer">developer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={u.email_verified ? 'text-green-500' : 'text-red-400'}>
                      {u.email_verified ? '✅' : '❌'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(u.date_created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(u.uid, u.username)}
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

export default AdminUsers