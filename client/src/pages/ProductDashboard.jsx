
import { useEffect, useState } from "react"

function ProductDashboard() {
  const [entrepreneur, setEntrepreneur] = useState(null)
  const [products, setProducts] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Handmade")
  const [stock, setStock] = useState("")

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const token = localStorage.getItem("token")

  // Fetch entrepreneur profile and own products
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await fetch(
          "https://hunarhub-backend-hjv6.onrender.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Profile fetch failed")
        }

        if (!data.entrepreneurProfile) {
          setEntrepreneur(null)
          return
        }

        setEntrepreneur(data.entrepreneurProfile)

        const productResponse = await fetch(
          "https://hunarhub-backend-hjv6.onrender.com/api/products"
        )

        const productData = await productResponse.json()

        if (!productResponse.ok) {
          throw new Error("Failed to fetch products")
        }

        const myProducts = productData.filter(
          (product) =>
            product.entrepreneurId?._id ===
            data.entrepreneurProfile._id
        )

        setProducts(myProducts)
      } catch (error) {
        console.error("Dashboard error:", error)
        alert(error.message)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchMyData()
  }, [token])

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Please select JPG, PNG or WEBP image.")
      e.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.")
      e.target.value = ""
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl("")
  }

  // Upload image
  const uploadImage = async () => {
    if (!selectedImage) return imageUrl

    const formData = new FormData()
    formData.append("image", selectedImage)

    setUploadingImage(true)

    try {
      const response = await fetch(
        "https://hunarhub-backend-hjv6.onrender.com/api/products/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed")
      }

      setImageUrl(data.imageUrl)
      return data.imageUrl
    } finally {
      setUploadingImage(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setCategory("Handmade")
    setStock("")
    setSelectedImage(null)
    setImagePreview("")
    setImageUrl("")
    setEditingId(null)
  }

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!entrepreneur) {
      alert("Please create your business profile first.")
      return
    }

    setLoading(true)

    try {
      let uploadedImageUrl = imageUrl

      if (selectedImage) {
        uploadedImageUrl = await uploadImage()
      }

      const productDetails = {
        entrepreneurId: entrepreneur._id,
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        isAvailable: true,
        image: uploadedImageUrl,
      }

      const url = editingId
        ? `https://hunarhub-backend-hjv6.onrender.com/api/products/${editingId}`
        : "https://hunarhub-backend-hjv6.onrender.com/api/products"

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productDetails),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Product save failed")
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      )

      resetForm()
      await fetchMyProducts()
    } catch (error) {
      console.error("Product save error:", error)
      alert(error.message || "Server connection failed")
    } finally {
      setLoading(false)
    }
  }

  // Refresh products list
  const fetchMyProducts = async () => {
    try {
      const response = await fetch(
        "https://hunarhub-backend-hjv6.onrender.com/api/products"
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error("Failed to refresh products")
      }

      const myProducts = data.filter(
        (product) =>
          product.entrepreneurId?._id === entrepreneur?._id
      )

      setProducts(myProducts)
    } catch (error) {
      console.error(error)
    }
  }

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product._id)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setCategory(product.category || "Handmade")
    setStock(product.stock)
    setImageUrl(product.image || "")

    setSelectedImage(null)

    setImagePreview(
      product.image
        ? `https://hunarhub-backend-hjv6.onrender.com${product.image}`
        : ""
    )

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Delete product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(
        `https://hunarhub-backend-hjv6.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Product deletion failed")
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      )

      if (editingId === productId) {
        resetForm()
      }

      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      alert(error.message)
    }
  }

  if (profileLoading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading your entrepreneur profile...
      </div>
    )
  }

  if (!entrepreneur) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">
          Business Profile Not Found
        </h2>
        <p>Please create your business profile first.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Product Form */}
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

          <h1 className="text-3xl font-bold text-green-700">
            {editingId ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your products in HunarHub
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block font-medium">
                Product Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Describe your product..."
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Price (₹)
              </label>

              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              >
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

            <div>
              <label className="mb-2 block font-medium">
                Stock
              </label>

              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Product Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-lg border px-4 py-3"
              />

              <p className="mt-1 text-sm text-gray-500">
                JPG, PNG, WEBP · Maximum 5 MB
              </p>

              {imagePreview && (
                <img
                  src={imagePreview.startsWith("blob:")
                    ? imagePreview
                    : imagePreview}
                  alt="Product preview"
                  className="mt-4 h-48 w-full rounded-lg border object-contain"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {uploadingImage
                ? "Uploading Image..."
                : loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-lg bg-gray-200 py-3 font-semibold"
              >
                Cancel Edit
              </button>
            )}

          </form>
        </div>

        {/* My Products */}
        <div className="mt-12">

          <h2 className="mb-6 text-2xl font-bold text-green-800">
            My Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              No products added yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="overflow-hidden rounded-xl bg-white shadow-md"
                >

                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `https://hunarhub-backend-hjv6.onrender.com${product.image}`
                      }
                      alt={product.name}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                      No Product Image
                    </div>
                  )}

                  <div className="p-5">

                    <h3 className="text-xl font-bold text-gray-800">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {product.description}
                    </p>

                    <p className="mt-3 font-semibold text-green-700">
                      ₹{product.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      Category: {product.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>

                    <div className="mt-5 flex gap-3">

                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>
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

export default ProductDashboard
