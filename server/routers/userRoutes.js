const express = require("express")

const {
  getAllUsers,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
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
// Logged-in user's profile
router.get("/me",
   protect,
    getMyProfile
  )

// Update own profile
router.put("/me",
   protect,
    updateMyProfile
  )

// Deactivate own account
router.put("/deactivate", 
  protect, 
  deactivateMyAccount
)

module.exports = router