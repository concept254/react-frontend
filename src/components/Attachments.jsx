import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Attachments({ tid }) {
  const { user } = useAuth()
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/${tid}/attachments`)
        setAttachments(response.data)
      } catch (err) {
        console.error('Failed to load attachments', err)
      }
    }
    fetchAttachments()
  }, [tid])

  const handleUpload = async (file) => {
    if (!file) return
    setError(null)

    // Check file size 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sender_id', user.uid)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tickets/${tid}/attachments`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setAttachments([...attachments, response.data])
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (aid, filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tickets/attachments/${aid}`)
      setAttachments(attachments.filter(a => a.aid !== aid))
    } catch (err) {
      console.error('Failed to delete attachment', err)
    }
  }

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return '🖼️'
    if (mimetype === 'application/pdf') return '📄'
    if (mimetype.includes('zip')) return '🗜️'
    if (mimetype.includes('word')) return '📝'
    if (mimetype.includes('json') || mimetype.includes('javascript') ||
        mimetype.includes('css') || mimetype.includes('html')) return '💻'
    return '📎'
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isImage = (mimetype) => mimetype.startsWith('image/')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📎 Attachments ({attachments.length})
      </h3>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleUpload(file)
        }}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition mb-6
          ${dragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
          }`}
      >
        <p className="text-4xl mb-2">📁</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Drag and drop a file here, or click to browse
        </p>
        <label className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition">
          {uploading ? 'Uploading...' : 'Choose File'}
          <input
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </label>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Supported: Images, PDF, ZIP, Word, JSON, CSS, JS, HTML — Max 10MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Attachments list */}
      {attachments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
          No attachments yet
        </p>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.aid}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {/* Preview or icon */}
              {isImage(attachment.mimetype) ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${attachment.filename}`}
                  alt={attachment.originalname}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
              ) : (
                <span className="text-3xl flex-shrink-0">
                  {getFileIcon(attachment.mimetype)}
                </span>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {attachment.originalname}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatSize(attachment.size)} · {attachment.sender_name} · {new Date(attachment.date_created).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${attachment.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Download
                </a>
                {attachment.sender_id === user.uid && (
                  <button
                    onClick={() => handleDelete(attachment.aid, attachment.originalname)}
                    className="text-sm text-red-500 hover:text-red-400 transition"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Attachments