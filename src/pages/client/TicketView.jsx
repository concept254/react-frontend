import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import Attachments from '../../components/Attachments'

function ClientTicketView() {
  const { tid } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const [ticketRes, messagesRes] = await Promise.all([
          axios.get(`https://${import.meta.env.VITE_API_URL}/api/tickets/${tid}`),
          axios.get(`https://${import.meta.env.VITE_API_URL}/api/tickets/${tid}/messages`)
        ])
        setTicket(ticketRes.data)
        setMessages(messagesRes.data)
      } catch (err) {
        console.error('Failed to load ticket', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [tid])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    setSubmitting(true)
    try {
      const response = await axios.post(`https://${import.meta.env.VITE_API_URL}/api/tickets/${tid}/messages`, {
        sender_id: user.uid,
        message: newMessage
      })
      setMessages([...messages, response.data])
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return
    try {
      const response = await axios.put(`https://${import.meta.env.VITE_API_URL}/api/tickets/${tid}/close`)
      setTicket(response.data)
      setShowReview(true)
    } catch (err) {
      console.error('Failed to close ticket', err)
    }
  }

  const handleSubmitReview = async () => {
    try {
      await axios.post('https://${import.meta.env.VITE_API_URL}/api/reviews/create', {
        ticket_id: tid,
        reviewer_id: user.uid,
        reviewee_id: ticket.developer_id,
        rating,
        comment: reviewComment
      })
      setShowReview(false)
      navigate('/client/dashboard')
    } catch (err) {
      console.error('Failed to submit review', err)
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-500">Loading ticket...</p>
    </div>
  )

  return (

      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Ticket details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {ticket.title}
            </h2>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ml-4 ${statusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            {ticket.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
            <span>📂 {ticket.category || 'General'}</span>
            <span>💰 R{ticket.budget || '0.00'}</span>
            <span>🕒 {new Date(ticket.date_created).toLocaleDateString()}</span>
            <span>
              {ticket.developer_name
                ? `👨‍💻 ${ticket.developer_name}`
                : '⏳ Awaiting developer'}
            </span>
          </div>

          {/* Close button — only show when resolved */}
          {ticket.status === 'resolved' && (
            <button
              onClick={handleCloseTicket}
              className="mt-6 w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition"
            >
              ✅ Approve & Close Ticket
            </button>
          )}
        </div>

        {/* Review modal */}
        {showReview && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6 border-2 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ⭐ Rate your developer
            </h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Leave a comment about your experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmitReview}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
              >
                Submit Review
              </button>
              <button
                onClick={() => { setShowReview(false); navigate('/client/dashboard') }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Messages thread */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            💬 Messages ({messages.length})
          </h3>

          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              No messages yet. Start the conversation!
            </p>
          ) : (
            <div className="space-y-4 mb-6">
              {messages.map((msg) => (
                <div
                  key={msg.mid}
                  className={`flex ${msg.sender_id === user.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl text-sm
                    ${msg.sender_id === user.uid
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="font-semibold text-xs mb-1 opacity-75">
                      {msg.sender_name} · {msg.sender_role}
                    </p>
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.date_created).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message input — hide if ticket is closed */}
          {ticket.status !== 'closed' && (
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={submitting || !newMessage.trim()}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          )}
        </div>

        {/* Attachments */}
        <Attachments tid={tid} />
      </main>

  )
}

export default ClientTicketView