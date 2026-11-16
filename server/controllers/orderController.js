const Order = require("../models/Order")
const Entrepreneur = require("../models/Entrepreneur")

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body)

    res.status(201).json({
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    })
  }
}


const getOrders = async (req, res) => {
  try {
    let filter = {}

    if (req.user.role === "customer") {
      filter.customerId = req.user.id
    }

    if (req.user.role === "entrepreneur") {
      const entrepreneur = await Entrepreneur.findOne({
        userId: req.user.id,
      })

      if (!entrepreneur) {
        return res.json([])
      }

      filter.entrepreneurId = entrepreneur._id
    }

    const orders = await Order.find(filter)
      .populate("customerId", "name email phone")
      .populate("entrepreneurId", "businessName skillType")
      .populate("items.productId", "name price entrepreneurId")

    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
}


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId", "name email phone")
      .populate("entrepreneurId", "businessName skillType")
      .populate("items.productId", "name price")

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    })
  }
}


const updateOrder = async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        message: "Order status is required",
      })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    const userId = req.user.id || req.user._id
    const role = req.user.role

    // Customer can only confirm their own delivered order
    if (role === "customer") {
      if (order.customerId.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "You cannot update this order",
        })
      }

      if (status !== "completed" || order.status !== "delivered") {
        return res.status(400).json({
          message: "You can only confirm a delivered order",
        })
      }
    }

    // Entrepreneur can update only their own orders
    else if (role === "entrepreneur") {
      const entrepreneur = await Entrepreneur.findOne({
        userId: userId,
      })

      if (
        !entrepreneur ||
        order.entrepreneurId.toString() !== entrepreneur._id.toString()
      ) {
        return res.status(403).json({
          message: "You cannot update this order",
        })
      }

      const allowedStatuses = [
        "confirmed",
        "processing",
        "delivered",
        "cancelled",
      ]

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status update",
        })
      }
    }

    // Admin can cancel an order
    else if (role === "admin") {
      if (status !== "cancelled") {
        return res.status(403).json({
          message: "Admin can only cancel an order here",
        })
      }
    }

    else {
      return res.status(403).json({
        message: "Not authorized",
      })
    }

    order.status = status
    await order.save()

    res.json({
      message: "Order status updated successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    await Order.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Delete Order Error:", error)

    res.status(500).json({
      message: "Failed to delete order",
    })
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
}