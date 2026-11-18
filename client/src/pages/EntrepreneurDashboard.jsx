
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import ProductDashboard from "./ProductDashboard"
import EntrepreneurOrders from "./EntrepreneurOrders"

function EntrepreneurDashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const [formData, setFormData] = useState({
    businessName: "",
    skillType: "Cobbler",
    bio: "",
    experience: "",
    location: "",
    availability: "Available",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !user) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          "https://hunarhub-backend-hjv6.onrender.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to load business profile")
        }

        const business = data.entrepreneurProfile

        if (!business) {
          setError("Business profile not found. Please create your profile.")
          return
        }

        setProfile(business)

        setFormData({
          businessName: business.businessName || "",
          skillType: business.skillType || "Cobbler",
          bio: business.bio || "",
          experience: business.experience ?? "",
          location: business.location || "",
          availability: business.availability || "Available",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate, token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const response = await fetch(
        `https://hunarhub-backend-hjv6.onrender.com/api/entrepreneurs/${profile._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            experience: Number(formData.experience),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Update failed")
      }

      const updatedProfile = data._id
        ? data
        : { ...profile, ...formData }

      setProfile(updatedProfile)
      setActiveTab("overview")

      alert("Business details updated successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "business", label: "My Business", icon: "🏪" },
    { id: "products", label: "My Products", icon: "📦" },
    { id: "orders", label: "My Orders", icon: "🛒" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-lg font-semibold text-green-700">
          Loading Business Dashboard...
        </p>
      </div>
    )
  }

  if (!profile) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-3">
        Business Profile Not Found
      </h2>

      <p className="mb-5">
        Please create your business profile to continue.
      </p>

      <button
        onClick={() => navigate("/create-business-profile")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Create Business Profile
      </button>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-green-50">

      {/* Dashboard Header */}
      <div className="bg-green-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            My Business Dashboard
          </h1>

          <p className="mt-2 text-green-100">
            Welcome, {user?.name}! Manage your HunarHub business.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
              {profile.businessName}
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
              {profile.isVerified ? "✓ Verified" : "Verification Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-3 rounded-xl bg-white p-3 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setError("")
              }}
              className={`rounded-lg px-5 py-3 font-semibold transition ${
                activeTab === tab.id
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Business Overview
            </h2>

            <div className="grid gap-5 md:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Business Name</p>
                <h3 className="mt-3 text-xl font-bold text-green-700">
                  {profile.businessName}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Business Category</p>
                <h3 className="mt-3 text-xl font-bold">
                  {profile.skillType}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Experience</p>
                <h3 className="mt-3 text-xl font-bold">
                  {profile.experience} Years
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Location</p>
                <h3 className="mt-3 text-xl font-bold">
                  {profile.location || "Not added"}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Availability</p>
                <h3 className="mt-3 text-xl font-bold text-green-700">
                  {profile.availability}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Verification Status</p>
                <h3 className={`mt-3 text-xl font-bold ${
                  profile.isVerified ? "text-green-600" : "text-orange-500"
                }`}>
                  {profile.isVerified ? "Verified ✓" : "Pending"}
                </h3>
              </div>

            </div>

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">
                Quick Management
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setActiveTab("business")}
                  className="rounded-lg bg-blue-600 p-4 font-semibold text-white hover:bg-blue-700"
                >
                  🏪 Edit Business
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className="rounded-lg bg-green-600 p-4 font-semibold text-white hover:bg-green-700"
                >
                  📦 Manage Products
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="rounded-lg bg-purple-600 p-4 font-semibold text-white hover:bg-purple-700"
                >
                  🛒 Manage Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS DETAILS */}
        {activeTab === "business" && (
          <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold text-green-700">
              Manage Business Details
            </h2>

            <form onSubmit={handleUpdate} className="space-y-5">

              <div>
                <label className="mb-2 block font-semibold">
                  Business Name
                </label>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Skill Category
                </label>
                <select
                  name="skillType"
                  value={formData.skillType}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Cobbler">Cobbler</option>
                  <option value="Potter">Potter</option>
                  <option value="Tailor">Tailor</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Small Vendor">Small Vendor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Business Details"}
              </button>

            </form>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div>
            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              Product Management
            </h2>
            <ProductDashboard />
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              Order Management
            </h2>
            <EntrepreneurOrders />
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Back to My Profile
          </button>
        </div>

      </div>
    </div>
  )
}

export default EntrepreneurDashboard
