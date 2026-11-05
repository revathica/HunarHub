const express = require("express")

const {
  getAllUsers,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/userController")

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware")

const router = express.Router()

// Get all users (admin only)
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
)

// Get customers only
router.get(
  "/customers",
  protect,
  authorizeRoles("admin"),
  getAllCustomers
)

// Update customer
router.put(
  "/customers/:id",
  protect,
  authorizeRoles("admin"),
  updateCustomer
)

// Delete customer
router.delete(
  "/customers/:id",
  protect,
  authorizeRoles("admin"),
  deleteCustomer
)

module.exports = router