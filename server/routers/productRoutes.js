const express = require("express")
const upload = require("../middleware/upload")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")

const { protect, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getProductById)
router.post(
  "/upload-image",
  protect,
  authorizeRoles("entrepreneur", "admin"),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      })
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/products/${req.file.filename}`,
    })
  }
)

router.post("/", createProduct)

router.put("/:id", updateProduct)

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
)

module.exports = router