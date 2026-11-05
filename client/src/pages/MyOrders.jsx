import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

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
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow-sm">
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
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              View your previous orders and their status.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your orders will appear here after you place an order.
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
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between border-b pb-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.productId?.name || "Product"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}

                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-3">

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-700">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Delivery Address
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {order.shippingAddress}
                    </p>
                  </div>

                </div>

                <p className="mt-6 text-sm text-gray-500">
                  Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                    {order.status === "completed" && (
                      <button
                        onClick={() => navigate(`/review/${order._id}`)}
                        className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        ⭐ Give Review
                      </button>
                    )}
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default MyOrders