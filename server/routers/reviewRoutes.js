const express = require("express")

const {
  createReview,
  getReviewsByEntrepreneur,
  getReviewsByProduct,
} = require("../controllers/reviewController")

const router = express.Router()

router.post("/", createReview)

router.get("/product/:productId", getReviewsByProduct)
router.get("/:entrepreneurId", getReviewsByEntrepreneur)
module.exports = router