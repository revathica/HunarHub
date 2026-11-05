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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )


    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      })
    }

    res.json({
      message: "Order updated successfully",
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