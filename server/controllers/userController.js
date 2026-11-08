
const User = require("../models/User")
const Entrepreneur = require("../models/Entrepreneur")

// Helper: Get logged-in user ID
const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId
}

// Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
        isDeleted: { $ne: true },
      }).select("-password")
    res.json(users)
    } catch (error) {
    console.error("GET PROFILE ERROR:", error)

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
}

// Get customers only (Admin)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    }).select("-password")

    res.json(customers)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    })
  }
}

// Update customer (Admin)
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    const customer = await User.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      })
    }

    if (customer.role !== "customer") {
      return res.status(403).json({
        message: "Only customer accounts can be updated",
      })
    }

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: customer._id },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
      })
    }

    customer.name = name.trim()
    customer.email = normalizedEmail
    customer.phone = phone || ""

    await customer.save()

    const updatedCustomer = await User.findById(
      customer._id
    ).select("-password")

    res.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update customer",
      error: error.message,
    })
  }
}

// Delete customer (Admin)
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      })
    }

    if (customer.role !== "customer") {
      return res.status(403).json({
        message: "Only customer accounts can be deleted",
      })
    }

    await User.findByIdAndDelete(customer._id)

    res.json({
      message: "Customer deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: error.message,
    })
  }
}

// Get logged-in user's profile

const getMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req)
    console.log("PROFILE USER ID:", userId)
    console.log("PROFILE USER:", req.user)

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    let entrepreneurProfile = null

    if (user.role === "entrepreneur") {
      entrepreneurProfile = await Entrepreneur.findOne({
        userId: user._id,
      })
    }

    res.json({
      user,
      entrepreneurProfile,
    })

    } catch (error) {
    console.error("GET PROFILE ERROR:", error)

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
}


// Update logged-in user's profile
const updateMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req)

    const { name, email, phone, address, profileImage } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        })
      }
      user.name = name.trim()
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase()

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      })

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already registered",
        })
      }

      user.email = normalizedEmail
    }

    if (phone !== undefined) user.phone = phone
    if (address !== undefined) user.address = address
    if (profileImage !== undefined) {
      user.profileImage = profileImage
    }

    await user.save()

    const updatedUser = await User.findById(user._id).select("-password")

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    })
  }
}

// Activate / Deactivate User (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin account status cannot be changed",
      })
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Valid account status is required",
      })
    }

    user.isActive = isActive
    await user.save()

    res.json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: await User.findById(user._id).select("-password"),
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    })
  }
}

// Soft Delete User (Admin)
const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }
    // Prevent deleted users from being activated
    if (user.isDeleted === true) {
      return res.status(403).json({
        message: "Deleted accounts cannot be activated.",
      })
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot be deleted",
      })
    }

    if (user.isDeleted) {
      return res.status(400).json({
        message: "User is already deleted",
      })
    }

    user.isDeleted = true
    user.isActive = false

    await user.save()

    res.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    })
  }
}


// Deactivate own account
const deactivateMyAccount = async (req, res) => {
  try {
    const userId = getUserId(req)

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot be deactivated here",
      })
    }

    user.isActive = false
    await user.save()

    res.json({
      message: "Account deactivated successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to deactivate account",
      error: error.message,
    })
  }
}

module.exports = {
  getAllUsers,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getMyProfile,
  updateMyProfile,
  deactivateMyAccount,
  toggleUserStatus,
  softDeleteUser,
}
