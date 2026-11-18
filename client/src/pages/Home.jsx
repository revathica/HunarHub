
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const API = "https://hunarhub-backend-hiv6.onrender.com"

function Home() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/")
  }

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [entrepreneurRes, productRes] = await Promise.all([
          fetch(`${API}/api/entrepreneurs`),
          fetch(`${API}/api/products`)
        ])

        if (entrepreneurRes.ok) {
          const data = await entrepreneurRes.json()
          setEntrepreneurs(Array.isArray(data) ? data.slice(0, 4) : [])
        }

        if (productRes.ok) {
          const data = await productRes.json()
          setProducts(Array.isArray(data) ? data.slice(0, 4) : [])
        }
      } catch (error) {
        console.error("Home data error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const getImage = (image) => {
    if (!image) return null
    return image.startsWith("http") ? image : `${API}${image}`
  }

 const categories = [
  { name: "Footwear", skill: "Cobbler", icon: "👞" },
  { name: "Pottery", skill: "Potter", icon: "🏺" },
  { name: "Tailoring", skill: "Tailor", icon: "🧵" },
  { name: "Handicrafts", skill: "Artisan", icon: "🎨" },
  { name: "Wood Crafts", skill: "Carpenter", icon: "🪵" }
]

  return (
    <div className="min-h-screen bg-green-50">

      {/* Hero Section */}
      <section className="px-6 py-24 text-center bg-gradient-to-r from-green-100 to-green-50">
        <p className="mb-4 font-semibold text-green-700">
          🌿 Empowering Local Entrepreneurs
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-green-800">
          Welcome to HunarHub
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Discover Local Talent. Support Local Businesses.
        </p>

        <p className="mt-3 text-gray-500">
          Explore handmade products and connect with skilled local entrepreneurs.
        </p>

        <Link
          to="/entrepreneurs"
          className="mt-8 inline-block rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow hover:bg-green-700 transition"
        >
          Explore Entrepreneurs →
        </Link>

        <Link
          to="/products"
          className="mt-4 ml-3 inline-block rounded-lg border-2 border-green-600 px-8 py-3 font-semibold text-green-700 hover:bg-green-100 transition"
        >
          Shop Products
        </Link>
      </section>

      {/* Categories */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-green-800">
          Explore Categories
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Discover traditional skills and handmade creations
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/entrepreneurs?category=${encodeURIComponent(category.skill)}`}
              className="rounded-xl bg-white p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-4xl">{category.icon}</div>
              <h3 className="mt-3 font-semibold text-green-800">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Entrepreneurs */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-800">
          Featured Entrepreneurs
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Meet the talented people behind local businesses
        </p>

        {loading ? (
          <p className="text-center mt-10">Loading entrepreneurs...</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {entrepreneurs.map((item) => (
              <div
                key={item._id}
                className="rounded-xl bg-green-50 p-5 text-center shadow-sm hover:shadow-lg transition"
              >
                {getImage(item.profileImage) ? (
                  <img
                    src={getImage(item.profileImage)}
                    alt={item.businessName}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-4xl mx-auto">
                    👨‍🔧
                  </div>
                )}

                <h3 className="mt-4 font-bold text-green-800">
                  {item.businessName}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {item.skillType}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  📍 {item.location}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/entrepreneurs"
            className="font-semibold text-green-700 hover:underline"
          >
            View All Entrepreneurs →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-16 bg-green-50">
        <h2 className="text-3xl font-bold text-center text-green-800">
          Featured Products
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Beautiful handmade products from local creators
        </p>

        {loading ? (
          <p className="text-center mt-10">Loading products...</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {products.map((item) => (
              <div
                key={item._id}
                className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                {getImage(item.image || item.imageUrl) ? (
                  <img
                    src={getImage(item.image || item.imageUrl)}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">
                    🛍️
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-green-800">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  <p className="mt-3 text-lg font-bold text-green-700">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="font-semibold text-green-700 hover:underline"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* Why HunarHub */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-800">
          Why Choose HunarHub?
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">

          <div className="p-6 rounded-xl bg-green-50">
            <div className="text-4xl">🤝</div>
            <h3 className="mt-4 font-bold text-green-800">
              Support Local Talent
            </h3>
            <p className="mt-2 text-gray-600">
              Help local entrepreneurs grow their businesses.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-green-50">
            <div className="text-4xl">🎨</div>
            <h3 className="mt-4 font-bold text-green-800">
              Handmade Products
            </h3>
            <p className="mt-2 text-gray-600">
              Discover unique products made with creativity and care.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-green-50">
            <div className="text-4xl">📦</div>
            <h3 className="mt-4 font-bold text-green-800">
              Easy Shopping
            </h3>
            <p className="mt-2 text-gray-600">
              Explore products and connect with skilled creators.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white px-6 py-10 text-center">
        <h2 className="text-2xl font-bold">HunarHub 🌿</h2>

        <p className="mt-3 text-green-100">
          Discover Local Talent. Support Local Businesses.
        </p>

        <div className="mt-5 flex justify-center gap-6 flex-wrap text-sm">
          <Link to="/" className="hover:text-green-300">Home</Link>
          <Link to="/entrepreneurs" className="hover:text-green-300">Entrepreneurs</Link>
          <Link to="/products" className="hover:text-green-300">Products</Link>
        </div>

        <p className="mt-8 text-sm text-green-200">
          © {new Date().getFullYear()} HunarHub. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Home
