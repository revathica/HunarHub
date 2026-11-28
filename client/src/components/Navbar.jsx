
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import hunarHubLogo from "../assets/hunarhub-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setMenuOpen(false)
    navigate("/")
    window.location.reload()
  }

  const closeMenu = () => setMenuOpen(false)

  const NavigationLinks = () => (
    <>
      <Link onClick={closeMenu} to="/" className="font-medium text-gray-700 hover:text-green-700">
        Home
      </Link>

      <Link onClick={closeMenu} to="/entrepreneurs" className="font-medium text-gray-700 hover:text-green-700">
        Entrepreneurs
      </Link>

      <Link onClick={closeMenu} to="/products" className="font-medium text-gray-700 hover:text-green-700">
        Products
      </Link>

      {user?.role === "customer" && (
        <>
          <Link onClick={closeMenu} to="/cart" className="font-medium text-gray-700 hover:text-green-700">
            🛒 Cart
          </Link>

          <Link onClick={closeMenu} to="/my-orders" className="font-medium text-gray-700 hover:text-green-700">
            My Orders
          </Link>
        </>
      )}

      {user ? (
        <>
          <Link onClick={closeMenu} to="/profile" className="font-medium text-gray-700 hover:text-green-700">
            My Profile
          </Link>

          <span className="font-semibold text-green-700">
            Hi, {user.name}
          </span>

          {user.role === "admin" && (
            <Link onClick={closeMenu} to="/admin-dashboard" className="font-medium text-gray-700 hover:text-green-700">
              Admin Dashboard
            </Link>
          )}

          {user.role === "entrepreneur" && (
            <>
              <Link onClick={closeMenu} to="/entrepreneur-dashboard" className="font-medium text-gray-700 hover:text-green-700">
                Dashboard
              </Link>

              <Link onClick={closeMenu} to="/entrepreneur-orders" className="font-medium text-gray-700 hover:text-green-700">
                Customer Orders
              </Link>

              <Link onClick={closeMenu} to="/product-dashboard" className="font-medium text-gray-700 hover:text-green-700">
                Products Dashboard
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            onClick={closeMenu}
            to="/login"
            className="rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700 text-center"
          >
            Login
          </Link>

          <Link
            onClick={closeMenu}
            to="/register"
            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 text-center"
          >
            Register
          </Link>
        </>
      )}
    </>
  )

  return (
    <nav className="w-full bg-white shadow relative z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center">
          <img
            src={hunarHubLogo}
            alt="HunarHub Logo"
            className="h-14 w-44 md:h-16 md:w-56 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5 flex-wrap justify-end">
          <NavigationLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl text-green-700 px-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-5 py-5 border-t border-gray-200 bg-white shadow">
          <NavigationLinks />
        </div>
      )}
    </nav>
  )
}

export default Navbar
