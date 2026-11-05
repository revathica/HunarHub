import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [deletingId, setDeletingId] = useState("")
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    if (!user || user.role !== "admin" || !token) {
      navigate("/")
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          )
        }

        setOrders(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem("token")

    try {
      setUpdatingId(orderId)

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        )
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, ...data.order }
            : order
        )
      )

      alert("Order status updated successfully")
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      setUpdatingId("")
    }
  }
  const handleDeleteOrder = async (orderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  )

  if (!confirmDelete) return

  const token = localStorage.getItem("token")

  try {
    setDeletingId(orderId)

    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log("DELETE Status:", response.status)
    console.log("DELETE URL:", response.url)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete order"
      )
    }

    // Remove deleted order from UI
    setOrders((current) =>
      current.filter(
        (order) => order._id !== orderId
      )
    )

    alert("Order deleted successfully")
  } catch (error) {
    console.error("Delete order error:", error)
    alert(error.message)
  } finally {
    setDeletingId("")
  }
}


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">
          Loading Orders...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Orders
            </h1>

            <p className="mt-1 text-gray-600">
              Manage all HunarHub orders
            </p>
          </div>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </button>

        </div>

        {/* ORDERS */}

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="rounded-xl bg-white p-6 shadow"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={deletingId === order._id}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === order._id
                          ? "Deleting..."
                          : "Delete Order"}
                      </button>
                    
                  {/* STATUS */}

                  <div>
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-4 py-2 font-semibold"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                </div>

                {/* CUSTOMER + ENTREPRENEUR */}

                <div className="mt-5 grid gap-6 md:grid-cols-2">

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Customer
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {order.customerId?.name ||
                        "Unknown"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.customerId?.email ||
                        ""}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Entrepreneur
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {order.entrepreneurId
                        ?.businessName ||
                        "Unknown"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.entrepreneurId
                        ?.skillType ||
                        ""}
                    </p>
                  </div>

                </div>

                {/* SHIPPING ADDRESS */}

                <div className="mt-5">

                  <h3 className="font-bold text-gray-800">
                    Delivery Address
                  </h3>

                  <p className="mt-1 text-gray-600">
                    {order.shippingAddress}
                  </p>

                </div>

                {/* PRODUCTS */}

                <div className="mt-5">

                  <h3 className="mb-3 font-bold text-gray-800">
                    Products
                  </h3>

                  <div className="space-y-3">

                    {order.items?.map((item, index) => (

                      <div
                        key={item._id || index}
                        className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                      >

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.productId?.name ||
                              "Product"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-green-700">
                          ₹{item.price}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* TOTAL */}

                <div className="mt-5 flex items-center justify-between border-t pt-4">

                  <span className="text-lg font-bold text-gray-800">
                    Total Amount
                  </span>

                  <span className="text-2xl font-bold text-green-700">
                    ₹{order.totalAmount}
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default AdminOrders




