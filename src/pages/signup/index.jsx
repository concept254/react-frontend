import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../../context/ThemeContext'

function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [role, setRole] = useState('client')
  const [error, setError] = useState(null)
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleSignUp = async () => {
    setError(null)
    if (!username || !email || !pwd || !confirmPwd) {
      setError('All fields are required')
      return
    }
    if (pwd !== confirmPwd) {
      setError('Passwords do not match')
      return
    }
    if (pwd.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }
    try {
      await axios.post('http://${import.meta.env.VITE_API_URL}/api/auth/signup', {
        username,
        email,
        pwd,
        role
      })
      navigate('/signin')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
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
          Create your account
        </h2>
      </div>

      {/* Form card */}
      <div className="w-full sm:max-w-sm bg-white dark:bg-gray-800 px-8 py-10 shadow-md rounded-xl">
        <div className="space-y-5">

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I am joining as a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition flex flex-col items-center gap-1
                  ${role === 'client'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-300'
                  }`}
              >
                <span className="text-2xl">💼</span>
                <span>Client</span>
                <span className="text-xs font-normal text-gray-400">I need work done</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('developer')}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition flex flex-col items-center gap-1
                  ${role === 'developer'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-300'
                  }`}
              >
                <span className="text-2xl">👨‍💻</span>
                <span>Developer</span>
                <span className="text-xs font-normal text-gray-400">I want to do work</span>
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="inputUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="inputUsername"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="inputEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="inputPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="inputConfirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="inputConfirmPassword"
              placeholder="••••••••"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Create Account as {role === 'client' ? '💼 Client' : '👨‍💻 Developer'}
          </button>

        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp