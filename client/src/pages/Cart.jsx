import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const updateCart = (items) => {
    setCartItems(items)
    localStorage.setItem("cart", JSON.stringify(items))
  }

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item._id !== productId
    )

    updateCart(updatedItems)
  }

  const increaseQuantity = (productId) => {
    const updatedItems = cartItems.map((item) =>
      item._id === productId
        ? { ...item, cartQuantity: item.cartQuantity + 1 }
        : item
    )

    updateCart(updatedItems)
  }

  const decreaseQuantity = (productId) => {
    const updatedItems = cartItems
      .map((item) =>
        item._id === productId
          ? { ...item, cartQuantity: item.cartQuantity - 1 }
          : item
      )
      .filter((item) => item.cartQuantity > 0)

    updateCart(updatedItems)
  }

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🛒</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products from the marketplace.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-3">

            <div className="space-y-4 md:col-span-2">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col justify-between gap-5 sm:flex-row">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQuantity(item._id)
                        }
                        className="h-9 w-9 rounded-lg bg-gray-100 font-bold hover:bg-gray-200"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.cartQuantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item._id)
                        }
                        className="h-9 w-9 rounded-lg bg-gray-100 font-bold hover:bg-gray-200"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">

                    <p className="font-bold text-green-700">
                      ₹{item.price * item.cartQuantity}
                    </p>

                    <button
                      onClick={() =>
                        removeItem(item._id)
                      }
                      className="text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              ))}

            </div>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between">
                <span className="text-gray-600">
                  Items
                </span>

                <span className="font-semibold">
                  {cartItems.reduce(
                    (total, item) =>
                      total + item.cartQuantity,
                    0
                  )}
                </span>
              </div>

              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="font-bold">
                  Total
                </span>

                <span className="text-xl font-bold text-green-700">
                  ₹{totalAmount}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default Cart