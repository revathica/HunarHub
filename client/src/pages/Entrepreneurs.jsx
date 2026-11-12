import { useEffect, useState } from "react"
import { Link, useSearchParams} from "react-router-dom"

function Entrepreneurs() {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [entrepreneurRatings, setEntrepreneurRatings] = useState({})
  const [search, setSearch] = useState("")
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState( searchParams.get("category") || "All")
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/entrepreneurs"
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch entrepreneurs")
        }

        setEntrepreneurs(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntrepreneurs()
  }, [])
  useEffect(() => {
  const fetchEntrepreneurRatings = async () => {
    try {
      const results = await Promise.all(
        entrepreneurs.map(async (entrepreneur) => {
          const response = await fetch(
            `http://localhost:5000/api/reviews/${entrepreneur._id}`
          )

          if (!response.ok) {
            return [
              entrepreneur._id,
              { averageRating: 0, reviewCount: 0 },
            ]
          }

          const data = await response.json()

          return [
            entrepreneur._id,
            {
              averageRating: data.averageRating || 0,
              reviewCount: data.reviewCount || 0,
            },
          ]
        })
      )

      setEntrepreneurRatings(Object.fromEntries(results))
    } catch (error) {
      console.error("Failed to fetch entrepreneur ratings:", error)
    }
  }

  if (entrepreneurs.length > 0) {
    fetchEntrepreneurRatings()
  }
}, [entrepreneurs])
  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const name = entrepreneur.businessName || ""
    const skill = entrepreneur.skillType || ""
    const location = entrepreneur.location || ""

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      skill.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || skill === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-green-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">

         <center> <h1 className="text-4xl font-bold">
            Find Local Entrepreneurs
          </h1>

          <p className="mt-3 text-green-100">
           <i> Discover skilled people and local businesses near you.</i>
          </p></center>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            placeholder="Search by name, skill or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border bg-white px-4 py-3 outline-none focus:border-green-600"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Cobbler">Cobbler</option>
            <option value="Potter">Potter</option>
            <option value="Tailor">Tailor</option>
            <option value="Artisan">Artisan</option>
             <option value="Carpenter">Carpenter</option>
            <option value="Small Vendor">Small Vendor</option>
          </select>

        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading entrepreneurs...
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredEntrepreneurs.map((entrepreneur) => (
              <div
                key={entrepreneur._id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                    👤
                  </div>

                  {entrepreneur.isVerified && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      ✓ Verified
                    </span>
                  )}

                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {entrepreneur.businessName}
                </h2>

                <p className="mt-1 font-medium text-green-600">
                  {entrepreneur.skillType}
                </p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-amber-500">
                    ⭐ {entrepreneurRatings[entrepreneur._id]?.averageRating
                      ? entrepreneurRatings[entrepreneur._id].averageRating.toFixed(1)
                      : "No ratings yet"}
                  </span>

                  {(entrepreneurRatings[entrepreneur._id]?.reviewCount || 0) > 0 && (
                    <span className="text-gray-500">
                      ({entrepreneurRatings[entrepreneur._id].reviewCount} reviews)
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  📍 {entrepreneur.location || "Location not provided"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  ⭐ {entrepreneur.experience} years experience
                </p>

                <p className="mt-4 text-sm text-gray-600">
                  {entrepreneur.bio || "No description available."}
                </p>

                <div className="mt-5">

                  <Link
                    to={`/entrepreneurs/${entrepreneur._id}`}
                    className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    View Profile
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

        {!loading && filteredEntrepreneurs.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No entrepreneurs found.
          </div>
        )}

      </div>

    </div>
  )
}

export default Entrepreneurs