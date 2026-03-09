import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function Post() {
  const { pid } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/get/post/${pid}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/get/comments/${pid}`)
        ])
        setPost(postRes.data)
        setComments(commentsRes.data)
      } catch (err) {
        setError('Failed to load post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPostAndComments()
  }, [pid])

  const handleLike = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/post/like/${pid}`)
      setPost(response.data)    // update post with new likes count
    } catch (err) {
      console.error('Failed to like post', err)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/post/comment`, {
        comment: newComment,
        author: user.username,
        user_id: user.uid,
        post_id: pid
      })
      setComments([...comments, response.data])   // add new comment to list
      setNewComment('')                            // clear input
    } catch (err) {
      setError('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/post/delete/${pid}`)
      navigate('/landing')    // redirect after delete
    } catch (err) {
      setError('Failed to delete post')
    }
  }

  const handleEditStart = () => {
    setEditTitle(post.title)   // pre-fill with current values
    setEditBody(post.body)
    setEditing(true)
  }

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/post/edit/${pid}`, {
        title: editTitle,
        body: editBody
      })
      setPost(response.data)   // update post with edited values
      setEditing(false)
    } catch (err) {
      setError('Failed to update post')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-500 dark:text-gray-400">Loading post...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Post */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">

          {/* Editing mode */}
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                rows={10}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleEditSave}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View mode */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>

                {/* Edit/Delete — only shown to post author */}
                {user?.username === post.author && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={handleEditStart}
                      className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500 mb-6">
                <span>✍️ {post.author}</span>
                <span>{new Date(post.date_created).toLocaleDateString()}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.body}
              </p>

              {/* Like button */}
              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-400 transition"
                >
                  ❤️ {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Comments section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            💬 Comments ({comments.length})
          </h3>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4 mb-8">
              {comments.map((c) => (
                <div
                  key={c.cid}
                  className="border-b border-gray-100 dark:border-gray-700 pb-4"
                >
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {c.author}
                    </span>
                    <span>{new Date(c.date_created).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add a comment
            </label>
            <textarea
              rows={3}
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>

      </main>

  )
}

export default Post