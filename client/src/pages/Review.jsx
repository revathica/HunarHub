import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function Review() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        console.log("Review API Response:", data)

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to submit review"
          )
        }

        setOrder(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])
const handleSubmit = async (e) => {
  e.preventDefault()

  if (!order?.items?.length) {
    alert("No product found in this order")
    return
  }

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!token || !user) {
    navigate("/login")
    return
  }

  try {
    setSubmitting(true)

    const firstProduct = order.items[0]

    const productId =
      firstProduct.productId?._id || firstProduct.productId

    const entrepreneurId =
      order.entrepreneurId?._id || order.entrepreneurId ||
      firstProduct.productId?.entrepreneurId?._id ||
      firstProduct.productId?.entrepreneurId

    if (!productId || !entrepreneurId) {
      alert("Product or entrepreneur information is missing")
      return
    }

    const response = await fetch(
      "http://localhost:5000/api/reviews",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: user.id || user._id,
          entrepreneurId,
          productId,
          orderId: order._id,
          rating,
          comment,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit review")
    }

    alert("Review submitted successfully! ⭐")
    navigate("/my-orders")
  } catch (error) {
    console.error("Review submission error:", error)
    alert(error.message)
  } finally {
    setSubmitting(false)
  }
}

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Order not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          Give Your Review
        </h1>

        <p className="mt-2 text-gray-500">
          Share your experience with this order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block font-semibold">
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Very Good</option>
              <option value={3}>⭐⭐⭐ Good</option>
              <option value={2}>⭐⭐ Fair</option>
              <option value={1}>⭐ Poor</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Customer Feedback
            </label>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your feedback..."
              rows="5"
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="w-full rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default Review