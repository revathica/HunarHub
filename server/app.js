const express = require("express")
const path = require("path")
const cors = require("cors")

const authRoutes = require("./routers/authRoutes")
const entrepreneurRoutes = require("./routers/entrepreneurRoutes")
const productRoutes = require("./routers/productRoutes")
const serviceRequestRoutes = require("./routers/serviceRequestRoutes")
const orderRoutes = require("./routers/orderRoutes")
const reviewRoutes = require("./routers/reviewRoutes")
const userRoutes = require("./routers/userRoutes")

const app = express()

app.use(cors())


app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/entrepreneurs", entrepreneurRoutes)
app.use("/api/products", productRoutes)
app.use("/api/service-requests", serviceRequestRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/users", userRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
  res.json({
    message: "HunarHub API is running successfully",
  })
})

module.exports = app