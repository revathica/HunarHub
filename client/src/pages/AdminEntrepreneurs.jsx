import { useEffect, useState } from "react"

function AdminEntrepreneurs() {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [editingEntrepreneur, setEditingEntrepreneur] = useState(null)
  const [editBusinessName, setEditBusinessName] = useState("")
  const [editSkillType, setEditSkillType] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEntrepreneurs()
  }, [])

  const fetchEntrepreneurs = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        "http://localhost:5000/api/entrepreneurs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setEntrepreneurs(data)
      } else {
        console.error(data)
      }
    } catch (error) {
      console.error("Error fetching entrepreneurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entrepreneurId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this entrepreneur?"
  )

  if (!confirmed) return

  const token = localStorage.getItem("token")

  try {
    setDeletingId(entrepreneurId)

    const response = await fetch(
      `http://localhost:5000/api/entrepreneurs/${entrepreneurId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (response.ok) {
      setEntrepreneurs((prevEntrepreneurs) =>
        prevEntrepreneurs.filter(
          (entrepreneur) =>
            entrepreneur._id !== entrepreneurId
        )
      )

      alert("Entrepreneur deleted successfully!")
    } else {
      alert(data.message || "Failed to delete entrepreneur")
    }
  } catch (error) {
    console.error("Error deleting entrepreneur:", error)
    alert("Something went wrong while deleting")
  } finally {
    setDeletingId(null)
  }
}
const handleEdit = (entrepreneur) => {
  setEditingEntrepreneur(entrepreneur)
  setEditBusinessName(entrepreneur.businessName || "")
  setEditSkillType(entrepreneur.skillType || "")
  setEditDescription(entrepreneur.description || "")
  setEditLocation(entrepreneur.location || "")
}
const handleUpdate = async (e) => {
  e.preventDefault()

  if (!editingEntrepreneur) return

  const token = localStorage.getItem("token")

  try {
    setSaving(true)

    const response = await fetch(
      `http://localhost:5000/api/entrepreneurs/${editingEntrepreneur._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: editBusinessName,
          skillType: editSkillType,
          description: editDescription,
          location: editLocation,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || "Update failed")
      return
    }

    setEntrepreneurs((prevEntrepreneurs) =>
      prevEntrepreneurs.map((entrepreneur) =>
        entrepreneur._id === editingEntrepreneur._id
          ? {
              ...entrepreneur,
              ...data.entrepreneur,
              userId: entrepreneur.userId,
            }
          : entrepreneur
      )
    )

    alert("Entrepreneur updated successfully!")

    setEditingEntrepreneur(null)
  } catch (error) {
    console.error("Error updating entrepreneur:", error)
    alert("Server connection failed")
  } finally {
    setSaving(false)
  }
}
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">
        Manage Entrepreneurs
      </h1>

      {loading ? (
        <p>Loading entrepreneurs...</p>
      ) : entrepreneurs.length === 0 ? (
        <p>No entrepreneurs found.</p>
      ) : (
        <div className="grid gap-4">
          {entrepreneurs.map((entrepreneur) => (
            <div
              key={entrepreneur._id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h2 className="text-xl font-bold">
                {entrepreneur.businessName}
              </h2>

              <p className="mt-2 text-gray-600">
                Skill: {entrepreneur.skillType}
              </p>

              {entrepreneur.userId && (
                <>
                  <p className="text-gray-600">
                    Name: {entrepreneur.userId.name}
                  </p>

                  <p className="text-gray-600">
                    Email: {entrepreneur.userId.email}
                  </p>

                  <p className="text-gray-600">
                    Phone: {entrepreneur.userId.phone}
                  </p>
                </>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(entrepreneur)}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(entrepreneur._id)}
                  disabled={deletingId === entrepreneur._id}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === entrepreneur._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingEntrepreneur && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-green-700">
              Edit Entrepreneur
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">
                  Business Name
                </label>

                <input
                  type="text"
                  value={editBusinessName}
                  onChange={(e) =>
                    setEditBusinessName(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Skill Type
                </label>

                <input
                  type="text"
                  value={editSkillType}
                  onChange={(e) =>
                    setEditSkillType(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  rows="4"
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Location
                </label>

                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) =>
                    setEditLocation(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingEntrepreneur(null)}
                  className="rounded-lg bg-gray-500 px-5 py-2 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEntrepreneurs