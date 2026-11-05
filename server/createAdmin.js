require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./models/User")

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existingAdmin = await User.findOne({
      email: "admin@hunarhub.com",
    })

    if (existingAdmin) {
      console.log("Admin already exists")
      process.exit()
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10)

    await User.create({
      name: "HunarHub Admin",
      email: "admin@hunarhub.com",
      password: hashedPassword,
      phone: "",
      role: "admin",
    })

    console.log("Admin created successfully")
    console.log("Email: admin@hunarhub.com")
    console.log("Password: Admin@123")

    process.exit()
  } catch (error) {
    console.error("Failed to create admin:", error.message)
    process.exit(1)
  }
}

createAdmin()