import { createContext, useState, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // ← on load, check localStorage for saved user
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const signIn = (userData) => {
    setUser(userData)
    // ← save user to localStorage on signin
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    // ← clear localStorage on signout
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}