
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check whether user still exists and is active
    const user = await User.findById(decoded.id || decoded._id)

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
      })
    }

    // Check deleted account
if (user.isDeleted === true) {
  return res.status(403).json({
    message: "Your account has been deleted.",
  })
}

// Check inactive account
if (user.isActive === false) {
  return res.status(403).json({
    message: "Your account is deactivated. Please contact support.",
  })
}

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      role: user.role,
      email: user.email,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    })
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      })
    }

    next()
  }
}

module.exports = {
  protect,
  authorizeRoles,
}
