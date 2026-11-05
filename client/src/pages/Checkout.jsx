import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Checkout() {
  const navigate = useNavigate()

  const [cartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  )

  const handleOrder = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    if (!user || !token) {
      alert("Please login before placing an order")
      navigate("/login")
      return
    }

    const entrepreneurId = cartItems[0]?.entrepreneurId?._id

    if (!entrepreneurId) {
      alert("Seller information is missing")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId: user.id,
            entrepreneurId,
            items: cartItems.map((item) => ({
              productId: item._id,
              quantity: item.cartQuantity,
              price: item.price,
            })),
            totalAmount,
            shippingAddress: address,
            phone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Order creation failed")
        return
      }

      localStorage.removeItem("cart")

      alert("Order placed successfully!")

      navigate("/products")
    } catch (error) {
      console.error(error)
      alert("Server connection failed")
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🛒</div>

          <h1 className="mt-4 text-2xl font-bold">
            Your cart is empty
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* Customer Details */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold">
              Delivery Details
            </h2>

            <form
              onSubmit={handleOrder}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block font-medium">
                  Phone
                </label>

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Delivery Address
                </label>

                <textarea
                  required
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter your delivery address"
                  rows="5"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.cartQuantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{item.price * item.cartQuantity}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-6 flex justify-between border-t pt-5">

              <span className="text-lg font-bold">
                Total
              </span>

              <span className="text-2xl font-bold text-green-700">
                ₹{totalAmount}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Checkout