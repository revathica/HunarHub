import { useEffect, useState } from "react"

function ManageCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        "https://hunarhub-backend-hjv6.onrender.com/api/users/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setCustomers(Array.isArray(data) ? data : [])
      } else {
        alert(data.message || "Failed to fetch customers")
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      alert("Server connection failed")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setEditName(customer.name || "")
    setEditEmail(customer.email || "")
    setEditPhone(customer.phone || "")
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editingCustomer) return

    const token = localStorage.getItem("token")

    try {
      setSaving(true)

      const response = await fetch(
        `https://hunarhub-backend-hjv6.onrender.com/api/users/customers/${editingCustomer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
            email: editEmail,
            phone: editPhone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Customer update failed")
        return
      }

      const updatedCustomer = data.customer || data

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === editingCustomer._id
            ? updatedCustomer
            : customer
        )
      )

      alert("Customer updated successfully!")
      setEditingCustomer(null)
    } catch (error) {
      console.error("Error updating customer:", error)
      alert("Server connection failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (customerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    )

    if (!confirmed) return

    const token = localStorage.getItem("token")

    try {
      setDeletingId(customerId)

      const response = await fetch(
        `https://hunarhub-backend-hjv6.onrender.com/api/users/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.filter(
            (customer) => customer._id !== customerId
          )
        )
      } else {
        alert(data.message || "Failed to delete customer")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Something went wrong while deleting the customer")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-orange-700">
        Manage Customers
      </h1>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="grid gap-4">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h2 className="text-xl font-bold text-gray-800">
                {customer.name}
              </h2>

              <p className="mt-2 text-gray-600">
                Email: {customer.email}
              </p>

              <p className="text-gray-600">
                Phone: {customer.phone || "Not provided"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(customer)}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(customer._id)}
                  disabled={deletingId === customer._id}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === customer._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-blue-700">
              Edit Customer
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Phone
                </label>

                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
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
                  onClick={() => setEditingCustomer(null)}
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

export default ManageCustomers