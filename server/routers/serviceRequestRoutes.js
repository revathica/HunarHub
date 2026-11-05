const express = require("express")

const {
  createServiceRequest,
  getServiceRequests,
  updateServiceRequest,
} = require("../controllers/serviceRequestController")

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createServiceRequest
)

router.get(
  "/",
  protect,
  getServiceRequests
)

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "entrepreneur"),
  updateServiceRequest
)

module.exports = router