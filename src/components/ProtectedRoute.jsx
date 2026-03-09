import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signin" />
  }

  return <Layout>{children}</Layout>
}

export default ProtectedRoute