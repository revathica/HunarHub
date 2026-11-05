const ServiceRequest = require("../models/ServiceRequest")

const createServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.create(req.body)

    res.status(201).json({
      message: "Service request created successfully",
      serviceRequest,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service request",
      error: error.message,
    })
  }
}

const getServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find()
      .populate("customerId", "name email phone")
      .populate("entrepreneurId", "businessName skillType")

    res.json(serviceRequests)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service requests",
      error: error.message,
    })
  }
}

const updateServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      })
    }

    res.json({
      message: "Service request updated successfully",
      serviceRequest,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service request",
      error: error.message,
    })
  }
}

module.exports = {
  createServiceRequest,
  getServiceRequests,
  updateServiceRequest,
}