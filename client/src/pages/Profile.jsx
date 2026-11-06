
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [entrepreneurProfile, setEntrepreneurProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile")
        }

        setUser(data.user)
        setEntrepreneurProfile(data.entrepreneurProfile)

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        })

        localStorage.setItem("user", JSON.stringify(data.user))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        "http://localhost:5000/api/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed")
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      setEditing(false)
      setMessage("Profile updated successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    )

    if (!confirmed) return

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        "http://localhost:5000/api/users/deactivate",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Account deactivation failed")
      }

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      alert("Your account has been deactivated.")
      navigate("/login")
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p className="p-10 text-center">Loading Profile...</p>
  }

  if (!user) {
    return (
      <p className="p-10 text-center text-red-600">
        {error || "Unable to load profile"}
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-6 text-center text-3xl font-bold text-green-700">
          My Profile
        </h1>

        <div className="mb-6 text-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-4xl">
              👤
            </div>
          )}

          <h2 className="mt-3 text-xl font-bold">{user.name}</h2>

          <p className="capitalize text-green-700">{user.role}</p>
        </div>

        {message && (
          <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">

            <div>
              <label className="font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="font-semibold">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="font-semibold">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border p-3"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setError("")
              }}
              className="w-full rounded-lg border py-3 font-semibold"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="space-y-4">

              <div>
                <label className="font-semibold text-gray-600">
                  Full Name
                </label>
                <p className="rounded-lg bg-gray-100 p-3">
                  {user.name || "Not available"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Email Address
                </label>
                <p className="rounded-lg bg-gray-100 p-3">
                  {user.email || "Not available"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Phone Number
                </label>
                <p className="rounded-lg bg-gray-100 p-3">
                  {user.phone || "Not added"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Address
                </label>
                <p className="rounded-lg bg-gray-100 p-3">
                  {user.address || "Not added"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Account Type
                </label>
                <p className="rounded-lg bg-gray-100 p-3 capitalize">
                  {user.role}
                </p>
              </div>

            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </>
        )}

        {user.role === "entrepreneur" && entrepreneurProfile && (
          <div className="mt-8 border-t pt-6">
            <h2 className="mb-4 text-xl font-bold text-green-700">
              My Business Details
            </h2>

            <div className="space-y-3">
              <p><strong>Business Name:</strong> {entrepreneurProfile.businessName}</p>
              <p><strong>Skill:</strong> {entrepreneurProfile.skillType}</p>
              <p><strong>Experience:</strong> {entrepreneurProfile.experience} years</p>
              <p><strong>Location:</strong> {entrepreneurProfile.location || "Not added"}</p>
              <p><strong>Bio:</strong> {entrepreneurProfile.bio || "Not added"}</p>
              <p>
                <strong>Verification:</strong>{" "}
                {entrepreneurProfile.isVerified ? "Verified" : "Pending"}
              </p>
            </div>

            <button
              onClick={() => navigate("/entrepreneur-dashboard")}
              className="mt-5 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              My Business Dashboard
            </button>
          </div>
        )}

        {user.role === "customer" && (
          <button
            onClick={() => navigate("/my-orders")}
            className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            My Orders
          </button>
        )}

        <button
          onClick={handleDeactivate}
          className="mt-6 w-full rounded-lg border border-red-500 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          Deactivate My Account
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded-lg border border-gray-400 py-3 font-semibold text-gray-700 hover:bg-gray-100"
        >
          Back to Home
        </button>

      </div>
    </div>
  )
}

export default Profile
