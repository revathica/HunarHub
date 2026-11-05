const User = require("../models/User")

// Get all users (existing function)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

// Get customers only
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

// Update customer details
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    const customer = await User.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      })
    }

    // Only customer accounts can be updated
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

    // Check whether email is already used by another account
    const existingUser = await User.findOne({
      email,
      _id: { $ne: customer._id },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
      })
    }

    customer.name = name
    customer.email = email
    customer.phone = phone || ""

    await customer.save()

    const updatedCustomer = await User.findById(customer._id).select(
      "-password"
    )

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

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      })
    }

    // Only customer accounts can be deleted
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

module.exports = {
  getAllUsers,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
}