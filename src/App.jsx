import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/signin'
import SignUp from './pages/signup'
import Landing from './pages/landing'
import Post from './pages/post'
import CreatePost from './pages/createpost'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/profile'
import ClientDashboard from './pages/client/Dashboard'
import NewTicket from './pages/client/NewTicket'
import ClientTicketView from './pages/client/TicketView'
import DeveloperDashboard from './pages/developer/Dashboard'
import DeveloperTicketView from './pages/developer/TicketView'
import Notifications from './pages/notifications'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminTickets from './pages/admin/Tickets'
import Developers from './pages/developers'
import DeveloperProfile from './pages/developers/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/landing" element={
        <ProtectedRoute><Landing /></ProtectedRoute>
      } />
      <Route path="/post/:pid" element={
        <ProtectedRoute><Post /></ProtectedRoute>
      } />
      <Route path="/createpost" element={
        <ProtectedRoute><CreatePost /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Client routes */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="/client/tickets/new" element={
        <ProtectedRoute><NewTicket /></ProtectedRoute>
      } />
      <Route path="/client/tickets/:tid" element={
        <ProtectedRoute><ClientTicketView /></ProtectedRoute>
      } />

      {/* Developer routes */}
      <Route path="/developer/dashboard" element={
        <ProtectedRoute><DeveloperDashboard /></ProtectedRoute>
      } />
      <Route path="/developer/tickets/:tid" element={
        <ProtectedRoute><DeveloperTicketView /></ProtectedRoute>
      } />

      {/* Shared routes */}
      <Route path="/notifications" element={
        <ProtectedRoute><Notifications /></ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute><AdminUsers /></ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute><AdminTickets /></ProtectedRoute>
      } />
      <Route path="/developers" element={
        <ProtectedRoute><Developers /></ProtectedRoute>
      } />
      <Route path="/developers/:uid" element={
        <ProtectedRoute><DeveloperProfile /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App