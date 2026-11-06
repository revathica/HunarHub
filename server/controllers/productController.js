const Product = require("../models/Product")
const Entrepreneur = require("../models/Entrepreneur")

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "entrepreneurId",
      "businessName skillType"
    )

    res.json(products)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    })
  }
}

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "entrepreneurId",
      "businessName skillType"
    )

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    })
  }
}

// Create product
const createProduct = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    let entrepreneurId = req.body.entrepreneurId

    // Entrepreneur can add products only to their own business
    if (req.user.role === "entrepreneur") {
      const entrepreneur = await Entrepreneur.findOne({ userId })

      if (!entrepreneur) {
        return res.status(404).json({
          message: "Entrepreneur profile not found",
        })
      }

      entrepreneurId = entrepreneur._id
    }

    if (!entrepreneurId) {
      return res.status(400).json({
        message: "Entrepreneur ID is required",
      })
    }

    const product = await Product.create({
      entrepreneurId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      isAvailable: req.body.isAvailable,
      image: req.body.image,
    })

    res.status(201).json({
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    })
  }
}

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    // Check ownership for entrepreneur
    if (req.user.role === "entrepreneur") {
      const entrepreneur = await Entrepreneur.findOne({
        userId: req.user.id || req.user._id,
      })

      if (
        !entrepreneur ||
        product.entrepreneurId.toString() !== entrepreneur._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only edit your own products",
        })
      }
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "isAvailable",
      "image",
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field]
      }
    })

    await product.save()

    res.json({
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    // Check ownership for entrepreneur
    if (req.user.role === "entrepreneur") {
      const entrepreneur = await Entrepreneur.findOne({
        userId: req.user.id || req.user._id,
      })

      if (
        !entrepreneur ||
        product.entrepreneurId.toString() !== entrepreneur._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only delete your own products",
        })
      }
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}