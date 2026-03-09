import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function NewTicket() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('bug fix')
  const [budget, setBudget] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }
    setSubmitting(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tickets/create', {
        title,
        description,
        category,
        budget: budget || null,
        client_id: user.uid
      })
      navigate(`/client/tickets/${response.data.tid}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🎫 Submit a New Ticket
          </h2>

          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Brief summary of your issue or request"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="bug fix">🐛 Bug Fix</option>
                <option value="new feature">✨ New Feature</option>
                <option value="consulting">💡 Consulting</option>
                <option value="maintenance">🔧 Maintenance</option>
                <option value="data security">🔒 Data Security</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Describe your issue or request in detail. Include any relevant code, error messages, or links."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget (R) — Optional
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Set a budget to attract developers faster
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting || !title.trim() || !description.trim()}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Submitting...' : '🎫 Submit Ticket'}
              </button>
              <button
                onClick={() => navigate('/client/dashboard')}
                className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </main>

  )
}

export default NewTicket