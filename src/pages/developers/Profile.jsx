import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function DeveloperProfile() {
  const { uid } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/developer/${uid}`)
        setData(response.data)
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [uid])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
        ⭐
      </span>
    ))
  }

  const avgRating = data?.reviews.length > 0
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : null

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-gray-500">Loading profile...</p>
    </div>
  )

  if (!data) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-gray-500">Developer not found</p>
    </div>
  )

  const { developer, tickets, reviews, stats } = data

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {developer.username.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {developer.username}
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium">
                Developer
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Member since {new Date(developer.date_created).toLocaleDateString()}
            </p>
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(Math.round(avgRating))}</div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {avgRating} / 5
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>

          {/* Hire button — only shown to clients */}
          {user?.role === 'client' && (
            <button
              onClick={() => navigate('/client/tickets/new')}
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              💼 Create a Ticket
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
          {[
            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
            { label: 'Active', value: stats.active, color: 'text-yellow-600' },
            { label: 'Avg Budget', value: `R${Number(stats.avg_budget).toFixed(0)}`, color: 'text-indigo-600' },
            { label: 'Total Earned', value: `R${Number(stats.total_earned).toFixed(0)}`, color: 'text-indigo-600' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['reviews', 'completed work'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize
              ${activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {tab === 'reviews' ? `⭐ Reviews (${reviews.length})` : `✅ Completed Work (${tickets.length})`}
          </button>
        ))}
      </div>

      {/* Reviews tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-4xl mb-3">⭐</p>
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.rid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                      {review.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.reviewer_name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(review.date_created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed work tab */}
      {activeTab === 'completed work' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-gray-500 dark:text-gray-400">No completed work yet</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.tid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400 ml-4 whitespace-nowrap">
                    R{ticket.budget || '0.00'}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  {ticket.description.length > 120
                    ? ticket.description.substring(0, 120) + '...'
                    : ticket.description}
                </p>
                <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>📂 {ticket.category || 'General'}</span>
                  <span>👤 {ticket.client_name}</span>
                  <span>✅ {ticket.date_resolved
                    ? new Date(ticket.date_resolved).toLocaleDateString()
                    : 'N/A'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  )
}

export default DeveloperProfile