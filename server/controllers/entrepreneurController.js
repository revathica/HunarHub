const Entrepreneur = require("../models/Entrepreneur")

const getEntrepreneurs = async (req, res) => {
  try {
    const entrepreneurs = await Entrepreneur.find().populate(
      "userId",
      "name email phone"
    )

    res.json(entrepreneurs)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch entrepreneurs",
      error: error.message,
    })
  }
}

const getEntrepreneurById = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findById(req.params.id).populate(
      "userId",
      "name email phone"
    )

    if (!entrepreneur) {
      return res.status(404).json({
        message: "Entrepreneur not found",
      })
    }

    res.json(entrepreneur)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch entrepreneur",
      error: error.message,
    })
  }
}

const createEntrepreneur = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.create({
      ...req.body,
      userId: req.user.id || req.user._id,
    })

    res.status(201).json({
      message: "Entrepreneur profile created successfully",
      entrepreneur,
    })
  } catch (error) {
    console.error("Create entrepreneur error:", error)

    res.status(500).json({
      message: "Failed to create entrepreneur profile",
      error: error.message,
    })
  }
}
const updateEntrepreneur = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!entrepreneur) {
      return res.status(404).json({
        message: "Entrepreneur not found",
      })
    }

    res.json({
      message: "Entrepreneur profile updated successfully",
      entrepreneur,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update entrepreneur profile",
      error: error.message,
    })
  }
}
const verifyEntrepreneur = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    )

    if (!entrepreneur) {
      return res.status(404).json({
        message: "Entrepreneur not found",
      })
    }

    res.json({
      message: "Entrepreneur verified successfully",
      entrepreneur,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to verify entrepreneur",
      error: error.message,
    })
  }
}
const deleteEntrepreneur = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findByIdAndDelete(
      req.params.id
    )

    if (!entrepreneur) {
      return res.status(404).json({
        message: "Entrepreneur not found",
      })
    }

    res.json({
      message: "Entrepreneur deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete entrepreneur",
      error: error.message,
    })
  }
}
module.exports = {
  getEntrepreneurs,
  getEntrepreneurById,
  createEntrepreneur,
  updateEntrepreneur,
  verifyEntrepreneur,
  deleteEntrepreneur,
  
}