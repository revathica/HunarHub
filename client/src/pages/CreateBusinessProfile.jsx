import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CreateBusinessProfile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [businessName, setBusinessName] = useState("")
  const [skillType, setSkillType] = useState("Cobbler")
  const [bio, setBio] = useState("")
  const [experience, setExperience] = useState("")
  const [location, setLocation] = useState("")
  const [availability, setAvailability] = useState("Available")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  const token = localStorage.getItem("token")

  try {
    const response = await fetch(
      "http://localhost:5000/api/entrepreneurs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName,
          skillType,
          bio,
          experience: Number(experience),
          location,
          availability,
        }),
      }
    )

    const data = await response.json()

    console.log("Entrepreneur Response:", data)

    if (!response.ok) {
      throw new Error(data.error || data.message)
    }

    alert("Entrepreneur profile created successfully!")
    navigate("/entrepreneur-dashboard")
  } catch (error) {
    console.error("Submit Error:", error)
    alert(error.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-green-700">
          Entrepreneur Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Create your HunarHub business profile
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Business Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Example: Sree Leather Works"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Skill Type
            </label>

            <select
              value={skillType}
              onChange={(e) => setSkillType(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
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
            <label className="mb-2 block font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your work..."
              rows="4"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Experience (Years)
            </label>

            <input
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Example: 10"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Example: Kochi"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Availability
            </label>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating Profile..." : "Create Profile"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateBusinessProfile