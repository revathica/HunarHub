import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function EntrepreneurOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!user || !token) {
      navigate("/login")
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
          throw new Error(data.message || "Failed to fetch orders")
        }

        setOrders(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate, token])

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order")
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      )
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading customer orders...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Failed to load orders
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Customer Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Manage orders received from customers.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                      {order.status}
                    </span>
                  </div>

                </div>

                <div className="mt-6">

                  <h2 className="text-lg font-bold text-gray-900">
                    Customer
                  </h2>

                  <div className="mt-3 grid gap-4 md:grid-cols-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Name
                      </p>

                      <p className="mt-1 font-semibold">
                        {order.customerId?.name || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="mt-1 font-semibold">
                        {order.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Delivery Address
                      </p>

                      <p className="mt-1 font-semibold">
                        {order.shippingAddress || "Not provided"}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <h2 className="text-lg font-bold text-gray-900">
                    Products
                  </h2>

                  <div className="mt-4 space-y-3">

                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between border-b pb-3"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.productId?.name || "Product"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}

                  </div>

                </div>

                <div className="mt-6 flex flex-col justify-between gap-5 border-t pt-5 md:flex-row md:items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  
                <div className="flex flex-wrap gap-2">

                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "confirmed")
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  )}

                  {order.status === "confirmed" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "processing")
                      }
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                    >
                      Processing
                    </button>
                  )}

                  {order.status === "processing" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "delivered")
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {["pending", "confirmed", "processing"].includes(order.status) && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order._id, "cancelled")
                      }
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}

                </div>

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default EntrepreneurOrders