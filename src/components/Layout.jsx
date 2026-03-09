import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div>
        {children}
      </div>
    </div>
  )
}

export default Layout