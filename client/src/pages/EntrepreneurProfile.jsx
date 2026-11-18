import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

function EntrepreneurProfile() {
  const { id } = useParams()

  const [entrepreneur, setEntrepreneur] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
const [showBookingForm, setShowBookingForm] = useState(false)
const [service, setService] = useState("")
const [description, setDescription] = useState("")
const [requestedDate, setRequestedDate] = useState("")
const [bookingMessage, setBookingMessage] = useState("")
const [bookingLoading, setBookingLoading] = useState(false)
  useEffect(() => {
    const fetchEntrepreneur = async () => {
      try {
        const response = await fetch(
          `https://hunarhub-backend-hjv6.onrender.com/api/entrepreneurs/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch entrepreneur"
          )
        }

        setEntrepreneur(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEntrepreneur()
  }, [id])
  const handleServiceRequest = async (e) => {
  e.preventDefault()

  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  if (!user || user.role !== "customer" || !token) {
    setBookingMessage("Please login as a customer to request a service.")
    return
  }

  if (!service || !requestedDate) {
    setBookingMessage("Please fill in the service and requested date.")
    return
  }

  try {
    setBookingLoading(true)
    setBookingMessage("")

    const response = await fetch(
      "https://hunarhub-backend-hjv6.onrender.com/api/service-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: user.id,
          entrepreneurId: entrepreneur._id,
          service,
          description,
          requestedDate,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create service request"
      )
    }

    setBookingMessage("Service request sent successfully! ✅")
    setService("")
    setDescription("")
    setRequestedDate("")
  } catch (error) {
    console.error(error)
    setBookingMessage(error.message)
  } finally {
    setBookingLoading(false)
  }
}

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Profile not found
          </h1>

          <p className="mt-2 text-gray-600">
            {error}
          </p>

          <Link
            to="/entrepreneurs"
            className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
          >
            Back to Entrepreneurs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-green-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">

          <Link
            to="/entrepreneurs"
            className="text-sm text-green-100 hover:text-white"
          >
            ← Back to Entrepreneurs
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl">
              👤
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {entrepreneur.businessName}
              </h1>

              <p className="mt-2 text-xl text-green-100">
                {entrepreneur.skillType}
              </p>

              {entrepreneur.isVerified && (
                <span className="mt-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-green-700">
                  ✓ Verified Entrepreneur
                </span>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-10">

        <div className="grid gap-8 md:grid-cols-3">

          {/* About */}
          <div className="md:col-span-2">

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-gray-900">
                About
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {entrepreneur.bio ||
                  "This entrepreneur has not added a bio yet."}
              </p>

            </div>

            {/* Services */}
            <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-gray-900">
                Services
              </h2>

              {entrepreneur.services &&
              entrepreneur.services.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {entrepreneur.services.map((service, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">
                  Services will be added soon.
                </p>
              )}

            </div>

          </div>

          {/* Details */}
          <div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Business Details
              </h2>

              <div className="mt-6 space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Skill
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {entrepreneur.skillType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {entrepreneur.experience} years
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Location
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    📍 {entrepreneur.location || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Availability
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    {entrepreneur.availability}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Contact
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {entrepreneur.userId?.phone ||
                      "Contact details not provided"}
                  </p>
                </div>

              </div>

                      {JSON.parse(localStorage.getItem("user"))?.role === "customer" && (
                       <>
                      {!showBookingForm ? (
                        <button
                          onClick={() => setShowBookingForm(true)}
                          className="mt-8 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        >
                          Request Service
                        </button>
                      ) : (
                        <form
                          onSubmit={handleServiceRequest}
                          className="mt-8 space-y-4"
                        >
                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                              Service
                            </label>

                            <input
                              type="text"
                              value={service}
                              onChange={(e) => setService(e.target.value)}
                              placeholder="e.g. Shoe Repair"
                              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                              Description
                            </label>

                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Describe your requirement"
                              rows="4"
                              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                              Requested Date
                            </label>

                            <input
                              type="date"
                              value={requestedDate}
                              onChange={(e) => setRequestedDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                              required
                            />
                          </div>

                          {bookingMessage && (
                            <p className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                              {bookingMessage}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {bookingLoading
                              ? "Sending Request..."
                              : "Send Service Request"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="w-full rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </>
                  )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default EntrepreneurProfile