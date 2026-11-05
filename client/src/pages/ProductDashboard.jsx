import { useEffect, useState } from "react"

function ProductDashboard() {
  const [entrepreneur, setEntrepreneur] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Handmade")
  const [stock, setStock] = useState("")

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))

        const response = await fetch(
          "http://localhost:5000/api/entrepreneurs"
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profiles")
        }

        const myProfile = data.find(
          (item) => item.userId?._id === user?.id
        )

        if (!myProfile) {
          console.error("Entrepreneur profile does not match logged-in user")
          return
        }

        setEntrepreneur(myProfile)
      } catch (error) {
        console.error("Profile fetch error:", error)
      }
    }

    fetchMyProfile()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WEBP image.")
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

  const uploadImage = async () => {
    if (!selectedImage) return ""

    const token = localStorage.getItem("token")
    const formData = new FormData()

    formData.append("image", selectedImage)

    setUploadingImage(true)

    try {
      const response = await fetch(
        "http://localhost:5000/api/products/upload-image",
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!entrepreneur) {
      alert("Please create your entrepreneur profile first.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      let uploadedImageUrl = imageUrl

      if (selectedImage && !uploadedImageUrl) {
        uploadedImageUrl = await uploadImage()
      }

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            entrepreneurId: entrepreneur._id,
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            isAvailable: true,
            image: uploadedImageUrl,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Product creation failed")
        return
      }

      alert("Product added successfully!")

      setName("")
      setDescription("")
      setPrice("")
      setStock("")
      setCategory("Handmade")
      setSelectedImage(null)
      setImagePreview("")
      setImageUrl("")
    } catch (error) {
      console.error("Product creation error:", error)
      alert(error.message || "Server connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-green-700">
          Add Product
        </h1>

        <p className="mt-2 text-gray-600">
          Add your handmade products to HunarHub
        </p>

        {!entrepreneur && (
          <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-yellow-700">
            Loading your entrepreneur profile...
          </div>
        )}

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
              placeholder="Example: Handmade Leather Wallet"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
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
              placeholder="Describe your product..."
              rows="4"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
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
              placeholder="Example: 500"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
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
              placeholder="Example: 10"
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
              JPG, PNG, or WEBP · Maximum 5 MB
            </p>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product preview"
                className="mt-4 h-48 w-full rounded-lg border object-contain"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage || !entrepreneur}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
              ? "Adding Product..."
              : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductDashboard