import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function Landing() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://${import.meta.env.VITE_API_URL}/api/get/allposts')
        setPosts(response.data)
      } catch (err) {
        setError('Failed to load posts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Latest Posts
        </h2>

        {/* Loading state */}
        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            Loading posts...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            No posts yet. Be the first to write one!
          </div>
        )}

        {/* Posts list */}
        {!loading && !error && posts.map((post) => (
          <div
            key={post.pid}
            onClick={() => navigate(`/post/${post.pid}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition cursor-pointer"
          >
            {/* Post header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-4 whitespace-nowrap">
                {new Date(post.date_created).toLocaleDateString()}
              </span>
            </div>

            {/* Post body preview */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {post.body.length > 150 ? post.body.substring(0, 150) + '...' : post.body}
            </p>

            {/* Post footer */}
            <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
              <span>✍️ {post.author}</span>
              <span>❤️ {post.likes} likes</span>
            </div>
          </div>
        ))}
      </main>

  )
}

export default Landing