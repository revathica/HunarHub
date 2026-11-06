import { Link, useNavigate } from "react-router-dom"
import hunarHubLogo from "../assets/hunarhub-logo.png"

function Navbar() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
    window.location.reload()
  }

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src={hunarHubLogo}
          alt="HunarHub Logo"
          className="h-25 w-80 object-contain"
        />

        
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-5">
        <Link
          to="/"
          className="font-medium text-gray-700 hover:text-green-700"
        >
          Home
        </Link>

        <Link
          to="/entrepreneurs"
          className="font-medium text-gray-700 hover:text-green-700"
        >
          Entrepreneurs
        </Link>

        <Link
          to="/products"
          className="font-medium text-gray-700 hover:text-green-700"
        >
          Products
        </Link>

        {user?.role === "customer" && (
          <>
            <Link
              to="/cart"
              className="font-medium text-gray-700 hover:text-green-700"
            >
              🛒 Cart
            </Link>

            <Link
              to="/my-orders"
              className="font-medium text-gray-700 hover:text-green-700"
            >
              My Orders
            </Link>
          </>
        )}

        {user ? (
          <>
          <Link
            to="/profile"
            className="font-medium text-gray-700 hover:text-green-700"
          >
            My Profile
          </Link>
            <span className="font-semibold text-green-700">
              Hi, {user.name}
            </span>

            {user.role === "admin" && (
              <Link
                to="/admin-dashboard"
                className="font-medium text-gray-700 hover:text-green-700"
              >
                Admin Dashboard
              </Link>
            )}

            {user.role === "entrepreneur" && (
              <>
                <Link
                  to="/entrepreneur-dashboard"
                  className="font-medium text-gray-700 hover:text-green-700"
                >
                  Dashboard
                </Link>

                <Link
                  to="/entrepreneur-orders"
                  className="font-medium text-gray-700 hover:text-green-700"
                >
                  Customer Orders
                </Link>

                <Link
                  to="/product-dashboard"
                  className="font-medium text-gray-700 hover:text-green-700"
                >
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
              to="/login"
              className="rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar