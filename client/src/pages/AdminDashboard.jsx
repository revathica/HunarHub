import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const navigate = useNavigate()

  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [verifyingId, setVerifyingId] = useState("")
  const [statusUpdatingId, setStatusUpdatingId] = useState("")
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    if (!user || user.role !== "admin" || !token) {
      navigate("/")
      return
    }

    const fetchData = async () => {
      try {
        const [
          entrepreneurRes,
          productRes,
          orderRes,
          userRes,
        ] = await Promise.all([
          fetch("https://hunarhub-backend-hiv6.onrender.com/api/entrepreneurs"),

          fetch("https://hunarhub-backend-hiv6.onrender.com/api/products"),

          fetch("https://hunarhub-backend-hiv6.onrender.com/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("https://hunarhub-backend-hiv6.onrender.com/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const entrepreneurData = await entrepreneurRes.json()
        const productData = await productRes.json()
        const orderData = await orderRes.json()
        const userData = await userRes.json()


        
        setEntrepreneurs(
          Array.isArray(entrepreneurData) ? entrepreneurData : []
        )

        setProducts(
          Array.isArray(productData) ? productData : []
        )

        setOrders(
          Array.isArray(orderData) ? orderData : []
        )

        setUsers(
          Array.isArray(userData)
            ? userData
            : userData.users || []
        )
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  // =========================
  // VERIFY ENTREPRENEUR
  // =========================

  const handleVerify = async (id) => {
    const token = localStorage.getItem("token")

    try {
      setVerifyingId(id)

      const response = await fetch(
        `https://hunarhub-backend-hiv6.onrender.com/api/entrepreneurs/verify/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Verification failed"
        )
      }

      setEntrepreneurs((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, isVerified: true }
            : item
        )
      )

      alert("Entrepreneur verified successfully")
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      setVerifyingId("")
    }
  }


const handleToggleUserStatus = async (userId, currentStatus) => {
  const token = localStorage.getItem("token")

  const newStatus = !currentStatus

  const confirmAction = window.confirm(
    `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this account?`
  )

  if (!confirmAction) return

  try {
    setStatusUpdatingId(userId)

    const response = await fetch(
      `https://hunarhub-backend-hiv6.onrender.com/api/users/${userId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: newStatus,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to update account")
    }

    setUsers((current) =>
      current.map((item) =>
        item._id === userId
          ? { ...item, isActive: newStatus }
          : item
      )
    )

    alert(data.message)
  } catch (error) {
    console.error(error)
    alert(error.message)
  } finally {
    setStatusUpdatingId("")
  }
}
// DELETE USER
const handleDeleteUser = async (userId) => {
  const token = localStorage.getItem("token")

  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete this user?"
  )

  if (!confirmDelete) return

  try {
    const response = await fetch(
      `https://hunarhub-backend-hiv6.onrender.com/api/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user")
    }

    setUsers((current) =>
      current.filter((user) => user._id !== userId)
    )

    alert("User deleted successfully")
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token")

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(
        `https://hunarhub-backend-hiv6.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        )
      }

      setProducts((current) =>
        current.filter((item) => item._id !== id)
      )

      alert("Product deleted successfully")
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        `https://hunarhub-backend-hiv6.onrender.com/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingProduct.name,
            description: editingProduct.description,
            price: Number(editingProduct.price),
            category: editingProduct.category,
            stock: Number(editingProduct.stock),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        )
      }

      setProducts((current) =>
        current.map((item) =>
          item._id === editingProduct._id
            ? { ...item, ...data.product }
            : item
        )
      )

      setEditingProduct(null)

      alert("Product updated successfully")
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const verifiedEntrepreneurs = entrepreneurs.filter(
    (item) => item.isVerified
  ).length

  const pendingEntrepreneurs = entrepreneurs.filter(
    (item) => !item.isVerified
  ).length

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">
          Loading Admin Dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mb-8 text-gray-600">
          Manage HunarHub platform
        </p>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">
              Entrepreneurs
            </h2>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {entrepreneurs.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">
              Verified
            </h2>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {verifiedEntrepreneurs}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">
              Pending Verification
            </h2>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {pendingEntrepreneurs}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">
              Products
            </h2>

            <p className="mt-2 text-3xl font-bold text-purple-700">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">
              Users
            </h2>

            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {users.length}
            </p>
          </div>

        </div>

        {/* =========================
            ORDERS + ADMIN ACTIONS
        ========================= */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-gray-800">
              Total Orders
            </h2>

            <p className="mt-3 text-4xl font-bold text-green-700">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-gray-800">
              Admin Actions
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              <button
                onClick={() =>
                  navigate("/admin/entrepreneurs")
                }
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Manage Entrepreneurs
              </button>

              <button
                onClick={() =>
                  navigate("/admin/products")
                }
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Manage Products
              </button>

              <button
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
              >
                Manage Orders
              </button>
              <button
                onClick={() =>
                  navigate("/admin/customers")
                }
                className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
              >
                Manage Customers
              </button>

            </div>
          </div>

        </div>

       
{/* USER ACCOUNT MANAGEMENT */}

<div className="mt-6 rounded-xl bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-bold text-gray-800">
    User Account Management
  </h2>

  <div className="mb-5 grid gap-4 sm:grid-cols-2">

    <div className="rounded-lg bg-green-50 p-4">
      <p className="text-sm text-gray-600">Active Accounts</p>
      <p className="text-2xl font-bold text-green-700">
        {users.filter((user) => user.isActive !== false && user.role !== "admin").length}
      </p>
    </div>

    <div className="rounded-lg bg-red-50 p-4">
      <p className="text-sm text-gray-600">Inactive Accounts</p>
      <p className="text-2xl font-bold text-red-700">
        {users.filter((user) => user.isActive === false).length}
      </p>
    </div>

  </div>

  {users.filter((user) => user.role !== "admin").length === 0 ? (
    <p className="text-gray-500">No users found.</p>
  ) : (

    <div className="space-y-4">

      {users
        .filter((user) => user.role !== "admin")
        .map((user) => (

          <div
            key={user._id}
            className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
          >

            <div>
              <h3 className="font-bold text-gray-800">
                {user.name}
              </h3>

              <p className="text-sm text-gray-600">
                {user.email}
              </p>

              <p className="text-sm text-gray-600">
                Role: {user.role}
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isActive !== false
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive !== false ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <button
                onClick={() =>
                  handleToggleUserStatus(
                    user._id,
                    user.isActive !== false
                  )
                }
                disabled={statusUpdatingId === user._id}
                className={`rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-50 ${
                  user.isActive !== false
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {statusUpdatingId === user._id
                  ? "Updating..."
                  : user.isActive !== false
                  ? "Deactivate"
                  : "Activate"}
              </button>


              <button
                onClick={() => handleDeleteUser(user._id)}
                className="mt-2 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
              >
                
                Delete User
              </button>
            </div>

          </div>

        ))}

    </div>

  )}

</div>
   
  
        {/* =========================
            ENTREPRENEUR VERIFICATION
        ========================= */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Entrepreneur Verification
          </h2>

          {entrepreneurs.length === 0 ? (
            <p className="text-gray-500">
              No entrepreneurs found.
            </p>
          ) : (
            <div className="space-y-4">

              {entrepreneurs.map((entrepreneur) => (

                <div
                  key={entrepreneur._id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <h3 className="text-lg font-bold text-gray-800">
                      {entrepreneur.businessName}
                    </h3>

                    <p className="text-gray-600">
                      {entrepreneur.skillType}
                    </p>

                    <p className="text-sm text-gray-500">
                      {entrepreneur.location}
                    </p>

                    <p className="text-sm text-gray-500">
                      Owner:{" "}
                      {entrepreneur.userId?.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Contact:{" "}
                      {entrepreneur.userId?.phone}
                    </p>

                  </div>

                  <div>

                    {entrepreneur.isVerified ? (
                      <span className="inline-block rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700">
                        ✓ Verified
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleVerify(
                            entrepreneur._id
                          )
                        }
                        disabled={
                          verifyingId ===
                          entrepreneur._id
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {verifyingId ===
                        entrepreneur._id
                          ? "Verifying..."
                          : "Verify"}
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default AdminDashboard