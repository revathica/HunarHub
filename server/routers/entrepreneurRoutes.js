const express = require("express")

const {
  getEntrepreneurs,
  getEntrepreneurById,
  createEntrepreneur,
  updateEntrepreneur,
  verifyEntrepreneur,
  deleteEntrepreneur,
} = require("../controllers/entrepreneurController")

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.get("/", getEntrepreneurs)
router.get("/:id", getEntrepreneurById)

// Protected entrepreneur routes

router.post(
  "/",
  protect,
  authorizeRoles("entrepreneur"),
  createEntrepreneur
)

router.put(
  "/:id",
  protect,
  authorizeRoles("entrepreneur","admin"),
  updateEntrepreneur
)
router.put(
  "/verify/:id",
  protect,
  authorizeRoles("admin"),
  verifyEntrepreneur
)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEntrepreneur
)

module.exports = router