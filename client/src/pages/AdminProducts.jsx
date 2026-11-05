import { useEffect, useState } from "react"

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const [editingProduct, setEditingProduct] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editCategory, setEditCategory] = useState("Handmade")
  const [editStock, setEditStock] = useState("")
  const [saving, setSaving] = useState(false)
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setProducts(data)
      } else {
        console.error(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmed) return

    const token = localStorage.getItem("token")

    try {
      setDeletingId(productId)

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== productId
          )
        )
      } else {
        alert(data.message || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Something went wrong while deleting the product")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (product) => {
      setEditingProduct(product)
      setEditName(product.name || "")
      setEditDescription(product.description || "")
      setEditPrice(product.price ?? "")
      setEditCategory(product.category || "Handmade")
      setEditStock(product.stock ?? "")

      setEditImage(null)
      setEditImagePreview(
        product.image
          ? `http://localhost:5000${product.image}`
          : ""
      )
    }
    const handleUpdate = async (e) => {
  e.preventDefault()

  if (!editingProduct) return

  const token = localStorage.getItem("token")
  let imageUrl = editingProduct.image || ""

  try {
    setSaving(true)

    // Upload new image only if admin selected one
    if (editImage) {
      setUploadingImage(true)

      const formData = new FormData()
      formData.append("image", editImage)

      const uploadResponse = await fetch(
        "http://localhost:5000/api/products/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        alert(uploadData.message || "Image upload failed")
        return
      }

      imageUrl = uploadData.imageUrl
    }

    const response = await fetch(
      `http://localhost:5000/api/products/${editingProduct._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          price: Number(editPrice),
          category: editCategory,
          stock: Number(editStock),
          image: imageUrl,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || "Product update failed")
      return
    }

    const updatedProduct = data.product || data

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === editingProduct._id
          ? updatedProduct
          : product
      )
    )

    alert("Product updated successfully!")
    setEditingProduct(null)
    setEditImage(null)
    setEditImagePreview("")
  } catch (error) {
    console.error("Error updating product:", error)
    alert("Server connection failed")
  } finally {
    setSaving(false)
    setUploadingImage(false)
  }
} 

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold text-blue-700">
        Manage Products
      </h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h2 className="text-xl font-bold">
                {product.name}
              </h2>

              <p className="mt-2 text-gray-600">
                Price: ₹{product.price}
              </p>

              <p className="text-gray-600">
                Category: {product.category}
              </p>

              <p className="text-gray-600">
                Stock: {product.stock}
              </p>

              {product.entrepreneurId && (
                <p className="text-gray-600">
                  Entrepreneur:{" "}
                  {product.entrepreneurId.businessName}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={deletingId === product._id}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === product._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-blue-700">
              Edit Product
            </h2>

            <form
              onSubmit={handleUpdate}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  required
                  rows="4"
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Price (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Category
                </label>

                <select
                  value={editCategory}
                  onChange={(e) =>
                    setEditCategory(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-2"
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
                <label className="mb-1 block font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={editStock}
                  onChange={(e) =>
                    setEditStock(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">
                  Product Image
                </label>

                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    alt="Product preview"
                    className="mb-3 h-32 w-32 rounded-lg border object-cover"
                  />
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0]

                    if (!file) return

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ]

                    if (!allowedTypes.includes(file.type)) {
                      alert("Please select a JPG, PNG, or WEBP image")
                      e.target.value = ""
                      return
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image must be smaller than 5 MB")
                      e.target.value = ""
                      return
                    }

                    setEditImage(file)
                    setEditImagePreview(URL.createObjectURL(file))
                  }}
                  className="w-full rounded-lg border px-4 py-2"
                />

                <p className="mt-1 text-sm text-gray-500">
                  Choose a new image only if you want to replace the current one.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving
                    ? uploadingImage
                      ? "Uploading image..."
                      : "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct(null)
                  }
                  className="rounded-lg bg-gray-500 px-5 py-2 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts