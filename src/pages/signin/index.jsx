import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function SignIn() {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(null)
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSignIn = async () => {
    setError(null)
    try {
      const response = await axios.post('https://${import.meta.env.VITE_API_URL}/api/auth/signin', {
        email,
        pwd
      })
      if (response.data.length === 0) {
        setError('Invalid email or password')
        return
      }
      const userData = response.data[0]
      signIn(userData) 

      if (userData.role === 'developer') {
        navigate('/developer/dashboard')
      } else if (userData.role === 'client') {
        navigate('/client/dashboard')
      } else if (userData.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/landing')
      }
    } catch (err) {
      setError('Something went wrong, please try again')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mb-6">
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      {/* Form card */}
      <div className="w-full sm:max-w-sm bg-white dark:bg-gray-800 px-8 py-10 shadow-md rounded-xl">
        <div className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="inputEmail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="inputPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Sign In
          </button>

        </div>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign up
            </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn