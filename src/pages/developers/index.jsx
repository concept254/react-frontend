import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Developers() {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/developers`)
        setDevelopers(response.data)
      } catch (err) {
        console.error('Failed to load developers', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDevelopers()
  }, [])

  const filteredDevelopers = developers.filter(d =>
    d.username.toLowerCase().includes(search.toLowerCase())
  )

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating))
    return '⭐'.repeat(rounded) || '—'
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          👨‍💻 Our Developers
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Browse our talented developers and view their profiles
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Developers grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-20">Loading developers...</p>
      ) : filteredDevelopers.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No developers found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev.uid}
              onClick={() => navigate(`/developers/${dev.uid}`)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {dev.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dev.username}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Member since {new Date(dev.date_created).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {dev.completed_tickets}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {Number(dev.avg_rating).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {dev.total_reviews}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Reviews</p>
                </div>
              </div>

              {/* Rating stars */}
              <div className="mt-3 text-center text-sm">
                {renderStars(dev.avg_rating)}
              </div>

              <p className="text-center text-xs text-indigo-600 dark:text-indigo-400 mt-3 hover:underline">
                View Profile →
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Developers