const Review = require("../models/Review")

const createReview = async (req, res) => {
  try {
    const {
      customerId,
      entrepreneurId,
      productId,
      orderId,
      rating,
      comment,
    } = req.body

    if (!customerId || !entrepreneurId || !productId || !orderId || !rating) {
      return res.status(400).json({
        message: "Customer, entrepreneur, product, order and rating are required",
      })
    }

    const review = await Review.create({
      customerId,
      entrepreneurId,
      productId,
      orderId,
      rating,
      comment,
    })

    res.status(201).json({
      message: "Review created successfully",
      review,
    })
  } catch (error) {
    console.error("Review Error:", error)

    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    })
  }
}

const getReviewsByEntrepreneur = async (req, res) => {
  try {
    const reviews = await Review.find({
      entrepreneurId: req.params.entrepreneurId,
    })
      .populate("customerId", "name")
      .populate("productId", "name price image")
      .populate("orderId")

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )

    const averageRating =
      reviews.length > 0
        ? Number((totalRating / reviews.length).toFixed(1))
        : 0

    res.json({
      reviews,
      averageRating,
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error("Fetch Reviews Error:", error)

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    })
  }
}

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    })
      .populate("customerId", "name")
      .populate("productId", "name price image")

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )

    const averageRating =
      reviews.length > 0
        ? Number((totalRating / reviews.length).toFixed(1))
        : 0

    res.json({
      reviews,
      averageRating,
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error("Fetch Product Reviews Error:", error)

    res.status(500).json({
      message: "Failed to fetch product reviews",
      error: error.message,
    })
  }
}

module.exports = {
  createReview,
  getReviewsByEntrepreneur,
  getReviewsByProduct,
}