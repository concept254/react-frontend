import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const { user } = useAuth()

  const handleCreatePost = async () => {
    setError(null)

    // Validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!body.trim()) {
      setError('Body is required')
      return
    }
    if (title.length > 255) {
      setError('Title must be under 255 characters')
      return
    }

    setSubmitting(true)
    try {
      const response = await axios.post('http://${import.meta.env.VITE_API_URL}/api/post/createpost', {
        title,
        body,
        user_id: user.uid,
        author: user.username
      })
      console.log('Created post:', response.data)
      navigate(`/post/${response.data.pid}`)   // redirect to the new post
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ✍️ Create New Post
          </h2>

          <div className="space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="postTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="postTitle"
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Character counter */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {title.length}/255
              </p>
            </div>

            {/* Body */}
            <div>
              <label
                htmlFor="postBody"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content
              </label>
              <textarea
                id="postBody"
                rows={10}
                placeholder="Write your post content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              {/* Word counter */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {body.trim() === '' ? 0 : body.trim().split(/\s+/).length} words
              </p>
            </div>

            {/* Preview */}
            {(title || body) && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3">
                  Preview
                </p>
                {title && (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                )}
                {body && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {body.length > 200 ? body.substring(0, 200) + '...' : body}
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  ✍️ {user?.username}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreatePost}
                disabled={submitting || !title.trim() || !body.trim()}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
              <button
                onClick={() => navigate('/landing')}
                className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </main>

  )
}

export default CreatePost