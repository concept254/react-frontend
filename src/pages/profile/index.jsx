import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function Profile() {
  const { user, signOut } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get/userprofile/${user.uid}`)
        setPosts(response.data)
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user.uid])

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {/* User info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.username}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {user?.email}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Member since {new Date(user?.date_created).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {posts.length}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {posts.reduce((sum, p) => sum + p.likes, 0)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {user?.email_verified ? '✅' : '❌'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Verified</p>
            </div>
          </div>

          {/* Sign out */}
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
            <button
              onClick={() => { signOut(); navigate('/signin') }}
              className="text-sm text-red-500 hover:text-red-400 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* User posts */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          My Posts
        </h3>

        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            Loading posts...
          </p>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't written any posts yet.
            </p>
            <button
              onClick={() => navigate('/createpost')}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Write your first post
            </button>
          </div>
        )}

        {!loading && posts.map((post) => (
          <div
            key={post.pid}
            onClick={() => navigate(`/post/${post.pid}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h4>
              <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                {new Date(post.date_created).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
              {post.body.length > 120 ? post.body.substring(0, 120) + '...' : post.body}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ❤️ {post.likes} likes
            </span>
          </div>
        ))}
      </main>

  )
}

export default Profile