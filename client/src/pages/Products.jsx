import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [productRatings, setProductRatings] = useState({})
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://hunarhub-backend-hjv6.onrender.com/api/products"
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          )
        }

        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])


useEffect(() => {
  const fetchProductRatings = async () => {
    try {
      const results = await Promise.all(
        products.map(async (product) => {
          const response = await fetch(
            `https://hunarhub-backend-hjv6.onrender.com/api/reviews/product/${product._id}`
          )

          if (!response.ok) {
            return [product._id, { averageRating: 0, reviewCount: 0 }]
          }

          const data = await response.json()

          return [
            product._id,
            {
              averageRating: data.averageRating || 0,
              reviewCount: data.reviewCount || 0,
            },
          ]
        })
      )

      setProductRatings(Object.fromEntries(results))
    } catch (error) {
      console.error("Failed to fetch product ratings:", error)
    }
  }

  if (products.length > 0) {
    fetchProductRatings()
  }
}, [products])


  const filteredProducts = products.filter((product) => {
    const productName = product.name || ""
    const description = product.description || ""
    const productCategory = product.category || ""

    const matchesSearch =
      productName.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || productCategory === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-green-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
         <center><h1 className="text-4xl font-bold">
            HunarHub Marketplace
          </h1>

          <p className="mt-3 text-green-100">
           <i> Discover handmade products from local entrepreneurs.</i>
          </p></center> 
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            placeholder="Search products..."
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
            <option value="Handmade">Handmade</option>
              <option value="Accessories">Accessories</option>
              <option value="Pottery">Pottery</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Footwear">Footwear</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Other">Other</option>
          </select>

        </div>

        {/* Products */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading products...
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="h-48 overflow-hidden bg-green-100">
                {product.image ? (
                  <img
                    src={`https://hunarhub-backend-hjv6.onrender.com${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl">
                    🛍️
                  </div>
                )}
              </div>

                <div className="p-6">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h2>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {product.category}
                    </span>

                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    {product.description}
                  </p>

                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="font-semibold text-amber-500">
                        ⭐ {productRatings[product._id]?.averageRating
                          ? productRatings[product._id].averageRating.toFixed(1)
                          : "No ratings yet"}
                      </span>

                      {productRatings[product._id]?.reviewCount > 0 && (
                        <span className="text-gray-500">
                          ({productRatings[product._id].reviewCount} reviews)
                        </span>
                      )}
                    </div>


                  <p className="mt-4 text-2xl font-bold text-green-700">
                    ₹{product.price}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>

                  {product.entrepreneurId && (
                    <p className="mt-2 text-sm text-gray-600">
                      Seller:{" "}
                      <span className="font-semibold">
                        {product.entrepreneurId.businessName}
                      </span>
                    </p>
                  )}

                <div className="mt-5">
                  <button
                    onClick={() => {
                      if (!user) {
                        alert("Please login to add products to cart!")
                        navigate("/login")
                        return
                      }

                      if (user.role !== "customer") {
                        alert("Only customers can add products to cart!")
                        return
                      }

                      const savedCart = localStorage.getItem("cart")
                      const cart = savedCart ? JSON.parse(savedCart) : []

                      const existingItem = cart.find(
                        (item) => item._id === product._id
                      )

                      let updatedCart

                      if (existingItem) {
                        updatedCart = cart.map((item) =>
                          item._id === product._id
                            ? {
                                ...item,
                                cartQuantity: item.cartQuantity + 1,
                              }
                            : item
                        )
                      } else {
                        updatedCart = [
                          ...cart,
                          {
                            ...product,
                            cartQuantity: 1,
                          },
                        ]
                      }

                      localStorage.setItem("cart", JSON.stringify(updatedCart))
                      alert("Product added to cart!")
                    }}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>


                </div>

              </div>
            ))}

          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No products found.
          </div>
        )}

      </div>
    </div>
  )
}

export default Products