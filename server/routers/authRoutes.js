const express = require("express")

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController")

const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working",
  })
})

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/me", protect, getCurrentUser)

module.exports = router