const express = require("express")

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController")

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", protect, createOrder)

router.get("/", protect, getOrders)

router.get("/:id", protect, getOrderById)

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "entrepreneur", "customer"),
  updateOrder,
 )

 // DELETE ORDER - ADMIN ONLY
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteOrder
)
module.exports = router