import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function Home() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setUser(null)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-green-50">

     
      {/* Hero */}
      <main className="px-6 py-20 text-center">

      
        <h1 className="text-5xl font-bold text-green-700">
          Welcome to HunarHub
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          Discover Local Talent. Support Local Businesses.
        </p>

        <Link
          to="/entrepreneurs"
          className="mt-8 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Explore Entrepreneurs
        </Link>

      </main>

    </div>
  )
}

export default Home